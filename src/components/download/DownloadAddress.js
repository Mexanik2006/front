import React, { useContext, useEffect, useState, useRef } from 'react';
import Axios from '../../api/Api';
import { Link } from 'react-router-dom';
import "./downloadStyle.css";
import { Button, Popconfirm, Table, Input, Space } from 'antd';
import { useAuthContext } from '../../hooks/useAuthContext';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../sidebar/Sidebar';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

function DownloadAddress() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { sensor, setSensor } = useContext(AuthContext);
    const { user } = useAuthContext();
    const [userName, setUserName] = useState(null);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [addressesResponse, userResponse] = await Promise.all([
                Axios.get('/address/get', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }),
                Axios.get('/api/meget', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }),
            ]);

            setData(addressesResponse.data);
            setUserName(userResponse.data.userName);
        } catch (error) {
            console.error('Error occurred while fetching data:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [user, sensor]);

    const deleteUser = async (id) => {
        setIsLoading(true);
        setSensor(false);
        try {
            await Axios.delete(`/address/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            fetchData();
        } catch (error) {
            console.error('Error occurred while deleting user:', error);
        }
        setIsLoading(false);
        setSensor(true);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{ padding: 8 }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    return (
        <div className='sidebat_main'>
            <div className="sidebar_title">
                <h1>{userName ? `Hello ${userName}, you can download the address from here` : "Hello friend, you can download the address from here"}</h1>
            </div>
            <div className="sidebar_container">
                <div className="sidebar_address">
                    <Sidebar />
                </div>
                <div className='address_down'>
                    <h3 className='download_title'>List of addresses:</h3>
                    {isLoading ? (
                        <div className="loaderRotatingLines">
                            <div className="download-spinner-container">
                                <div className="spinner-bar-download bar_download1"></div>
                                <div className="spinner-bar-download bar_download2"></div>
                                <div className="spinner-bar-download bar_download3"></div>
                                <div className="spinner-bar-download bar_download4"></div>
                                <div className="spinner-bar-download bar_download5"></div>
                                <div className="spinner-bar-download bar_download6"></div>
                                <div className="spinner-bar-download bar_download7"></div>
                                <div className="spinner-bar-download bar_download8"></div>
                                <div className="spinner-bar-download bar_download9"></div>
                                <div className="spinner-bar-download bar_download10"></div>
                            </div>
                        </div>
                    ) : (
                        <Table dataSource={data} className='tablesinlleuser' rowKey="_id">
                            <Table.Column
                                title="URL Address"
                                dataIndex="addresslink"
                                key="addresslink"
                                render={(text) => (
                                    <Link to={text} target="_blank" rel="noopener noreferrer">
                                        {text}
                                    </Link>
                                )}
                            />
                            <Table.Column title="Label Address" dataIndex="label" key="label" {...getColumnSearchProps('label')} />
                            <Table.Column
                                title="Added Time"
                                dataIndex="createdAt"
                                key="createdAt"
                                render={(text, record) => (
                                    <span>{String(new Date(record.createdAt).getDate()).padStart(2, '0')} {new Date(record.createdAt).toLocaleDateString('default', { month: 'long' })} {new Date(record.createdAt).getFullYear()} yil</span>
                                )}
                            />
                            <Table.Column title="Delete" dataIndex="actions" key="actions" render={(text, record) => (
                                <Popconfirm
                                    title="Do you want to delete the address?"
                                    description={`You are deleting ${record.addresslink}...`}
                                    onConfirm={() => deleteUser(record._id)}
                                    onCancel={() => console.log('Cancelled')}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button danger>Delete</Button>
                                </Popconfirm>
                            )} />
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DownloadAddress;
