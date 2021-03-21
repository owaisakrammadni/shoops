import React from "react";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import './App.css';
import { Navbar, Form, Nav } from 'react-bootstrap';

import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';

import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import LogoutButton from './components/LogoutButton';
import AddProducts from './components/AddProducts';
import AllProducts from './components/AllProducts';
import CheckoutForm from './components/CheckoutForm';
import MyOrders from './components/MyOrders';
import GetOrders from './components/GetOrders';
import OrderHistory from './components/OrderHistory';

import { useGlobalState } from './context/GlobalContext';

function App() {

  const globalState = useGlobalState();

  return (
    <>
      <Router>
        <nav>
          <Navbar bg="dark" variant="dark">
            {(globalState.loginStatus === false) ?
              <>
                <Nav className="mr-auto">
                  <Nav.Link><Link to="/">Home</Link></Nav.Link>
                  <Nav.Link><Link to="/login">Login</Link></Nav.Link>
                  <Nav.Link><Link to="/signup">Signup</Link></Nav.Link>
                </Nav>
              </>
              : null
            }

            {(globalState.loginStatus === true) ?
              <>
                {(globalState.role === "admin") ?
                  <>
                    <Nav className="mr-auto">
                      <Nav.Link><Link to="/">Admin Dashboard</Link></Nav.Link>
                      <Nav.Link><Link to="/allproducts">All Products</Link></Nav.Link>
                      <Nav.Link><Link to="/addproducts">Add Products</Link></Nav.Link>
                      <Nav.Link><Link to="/getorders">Orders</Link></Nav.Link>
                      <Nav.Link><Link to="/orderhistory">Orders History</Link></Nav.Link>
                    </Nav>
                    <Form inline>
                      <LogoutButton />
                    </Form>
                  </>
                  :
                  <>
                    <Nav className="mr-auto">
                      <Nav.Link><Link to="/">Dashboard</Link></Nav.Link>
                      <Nav.Link><Link to="/myorders">Orders</Link></Nav.Link>
                      {/* <Nav.Link><Link to="/cart">Add Products</Link></Nav.Link> */}
                    </Nav>
                    <Form inline>
                      <LogoutButton />
                    </Form>
                  </>
                }

              </>
              : null
            }
          </Navbar>
        </nav>


          {/* Public Routes */}
          {(globalState.role === null) ?
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/signup">
                <Signup />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
            : null
          }

          {(globalState.role === "user") ?
            <Switch>
              <Route exact path="/">
                <Dashboard />
              </Route>

              <Route path="/checkout">
                <CheckoutForm />
              </Route>

              <Route path="/myorders">
                <MyOrders />
              </Route>

              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
            : null
          }

          {(globalState.role === "admin") ?
            <Switch>
              <Route exact path="/">
                <AdminDashboard />
              </Route>

              <Route path="/addproducts">
                <AddProducts />
              </Route>

              <Route path="/allproducts">
                <AllProducts />
              </Route>

              <Route path="/getorders">
                <GetOrders />
              </Route>

              <Route path="/orderhistory">
                <OrderHistory />
              </Route>

              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
            : null}
      </Router>

    </>
  )

}


export default App;

// import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBIcon } from "mdbreact";

// class App extends Component {
//   state = {
//     isOpen: false
//   };

//   toggleCollapse = () => {
//     this.setState({ isOpen: !this.state.isOpen });
//   }

//   render() {
//     return (
//       <>
//         <Router>
//           <MDBNavbar color="default-color" dark expand="md">
//             <MDBNavbarBrand>
//               <strong className="white-text">Navbar</strong>
//             </MDBNavbarBrand>
//             <MDBNavbarToggler onClick={this.toggleCollapse} />
//             <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
//               <MDBNavbarNav left>
//                 <MDBNavItem active>
//                   <MDBNavLink to="/">Home</MDBNavLink>
//                 </MDBNavItem>
//                 <MDBNavItem>
//                   <MDBNavLink to="#!">Features</MDBNavLink>
//                 </MDBNavItem>
//                 <MDBNavItem>
//                   <MDBNavLink to="#!">Pricing</MDBNavLink>
//                 </MDBNavItem>
//               </MDBNavbarNav>
//               <MDBNavbarNav right>
//                 <MDBNavItem>
//                   <MDBNavLink className="waves-effect waves-light" to="#!">
//                     <MDBIcon fab icon="twitter" />
//                   </MDBNavLink>
//                 </MDBNavItem>
//                 <MDBNavItem>
//                   <MDBNavLink className="waves-effect waves-light" to="#!">
//                     <MDBIcon fab icon="google-plus-g" />
//                   </MDBNavLink>
//                 </MDBNavItem>
//                 <MDBNavItem>
//                   <MDBNavLink to="/login">Login</MDBNavLink>
//                 </MDBNavItem>
//                 <MDBNavItem>
//                   <MDBNavLink to="/signup">Signup</MDBNavLink>
//                 </MDBNavItem>
//               </MDBNavbarNav>
//             </MDBCollapse>
//           </MDBNavbar>

//           <Switch>
//             <Route exact path="/">
//               <Home />
//             </Route>
//             <Route path="/login">
//               <Login />
//             </Route>
//             <Route path="/signup">
//               <Signup />
//             </Route>
//             <Route path="/dashboard">
//               <Dashboard />
//             </Route>
//           </Switch>

//         </Router>
//       </>
//     );
//   }
// }