import axios from '../../api/Api';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import Sidebar from '../sidebar/Sidebar';
import { Button, Table, message, Space, Avatar } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { deleteObject, getDownloadURL, listAll, ref } from 'firebase/storage';
import { imageDB } from '../../firebase/Firebase';
import { logoMap } from './LogoMap';

function DownloadFile() {
    const { user } = useAuthContext();
    const [data, setData] = useState(null);
    const [files, setFiles] = useState([]); // State to hold fetched files
    const [fileUrls, setFileUrls] = useState([]); // Initialize as an empty array

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

    // Fetch files from the backend
    const fetchFiles = async () => {
        try {
            const response = await axios.get('/uploadFile/file', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setFiles(response.data.files); // Update files state
        } catch (error) {
            console.error('Error occurred while fetching files:', error);
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchData();
            fetchFiles(); // Fetch files when the user is authenticated
        }
    }, [user]);

    // Handle file deletion
    const onDelete = async (fileRef, fileName) => {
        try {
            await deleteObject(fileRef);
            message.success(`${fileName} deleted successfully.`);
            setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName)); // Remove file from state
        } catch (error) {
            console.error('Error deleting the file:', error);
            message.error(`Failed to delete ${fileName}`);
        }
    };

    // Handle file open in a new tab
    const onOpenFile = (fileUrl) => {
        window.open(fileUrl, '_blank'); // Open file in new tab
    };

    // Determine the logo based on file extension
    const getLogo = (fileName) => {
        if (!fileName) {
            return 'https://via.placeholder.com/32'; // Return a default logo if fileName is undefined
        }
        const extension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
        return logoMap[`.${extension}`] || 'https://via.placeholder.com/32'; // Default logo if extension not found
    };

    // Table columns
    const columns = [
        {
            title: 'Logo',
            key: 'logo',
            render: (text, record) => <Avatar src={getLogo(record.name)} size="default" />,
        },
        {
            title: 'File Name',
            dataIndex: 'name', // Changed to 'name' to match the data structure
            key: 'name',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={() => onOpenFile(record.url)}
                    >
                        Download
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(ref(imageDB, record.filePath), record.name)} // Delete using Firebase ref
                        danger
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    // Fetch files from Firebase Storage
    useEffect(() => {
        const fetchFiles = async () => {
            const filesRef = ref(imageDB, "files"); // Reference to the Firebase folder
            try {
                const files = await listAll(filesRef); // Get the list of files
                const urls = await Promise.all(
                    files.items.map(async (item) => {
                        const url = await getDownloadURL(item); // Get the download URL
                        return { url, name: item.name, filePath: item.fullPath }; // Return file details as an object
                    })
                );
                setFileUrls(urls); // Ensure we store an array
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, []);

    return (
        <div className="sidebat_main">
            <div className="sidebar_title">
                {data ? (
                    <h1>{`Hello ${data.userName}, here are your uploaded files`}</h1>
                ) : (
                    <h1>Hello friend, welcome to the server</h1>
                )}
            </div>
            <div className="sidebar_container">
                <div className="sidebar_address">
                    <Sidebar />
                </div>
                <div className="download_section">
                    <h2>Your Uploaded Files</h2>
                    {Array.isArray(fileUrls) && fileUrls.length > 0 ? (
                        <Table
                            columns={columns}
                            dataSource={fileUrls.map((file, index) => ({
                                key: index,
                                name: file.name,
                                url: file.url,
                                filePath: file.filePath, // Using Firebase file path for deletion
                            }))}
                            rowKey="name"
                            pagination={false}
                            bordered
                        />
                    ) : (
                        <p>No files found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DownloadFile;
