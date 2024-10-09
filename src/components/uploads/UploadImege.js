import React, { useEffect, useState } from 'react';
import axios from '../../api/Api';
import './uploadStyle.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import Sidebar from '../sidebar/Sidebar';
import app from '../../firebase/Firebase';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';

function UploadImage() {
    const { user } = useAuthContext();
    const [data, setData] = useState(null);
    const [img, setImg] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
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
        if (img) {
            uploadFile(img, "imgUrl");
        }
    }, [img]);

    const uploadFile = (file, fileType) => {
        const storage = getStorage(app);
        const folder = "images/";
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, folder + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress.toFixed(2)}% done`);

                setImgPerc(progress);
            },
            (error) => {
                console.error('Upload error:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log('File available at', downloadURL);
                    setInputs((prev) => ({
                        ...prev,
                        [fileType]: downloadURL,
                    }));
                    setImgPerc(0);

                    // Yuklangan rasm URL manzilini MongoDB-ga saqlash
                    try {
                        await axios.post(`/image/images`, {
                            imgUrl: downloadURL,
                            // Qo'shimcha ma'lumotlar bo'lsa, ularni inputs orqali yuboring
                            ...inputs,
                        }, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        });
                        console.log('Image successfully saved to MongoDB');
                    } catch (error) {
                        console.error('Error saving image to MongoDB:', error);
                    }
                });
            }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (img) {
            uploadFile(img, "imgUrl");
        }
    };

    return (
        <div className="sidebat_main">
            <div className="sidebar_title">
                {data ? (
                    <h1>{`Hello ${data.userName}, you can upload images`}</h1>
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
                            <label htmlFor="image">Image:</label>
                            <br />
                            {imgPerc > 0 && <span>Uploading: {imgPerc.toFixed(2)}%</span>}
                            <br />
                            <input type="file" accept='image/*' id='image' onChange={(e) => setImg(e.target.files[0])} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UploadImage;
