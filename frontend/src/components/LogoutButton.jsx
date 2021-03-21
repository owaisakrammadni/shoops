import axios from 'axios';
import { useGlobalStateUpdate } from '../context/GlobalContext';
import {Button} from 'react-bootstrap';

let url = 'http://localhost:5000'
function LogoutButton() {

    const setGlobalState = useGlobalStateUpdate();

    function logout() {
        axios({
            method: "POST",
            url: url + "/auth/logout",
            withCredentials: true
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    // alert(response.data.message);
                    setGlobalState((prev) => ({ ...prev, loginStatus: false, role: null, user: null, cart: [] }))
                }
            }, (error) => {
                console.log(error.message);
            })
    }
    return (<Button variant="info" onClick={logout}>Logout</Button>)
}

export default LogoutButton;