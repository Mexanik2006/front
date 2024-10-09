import axios from '../../api/Api';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import Sidebar from '../sidebar/Sidebar';
import "./downloadStyle.css";
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space, Empty, message } from 'antd';
import { imageDB } from '../../firebase/Firebase';
import { ref, deleteObject } from 'firebase/storage';

function DownloadVideo() {
    const { user } = useAuthContext();
    const [data, setData] = useState(null);
    const [videos, setVideos] = useState([]); // State to hold fetched videos
    const [loading, setLoading] = useState(false); // State to show loading status

    // Fetch user-specific data
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/meget', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setData(response.data);
        } catch (error) {
            console.error('Error occurred while fetching user data:', error);
        }
    };

    // Fetch videos from the backend
    const fetchVideos = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get('/uploadVideo/video', { // Ensure this endpoint exists in your backend
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setVideos(response.data.videos); // Update videos state
        } catch (error) {
            console.error('Error occurred while fetching videos:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchData();
            fetchVideos(); // Fetch videos when the user is authenticated
        }
    }, [user]);

    // Handle video download
    const onDownload = (videoUrl, videoName) => {
        fetch(videoUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = videoName || 'downloaded-video.mp4'; // Set a default name if videoName is not provided
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(url);
                link.remove();
            })
            .catch(error => console.error('Error downloading the video:', error));
    };

    // Handle video deletion from Firebase
    const handleDelete = async (fullPath, videoName) => {
        const videoRef = ref(imageDB, fullPath); // Firebase ref for deleting the video
        try {
            await deleteObject(videoRef); // Delete video from Firebase
            message.success(`${videoName} successfully deleted`);
            setVideos((prevVideos) => prevVideos.filter((video) => video.fullPath !== fullPath)); // Remove from frontend
        } catch (error) {
            console.error('Error deleting video:', error);
            message.error('Error occurred while deleting the video.');
        }
    };

    return (
        <div className="sidebat_main">
            <div className="sidebar_title">
                {data ? (
                    <h1>{`Hello ${data.userName}, here are your uploaded videos`}</h1>
                ) : (
                    <h1>Hello friend, welcome to the server</h1> // Loading state
                )}
            </div>
            <div className="sidebar_container">
                <div className="sidebar_address">
                    <Sidebar />
                </div>
                <div className="download_section">
                    <h2>Your Uploaded Videos</h2>
                    <div className="downVideo">
                        {loading ? (
                            <p>Loading...</p> // Show loading message while videos are being fetched
                        ) : videos.length === 0 ? (
                            <Empty description="No videos found" /> // Show "No videos found" if no videos
                        ) : (
                            <div className="videoDown">
                                <Space direction="vertical" size="large">
                                    <div className="videos">
                                        {videos.map((video) => (
                                            <Space key={video._id} direction="vertical">
                                                <video width="320" height="240" controls>
                                                    <source src={video.videoUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                                <Space size={12} className="toolbar-wrapper">
                                                    <DownloadOutlined onClick={() => onDownload(video.videoUrl, video.name)} />
                                                    <DeleteOutlined onClick={() => handleDelete(video.fullPath, video.name)} />
                                                </Space>
                                            </Space>
                                        ))}
                                    </div>

                                </Space>
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DownloadVideo;
