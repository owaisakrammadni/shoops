import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, MDBIcon } from "mdbreact";
import { Table } from 'react-bootstrap';
import moment from 'moment';

const url = 'http://localhost:5000';
export default function GetOrders() {

    const [getOrders, setGetOrders] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url: url + '/getOrders',
            withCredentials: true
        }).then((response) => {
            setGetOrders(response.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [getOrders])
    console.log("Get Order ===> :", getOrders)

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

    function deleteStatus(id) {
        axios({
            method: 'post',
            url: url + '/deleteStatus',
            data: {
                id: id,
                status: "Order Cancelled"
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
                            <th>Order Date</th>
                            <th>Total Price</th>
                            <th>Confirm Status</th>
                        </tr>
                    </thead>
                    {getOrders.map((eachItem) => (
                        <tbody>
                            <tr>
                                <th scope="row">{eachItem._id}</th>
                                <td>{eachItem.name}</td>
                                <td>{eachItem.email}</td>
                                <td>{eachItem.address}</td>
                                <td>{eachItem.phoneNumber}</td>
                                <td>{eachItem.status}</td>
                                <td>
                                    {eachItem.orders.map((e) => {
                                        return (
                                            <>
                                                {e.cart.map((s) => {
                                                    return (
                                                        <>
                                                            <tr>
                                                                <td>{s.productName}</td>
                                                                <td>{s.qty + " Kg"}</td>
                                                            </tr>
                                                        </>
                                                    )
                                                })}
                                            </>
                                        )
                                    })}
                                </td>
                                <td>{moment(eachItem.createdOn).format('LLLL')}</td>
                                <td>{eachItem.totalPrice}</td>
                                <td>
                                    <center><button className="btn btn-light" onClick={() => {
                                        updateStatus(eachItem._id)
                                    }} >Confirm Order</button>
                                    <button className="btn btn-light" onClick={() => {
                                        deleteStatus(eachItem._id)
                                    }}><MDBIcon far icon="trash-alt" /></button></center>
                                </td>
                            </tr>
                        </tbody>
                    ))}

                </Table>
            </Container>
        </div>
    )
}
