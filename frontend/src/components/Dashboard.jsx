import React, { useState, useEffect } from "react";
import './dashboard.css';
import { useGlobalState, useGlobalStateUpdate } from './../context/GlobalContext';
import axios from 'axios';
import { MDBRow } from "mdbreact";
import Basket from './Basket';

const url = 'http://localhost:5000';
function Dashboard() {

    const globalState = useGlobalState();
    const setGlobalState = useGlobalStateUpdate();

    const [products, setProducts] = useState([]);
    const [show, ShowHide] = useState(true);

    useEffect(() => {
        axios({
            method: 'get',
            url: url + '/getProducts',
            withCredentials: true
        })
            .then((response) => {
                setProducts(response.data.data)
            }).catch((error) => {
                console.log(error);
            });
    }, [])
    console.log("Show Products : ", products);

    function onAdd(e, index) {
        console.log("onAdd function Index : ", index);
        console.log("onAdd function e : ", e);

        e.qty = 1;

        setGlobalState((prev) => {
            let cartItems = prev.cart;
            cartItems = [...cartItems, e]

            var found = prev.cart.filter((eachCartItem, i) => eachCartItem._id === e._id);
            var newState;
            if (found.length) {
                newState = { ...prev }
            }
            else{
                newState = {...prev, cart: cartItems}
            }
            localStorage.setItem("cart", JSON.stringify(newState.cart));
            return newState;
        })
    }

    function onRemove(e, index) {

    }

    function changeState() {
        ShowHide(Prev => !Prev)
    }

    return (
        <>
            {/* {globalState.user ?
                <div>
                    <h2>Welcome , {globalState.user.name}</h2>
                </div> : null}
            {'===>' + JSON.stringify(globalState)} */}
            <a className="btn btn-outline-success" onClick={changeState}
                style={{ float: 'right' }} href><i class="fas fa-cart-plus mr-3" /><span>{globalState.cart.length}</span><span className="sr-only">(current)</span></a>
            <MDBRow>

                {show === true ? <main className="container">
                    <h1 className="text-center mt-1">Products</h1>
                    <div className="row">
                        {products.map((e, index) => (
                            <div className="col-md-3 mt-3" key={e.id}>
                                <div style={{ textAlign: 'center' }}>
                                    <img className="w-100" height="200" src={e.productImage[0]} alt={e.productName} />
                                    <h3 style={{ textAlign: 'center', marginTop: '10px' }}>{e.productName}</h3>
                                    <p class="card-text">{e.productDescription}</p>
                                    <div>PKR: {e.productPrice}/-Per kg</div>
                                    <div>
                                        <button className="btn btn-primary" onClick={() => onAdd(e, index)}>Add To Cart</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main> :

                    <Basket />}
            </MDBRow>
            {"=====> : " + JSON.stringify(globalState.cart)}
        </>
    );
}

export default Dashboard;