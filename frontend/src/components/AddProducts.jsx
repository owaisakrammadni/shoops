import React, { useState, useRef } from 'react';
import { useGlobalState } from './../context/GlobalContext';
import { Button, Col, Form, Container, Row, Card } from "react-bootstrap";
import Fallback from './../images/default.jpg';
import axios from 'axios';

let url = 'http://localhost:5000'
export default function AddProducts() {

    // const globalState = useGlobalState();

    const [data, setData] = useState([]);
    const [images, setImages] = useState([Fallback, Fallback, Fallback]);
    const [imageURL, setImageURL] = useState([]);

    const productName = useRef();
    const productPrice = useRef();
    const productDescription = useRef();
    const productQuantity = useRef();
    const activeStatus = useRef();

    function handleSubmit(event) {
        event.preventDefault();

        axios({
            method: 'post',
            url: url + '/updateproducts',
            data: {
                productName: productName.current.value,
                productPrice: productPrice.current.value,
                productImage: imageURL,
                productDescription: productDescription.current.value,
                productQuantity: productQuantity.current.value,
                activeStatus: activeStatus.current.value
            }, withCredentials: true
        })
            .then((response) => {
                if (response.data.status === 200) {
                    alert(response.data.message);
                    setData((previousValue) => {
                        return previousValue.concat([response.data.data]);
                    });
                    productName.current.value = "";
                    productPrice.current.value = "";
                    productDescription.current.value = "";
                    productQuantity.current.value = "";
                    activeStatus.current.value = "";
                } else {
                    alert(response.data.message);
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    function Upload(e, index) {

        var fileInput = document.getElementById("fileInput");
        const file = e.target.files[0];
        const reader = new FileReader();

        console.log("fileInput: ", fileInput);
        console.log("fileInput: ", fileInput.files[0]);

        let formData = new FormData();

        formData.append("myFile", fileInput.files[0]); // file input is for browser only, use fs to read file in nodejs client
        formData.append("myName", "sameer"); // this is how you add some text data along with file
        formData.append("myDetails",
            JSON.stringify({
                "subject": "Science",   // this is how you send a json object along with file, you need to stringify (ofcourse you need to parse it back to JSON on server) your json Object since append method only allows either USVString or Blob(File is subclass of blob so File is also allowed)
                "year": "2021"
            })
        );

        axios({
            method: 'post',
            url: url + "/upload",
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
            .then(response => {
                console.log(response.data.message);
                alert(response.data.message);
                setImageURL(prev => {
                    return prev.concat(response.data.url);
                })

                reader.addEventListener("load", function () {
                    setImages(prev => {
                        prev[index] = reader.result;
                        return [].concat(prev)
                    });
                }, false)

                if (file) {
                    reader.readAsDataURL(file);
                }

            })
            .catch(err => {
                console.log(err);
            })

        return false; // dont get confused with return false, it is there to prevent html page to reload/default behaviour, and this have nothing to do with actual file upload process but if you remove it page will reload on submit -->

    }
    function check(event) {
        event.preventDefault();
    }

    return (
        <>
            <h1>AddProducts</h1>
            {/* {JSON.stringify(globalState)} */}

            <div>
                <Container fluid="md">
                    <Row className="justify-content-md-center">
                        <Form onSubmit={handleSubmit}>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control type="name" placeholder="Product Name" ref={productName} required />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridPassword">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="text" placeholder="Price" ref={productPrice} required />
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="formGridAddress1">
                                <Form.Label>Choose Product Image</Form.Label>
                                <div className="row justify-content d-flex" style={{ border: '1px solid black' }}>
                                    {images.map((eachImage, index) => (
                                        <div className='col-4'>
                                            <form onSubmit={check}>
                                                <div className="file-upload" key={index}>
                                                    <img src={eachImage} alt="FallBack" id="show_pic" />
                                                    <input type="file" onChange={(e) => { Upload(e, index) }} id="fileInput" required />
                                                </div>
                                            </form>
                                        </div>
                                    ))}
                                </div>
                            </Form.Group>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridPassword">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control type="text" placeholder="Quantity" ref={productQuantity} required />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Active Status</Form.Label> <br />
                                    <select ref={activeStatus} style={{ height: "38px", width: "100%", border: "1px solid #D3D3D3", borderRadius: "5px" }}>
                                        <option value="True">True</option>
                                        <option value="False">False</option>
                                    </select>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="formGridAddress2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="text" placeholder="Description" ref={productDescription} required />
                            </Form.Group>

                            <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                    </Row>

                    <div className="row justify-content-md-center d-flex">
                        {data.map((e, i) => {
                            return (
                                <div className="col-4 mt-4">
                                    <Card style={{ width: '18rem' }}>
                                        <center><Card.Img variant="top" style={{ width: "100px", marginTop: "10px" }} src={e.productImage[0]} /></center>
                                        <Card.Body>
                                            <Card.Title>Product Name : {e.productName}</Card.Title>
                                            <Card.Text>
                                                Description : {e.productDescription} <br />
                                                Price : {e.productPrice + "$"} <br />
                                                Quantity : {e.productQuantity} <br />
                                                Active Status : {e.activeStatus}
                                            </Card.Text>
                                            <center><Button variant="primary">SHOW</Button></center>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>

                </Container>

            </div>
        </>
    );
}