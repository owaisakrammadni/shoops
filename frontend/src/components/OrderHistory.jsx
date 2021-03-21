import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, MDBIcon } from "mdbreact";
import { Table } from 'react-bootstrap';

const url = 'http://localhost:5000';
export default function OrderHistory() {

    const [getOrders, setGetOrders] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url: url + '/orderHistory',
            withCredentials: true
        }).then((response) => {
            setGetOrders(response.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [getOrders])
    console.log("Get Order from Server ===> :", getOrders)

    function updateStatus(id) {
        axios({
            method: 'post',
            url: url + '/updateStatus',
            data: {
                id: id,
                status: "Order Confirmed"
            },
            withCredentials: true
        }).then((response) => {
            alert(response.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div>
            <Container>
                <h1>My Order Details</h1>
                <Table striped bordered hover>
                    <thead style={{ textAlign: "center" }}>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Phone Number</th>
                            <th>Status</th>
                            <th>Orders</th>
                            <th>Total Price</th>
                            <th>Confirm Status</th>
                        </tr>
                    </thead>
                    {getOrders.map((e) => (
                        <tbody>
                            <tr>
                                <th scope="row">{e._id}</th>
                                <td>{e.name}</td>
                                <td>{e.email}</td>
                                <td>{e.address}</td>
                                <td>{e.phoneNumber}</td>
                                <td>{e.status}</td>
                                <td>{e.orders.length}</td>
                                <td>{e.totalPrice}</td>
                                <td>
                                    <button className="btn btn-light" onClick={() => {
                                        updateStatus(e._id)
                                    }} >Confirm Order</button>
                                </td>
                            </tr>
                        </tbody>
                    ))}

                </Table>
            </Container>
        </div>
    )
}