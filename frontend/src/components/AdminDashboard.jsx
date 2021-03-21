import React from 'react';
import { useGlobalState } from '../context/GlobalContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';

function AdminDashboard() {

    const globalState = useGlobalState();

    return (
        <>
            {globalState.user ?
                <div>
                    <h1>Welcome , {globalState.user.name} (Admin Dashboard)</h1>
                </div> : null}
            {JSON.stringify(globalState)}

            {/* <div className="row justify-content-md-center d-flex">
                    {data.map((e) => {
                        return (
                            <div className="col-3">
                                {e.activeStatus}
                            </div>
                        )
                    })}
                </div> */}
        </>
    )
}

export default AdminDashboard;