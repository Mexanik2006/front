import React, { useState } from 'react';
import { Menu } from 'antd';
import { IoHome } from 'react-icons/io5';
import { FaCloudDownloadAlt, FaCloudUploadAlt } from 'react-icons/fa';
import { SiAmazonsimpleemailservice } from 'react-icons/si';
import { FiDownloadCloud, FiUploadCloud } from 'react-icons/fi';
import { HiArrowLeftOnRectangle } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { RiVideoDownloadLine, RiVideoUploadLine } from 'react-icons/ri';

const Sidebar = () => {
    const { dispatch } = useAuthContext();
    const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
    };

    // Menu items definition
    const items = [
        {
            key: '1',
            icon: <IoHome />,
            label: <Link to="/">Home</Link>,
        },
        {
            key: '2',
            icon: <FaCloudUploadAlt />,
            label: 'Upload',
            children: [
                {
                    key: '21',
                    icon: <SiAmazonsimpleemailservice />,
                    label: 'Upload address',
                    label: <Link to="/address-upload">Upload address</Link>,
                },
                {
                    key: '22',
                    icon: <FiUploadCloud />,
                    label: 'Upload Image',
                    label: <Link to="/image-upload">Upload Image</Link>,
                },
                {
                    key: '23',
                    icon: <RiVideoUploadLine />,
                    label: 'Upload Video',
                    label: <Link to="/video-upload">Upload Video</Link>,
                },
                {
                    key: '24',
                    icon: <RiVideoUploadLine />,
                    label: 'Upload File',
                    label: <Link to="/file-upload">Upload File</Link>,
                },
            ],
        },
        {
            key: '3',
            icon: <FaCloudDownloadAlt />,
            label: 'Download',
            children: [
                {
                    key: '31',
                    icon: <SiAmazonsimpleemailservice />,
                    label: 'Download address',
                    label: <Link to="/address-download">Download address</Link>,
                },
                {
                    key: '32',
                    icon: <FiDownloadCloud />,
                    label: 'Download Image',
                    label: <Link to="/image-download">Download Image</Link>,

                },
                {
                    key: '33',
                    icon: <RiVideoDownloadLine />,
                    label: 'Download Video',
                    label: <Link to="/video-download">Download Video</Link>,
                },
                {
                    key: '34',
                    icon: <RiVideoDownloadLine />,
                    label: 'Download File',
                    label: <Link to="/file-download">Download File</Link>,
                },
            ],
        },
        {
            type: 'divider',
        },
        {
            key: '4',
            icon: <HiArrowLeftOnRectangle />,
            label: <Link to="/login" onClick={logout}>Log out</Link>,
        },
    ];

    // Function to map levels of menu items
    const getLevelKeys = (items) => {
        const key = {};
        const func = (items, level = 1) => {
            items.forEach((item) => {
                if (item.key) {
                    key[item.key] = level;
                }
                if (item.children) {
                    func(item.children, level + 1);
                }
            });
        };
        func(items);
        return key;
    };

    const levelKeys = getLevelKeys(items);

    // Handle menu open state change
    const onOpenChange = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => !stateOpenKeys.includes(key));
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
            setStateOpenKeys(
                openKeys
                    .filter((_, index) => index !== repeatIndex)
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
            );
        } else {
            setStateOpenKeys(openKeys);
        }
    };

    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['231']}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            items={items}
            className='sidebar_menyu'
        />
    );
};

export default Sidebar;
