import React, { useEffect, useState } from 'react';
import axios from '../../api/Api';
import './uploadStyle.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import Sidebar from '../sidebar/Sidebar';
import app from '../../firebase/Firebase';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';

function UploadVideo() {
    const { user } = useAuthContext();
    const [data, setData] = useState(null);
    const [video, setVideo] = useState(undefined);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});

    useEffect(() => {
        if (user && user.token) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/meget', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setData(response.data);
        } catch (error) {
            console.error('Error occurred while fetching data:', error);
        }
    };

    useEffect(() => {
        if (video) {
            uploadFile(video, "videoUrl");
        }
    }, [video]);

    const uploadFile = (file, fileType) => {
        const storage = getStorage(app);
        const folder = "videos/";
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, folder + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setVideoPerc(progress);
                console.log(`Upload is ${progress.toFixed(2)}% done`);
            },
            (error) => {
                console.error('Upload error:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    // Store the download URL and other data in MongoDB
                    saveToMongoDB(downloadURL);
                    setVideoPerc(0);
                });
            }
        );
    };

    const saveToMongoDB = async (downloadURL) => {
        try {
            // Make an API request to save the video URL and other information in MongoDB
            await axios.post('/uploadVideo/video', {
                videoUrl: downloadURL,
                // Add other data that you want to store in MongoDB, for example:
                userId: user._id,
                uploadDate: new Date(),
                title: inputs.title || 'Video title',  // Example of additional data
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            console.log("Video successfully uploaded to MongoDB");
        } catch (error) {
            console.error("Error saving video to MongoDB:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Trigger file upload when form is submitted
        if (video) {
            uploadFile(video, "videoUrl");
        }
    };

    return (
        <div className="sidebat_main">
            <div className="sidebar_title">
                {data ? (
                    <h1>{`Hello ${data.userName}, you can upload videos`}</h1>
                ) : (
                    <h1>Hello friend welcome to the server</h1>
                )}
            </div>
            <div className="sidebar_container">
                <div className="sidebar_address">
                    <Sidebar />
                </div>
                <div className="upload_form">
                    <form onSubmit={handleSubmit}>
                        <div className="form_group">
                            <label htmlFor="video">Video:</label>
                            <br />
                            {videoPerc > 0 && <span>Uploading: {videoPerc.toFixed(2)}%</span>}
                            <br />
                            <input type="file" accept="video/*" id="video" onChange={(e) => setVideo(e.target.files[0])} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UploadVideo;
