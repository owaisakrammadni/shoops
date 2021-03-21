import React, { useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './login.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useGlobalState, useGlobalStateUpdate } from '../context/GlobalContext';

const url = 'http://localhost:5000';
function Login() {

    const globalState = useGlobalState()
    const setGlobalState = useGlobalStateUpdate()

    const history = useHistory();
    let [show, setShow] = useState();

    function handleLogin(event) {
        event.preventDefault();
        axios({
            method: 'post',
            url: url + "/auth/login",
            data: {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            }, withCredentials: true
        })
            .then((response) => {
                if (response.data.status === 200) {
                    // alert(response.data.message);
                    setGlobalState(prev => {
                        return { ...prev, user: response.data.user, loginStatus: true, role: response.data.user.role }
                    })
                }
                else {
                    setShow(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function createAccount() {
        history.push("./signup");
    }

    return (
        <>
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="6">
                        <form className="loginCenter" onSubmit={handleLogin}>
                            <p className="h4 text-center mb-4">Sign in</p>
                            <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                Your email
                        </label>
                            <input type="email" id="email" className="form-control" required />
                            <br />
                            <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
                                Your password
                        </label>
                            <input type="password" id="password" className="form-control" required />
                            <div className="text-center mt-4">
                                <MDBBtn color="indigo" type="submit">Login</MDBBtn>
                            </div>
                            <br />
                            <center><span className="createAccount" onClick={createAccount}>I don't have an account</span></center>
                        </form>
                        {/* {JSON.stringify(globalState)} */}
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

            { show ? <div className="alert alert-danger" role="alert"> {show} </div> : null}
        </>
    );
};

export default Login;