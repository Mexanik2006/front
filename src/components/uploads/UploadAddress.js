import Axios from '../../api/Api';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import Sidebar from '../sidebar/Sidebar';
import './uploadStyle.css';

function UploadAddress() {
    const { setSensor } = useContext(AuthContext);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); // Spinner ko'rinishini boshqarish uchun state

    const success = async () => {
        await messageApi
            .open({
                type: 'loading',
                content: 'Address sending...',
            })
            .then(() => message.success('Address soccessfull upload...'));
    };

    const error = async () => {
        await messageApi.open({
            type: 'error',
            content: 'Bu xatolik xabari',
        });
    };

    const { user } = useAuthContext();

    const sendForm = async (values) => {
        setSensor(false);
        setIsLoading(true); // Spinnerni ko'rsatish
        try {
            await Axios.post(
                '/address/create',
                {
                    addresslink: values.addresslink,
                    label: values.label,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            success();
        } catch (err) {
            console.error(err);
            error();
        } finally {
            setIsLoading(false); // Spinnerni yashirish
            setSensor(true);
        }
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        sendForm(values); // Send form data to Axios
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    const [data, setData] = useState(null); // Set initial data to null

    const fetchData = async () => {
        try {
            const response = await Axios.get('/api/meget', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setData(response.data); // Set the fetched user data
        } catch (error) {
            console.error('Error occurred while fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]); // Add user.token as a dependency to refetch if token changes
    return (
        <div className="sidebat_main">
            <div className="sidebar_title">
                {data ? ( // Conditional rendering based on fetched data
                    <h1>{`Hello ${data.userName}, you can upload address`}</h1>
                ) : (
                    <h1>Hello friend welcome to the server</h1> // Loading state
                )}
            </div>
            <div className="sidebar_container">
                <div className="sidebar_address">
                    <Sidebar />
                </div>
                <div className="address_container">
                    <Form
                        className="address_form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div className="address_title">
                            <h3>Add new address url:</h3>
                        </div>
                        <div className="address_inputs">
                            <Form.Item
                                name="addresslink"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input address url!',
                                    },
                                ]}
                            >
                                <Input placeholder="Please input address url..." />
                            </Form.Item>

                            <Form.Item
                                name="label"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input label url!',
                                    },
                                ]}
                            >
                                <Input placeholder="Please input label url..." />
                            </Form.Item>

                            <div className="form_btn">
                                {contextHolder}
                                <Form.Item>
                                    {isLoading ? (
                                        <Button className='address_loadbtn'>
                                            <div className="spinner-container">
                                                <div className="spinner-bar bar1"></div>
                                                <div className="spinner-bar bar2"></div>
                                                <div className="spinner-bar bar3"></div>
                                                <div className="spinner-bar bar4"></div>
                                                <div className="spinner-bar bar5"></div>
                                                <div className="spinner-bar bar6"></div>
                                                <div className="spinner-bar bar7"></div>
                                                <div className="spinner-bar bar8"></div>
                                            </div>
                                            <div className="address_loadtext">
                                                Upload address
                                            </div>
                                        </Button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            Upload address
                                        </Button>
                                    )}

                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default UploadAddress;
