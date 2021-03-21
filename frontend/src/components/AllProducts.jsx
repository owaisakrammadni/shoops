import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container } from "mdbreact";

const url = 'http://localhost:5000';
export default function AllProducts() {

    const [products, setProducts] = useState([]);
    useEffect(() => {
        axios({
            method: 'get',
            url: url + '/auth/getProducts',
            withCredentials: true
        })
            .then((response) => {
                setProducts(response.data.data)
            }).catch((error) => {
                console.log(error);
            });
    }, [])
    console.log("Show Products : ", products);
    return (
        <>
            <Container>
                <h1 className="text-center mt-1 ">All Products</h1>
                <div className="row justify-content-md-center d-flex">
                    {products.map((e) => (
                        <div className="col-3 mt-4 ml-4" style={{ border: "1px solid black" }}>
                            <div>
                                <center><img width="70%" height="200" src={e.productImage[0]} />
                                    <h3>{e.productName}</h3>
                                    <p class="card-text">{e.productDescription} <br />
                                        Rs: {e.productPrice}/= Per kg
                                        </p>
                                    <div>
                                        <button className="btn btn-primary">SHOW</button>
                                    </div></center>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </>
    )
}
