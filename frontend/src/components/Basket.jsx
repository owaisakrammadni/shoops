import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useGlobalState, useGlobalStateUpdate } from './../context/GlobalContext';
import { Container } from 'mdbreact'

export default function Basket() {

    const globalState = useGlobalState();
    const globalStateUpdate = useGlobalStateUpdate();

    const history = useHistory();
    console.log("Basket My Order ===> : ", globalState);

    const itemsPrice = globalState.cart.reduce((accumulator, currentValue) => accumulator + currentValue.qty * currentValue.productPrice, 0);
    const totalPrice = itemsPrice;

    function increment(index) {
        console.log("Function increment : ", index);
        globalStateUpdate((prev) => {
            let cart = prev.cart;
            prev.cart[index].qty = prev.cart[index].qty + 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            return { ...prev, cart: cart }
        })
    }

    function decrement(index) {
        console.log("Function decrement : ", index);
        globalStateUpdate((prev) => {
            let cart = prev.cart;
            console.log("Decremetn ka function ====> : ", cart);
            prev.cart[index].qty = prev.cart[index].qty === 1 ? 1 : prev.cart[index].qty - 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            return { ...prev, cart: cart }
        })
    }

    function checkout() {
        globalStateUpdate(prev => ({
            ...prev,
            cart: {cart: globalState.cart, totalPrice: totalPrice}
        }))
        history.push('/checkout')
    }

    function deleteItem(index) {
        globalStateUpdate((prev) => {
            let cart = prev.cart;
            prev.cart = prev.cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            return { ...prev, cart: cart }
        })
    }

    return (
        <Container>
            <section>

                <div className="row">

                    <div className="col-lg-8">

                        <div className="mb-3">
                            <div className="pt-4 wish-list">

                                <h5 className="mb-4">Cart (<span>{globalState.cart.length}</span> items)</h5>
                                {/* ------------------------------------------------------------------------------------------------------ */}
                                {globalState.cart.map((e, index) => {
                                    return (
                                        <div className="row mb-4">
                                            <div className="col-md-5 col-lg-3 col-xl-3">
                                                <div className="view zoom overlay z-depth-1 rounded mb-3 mb-md-0">
                                                    <img className="img-fluid w-100" src={e.productImage[0]} alt="Sample" style={{ width: "100%", height: "170px" }} />
                                                    <a href="#!">
                                                        <div className="mask">
                                                            <img className="img-fluid w-100" src={e.productImage[0]} style={{ width: "100%", height: "170px" }} />
                                                            <div className="mask rgba-black-slight"></div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="col-md-7 col-lg-9 col-xl-9">
                                                <div>
                                                    <div className="d-flex justify-content-between" >
                                                        <div>
                                                            <h5>{e.productName}</h5> <br />
                                                            {/* <p className="mb-3 text-muted text-uppercase small">STOCK AVAILABLE :{e.productQuantity} - {e.stock}</p> */}
                                                            <p className="mb-2 text-muted text-uppercase small">DESCRIPTION : {e.productDescription}</p>
                                                            <a href type="button" class="card-link-secondary small text-uppercase mr-3"><i
                                                                class="fas fa-trash-alt mr-1"></i><span onClick={(e) => deleteItem(index)}>Remove item</span> </a>
                                                        </div>
                                                        <div>
                                                            <div className="def-number-input number-input safari_only mb-0 w-100">
                                                                <button onClick={() => decrement(index)} className="minus" id="dec">-</button>
                                                                <input className="quantity" min="0" name="quantity" value={e.qty} type="text" style={{ textAlign: "center", width: "50px" }} />
                                                                <button onClick={() => increment(index)} className="plus" id="inc">+</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br />
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p className="mb-0"><span><strong>${e.productPrice * e.qty}</strong></span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* ------------------------------------------------------------------------------------------------------ */}
                                <p className="text-primary mb-0"><i className="fas fa-info-circle mr-1"></i> Do not delay the purchase, adding items to your cart does not mean booking them.</p>

                            </div>
                        </div>

                    </div>

                    <div className="col-lg-4">

                        <div className="mb-3">
                            <div className="pt-4">

                                <h5 className="mb-3">The total amount of</h5>

                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0"><span>$25.98</span></li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        Shipping
                                <span>Gratis</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                        <div>
                                            <strong>The total amount of</strong>
                                            <strong>
                                                <p className="mb-0">(including VAT)</p>
                                            </strong>
                                        </div>
                                        <span><strong>${totalPrice}</strong></span>
                                    </li>
                                </ul>

                                <button type="button" className="btn btn-primary btn-block" onClick={checkout}>go to checkout</button>

                            </div>
                        </div>

                    </div>

                </div>

            </section>
        </Container>
    )
}
