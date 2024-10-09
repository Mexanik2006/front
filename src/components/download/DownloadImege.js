import axios from '../../api/Api';
import React, { useEffect, useState, useContext } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import Sidebar from '../sidebar/Sidebar';
import "./downloadStyle.css";
import { DownloadOutlined, SwapOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomOutOutlined, ZoomInOutlined, UndoOutlined, DeleteOutlined } from '@ant-design/icons';
import { Image, Space, Empty, message } from 'antd';
import { AuthContext } from '../../context/AuthContext';

function DownloadImage() {
    const { user } = useAuthContext();
    const [data, setData] = useState(null);
    const [images, setImages] = useState([]); // State to hold fetched images
    const [loading, setLoading] = useState(false); // State to show loading status
    const { sensor, setSensor } = useContext(AuthContext);
    console.log(images)
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

    const fetchImages = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get('/image/images', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setImages(response.data); // Update images state
            console.log(response.data)
        } catch (error) {
            console.error('Error occurred while fetching images:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchData();
            fetchImages(); // Fetch images when the user is authenticated
        }
    }, [user]);

    // Handle image download
    const onDownload = (imgUrl, imgName) => {
        fetch(imgUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = imgName || 'downloaded-image.png'; // Set a default name if imgName is not provided
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(url);
                link.remove();
            })
            .catch(error => console.error('Error downloading the image:', error));
    };

    // Handle image deletion from backend
    const deleteUser = async (id) => {
        setSensor(false); // Optionally, disable some UI during deletion
        try {
            await axios.delete(`/image/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            message.success('Image deleted successfully');
            // Remove the deleted image from the frontend state
            setImages(prevImages => prevImages.filter(image => image._id !== id));
        } catch (error) {
            console.error('Error occurred while deleting image:', error);
            message.error('Failed to delete image');
        } finally {
            setSensor(true); // Re-enable UI components after deletion
        }
    };

    return (
        <div className="sidebat_main">
            <div className="sidebar_title">
                {data ? ( // Conditional rendering based on fetched data
                    <h1>{`Hello ${data.userName}, here are your uploaded images`}</h1>
                ) : (
                    <h1>Hello friend, welcome to the server</h1> // Loading state
                )}
            </div>
            <div className="sidebar_container">
                <div className="sidebar_address">
                    <Sidebar />
                </div>
                <div className="download_section">
                    <h2>Your Uploaded Images</h2>
                    <div className="downImage">
                        {loading ? (
                            <p>Yuklanmoqda...</p> // Yuklanayotgan holatda xabar chiqadi
                        ) : images.length === 0 ? (
                            <Empty description="Rasm yo'q" /> // Agar rasm bo'lmasa "Rasm yo'q" xabari chiqadi
                        ) : (
                            <Image.PreviewGroup
                                preview={{
                                    toolbarRender: (
                                        _,
                                        {
                                            image: { imgUrl },
                                            transform: { scale },
                                            actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn, onReset },
                                        },
                                    ) => (
                                        <Space size={12} className="toolbar-wrapper">
                                            <DownloadOutlined onClick={() => onDownload(imgUrl)} />
                                            <SwapOutlined rotate={90} onClick={onFlipY} />
                                            <SwapOutlined onClick={onFlipX} />
                                            <RotateLeftOutlined onClick={onRotateLeft} />
                                            <RotateRightOutlined onClick={onRotateRight} />
                                            <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                            <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                            <UndoOutlined onClick={onReset} />
                                            <DeleteOutlined onClick={() => deleteUser(images.find(img => img.imgUrl === imgUrl)._id)} />
                                        </Space>
                                    ),
                                }}
                            >
                                {images.map((img) => (
                                    <Space key={img._id} direction="vertical"> {/* Har bir tasvir uchun `_id` ishlatildi */}
                                        <Image
                                            src={img.imgUrl}
                                            className='img'
                                        />
                                    </Space>
                                ))}
                            </Image.PreviewGroup>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DownloadImage;
