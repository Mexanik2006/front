import React, { useContext, useEffect, useState } from 'react';
import Axios from '../api/Api';
import { Link } from 'react-router-dom';

import { RotatingLines } from 'react-loader-spinner';
import { Button, Popconfirm, Table } from 'antd';
import { useAuthContext } from '../hooks/useAuthContext';
import { AuthContext } from '../context/AuthContext';

function Userslist() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { sensor, setSensor } = useContext(AuthContext);
    const { user } = useAuthContext();
    console.log(data)
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await Axios.get('/client/get', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setData(response.data);
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
            await Axios.delete(`/client/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            fetchData(); // Refresh the data after deleting a user
        } catch (error) {
            console.error('Error occurred while deleting user:', error);
        }
        setIsLoading(false);
        setSensor(true);
    };

    return (
        <ul className='userlistt'>
            <h1 className='userlist_title'>Qarzdorlar ro'yhati</h1>
            {isLoading ? (
                <div className="loaderRotatingLines">
                    <RotatingLines
                        visible={true}
                        height="50"
                        width="50"
                        color="#008000"
                        strokeWidth="5"
                        animationDuration="3000"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
            ) : (
                <div>
                    <Table dataSource={data} className='tablesinlleuser' rowKey="_id" scroll={{ x: 1300 }}>
                        <Table.Column title="Ismi" dataIndex="debtorname" key="debtorname" />
                        <Table.Column title="Qancha qarzi bor" dataIndex="howmuchdebt" key="howmuchdebt" />
                        <Table.Column title="Nima olgan" dataIndex="whatcameout" key="whatcameout" />
                        <Table.Column title="Telefon raqami" dataIndex="phonenumber" key="phonenumber" render={(text, record) => (
                            <span>+{record.phonenumber}</span>
                        )} />
                        <Table.Column title="Manzili" dataIndex="phonenumber" key="phonenumber" render={(text, record) => (
                            <span>{record.userAdress}</span>
                        )} />
                        <Table.Column
                            title="Qo'shilgan vaqti"
                            dataIndex="createdAt"
                            key="createdAt"
                            render={(text, record) => (
                                <span>{String(new Date(record.createdAt).getDate()).padStart(2, '0')} {new Date(record.createdAt).toLocaleDateString('default', { month: 'long' })} {new Date(record.createdAt).getFullYear()} yil</span>
                            )}
                        />
                        <Table.Column title="Qardorni ko'rish" dataIndex="actions" key="actions" render={(text, record) => (
                            <Link className='link' to={`/debt/${record._id}`}>
                                Ko'rish
                            </Link>
                        )} />

                        <Table.Column title="Taxrirlash" dataIndex="actions" key="actions" render={(text, record) => (
                            <Link className='link' to={`/debt/${record._id}`}>
                                Taxrirlash
                            </Link>
                        )} />
                        <Table.Column title="O'chirish" dataIndex="actions" key="actions" render={(text, record) => (
                            <Popconfirm
                                title="Qarzdorni o'chirmoqchimisiz?"
                                description={`Siz ${record.debtorname} ni o'chirmoqdasiz...`}
                                onConfirm={() => deleteUser(record._id)}
                                onCancel={() => console.log('Bekor qilindi')}
                                onOpenChange={() => console.log('open change')}
                                okText="Ha"
                                cancelText="Yo'q"
                            >
                                <Button danger>O'chirish</Button>
                            </Popconfirm>
                        )} />
                    </Table>

                </div>
            )}
        </ul>
    );
}

export default Userslist;
