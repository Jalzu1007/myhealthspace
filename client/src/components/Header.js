import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import { useLocation } from "react-router-dom";
 function Header() {
  const location = useLocation();
  const loggedIn = Auth.loggedIn();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
    return (
        <Navbar collapseOnSelect expand="sm" >
          {loggedIn ? (
            <>
              <Navbar.Brand as={Link} to="/" className="brand brand-logged d-flex align-items-center">
                {/* <img alt="heart" style={{ display: "inline" }} src={heart} className="heart-icon" /> */}
                myhealthspace
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
              <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                <Nav >
                  {/* use eventKey to show navbar style from react bootstrap */}
                  <Nav.Link as={Link} to="/exercise" eventKey="1" >Exercise</Nav.Link>
                  <Nav.Link as={Link} to="/profile" eventKey="2">Profile</Nav.Link>
                  <Nav.Link onClick={Auth.logout} >Logout </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </>) :
            (<Navbar.Brand as={Link} to="/" className={`brand brand-new mx-auto d-flex align-items-center
              ${isLoginPage || isSignupPage ? "brand-text" : null}`}>
              {/* <img alt="heart" style={{ display: "inline" }} src={heart} className="heart-icon" /> */}
              myhealthspace
            </Navbar.Brand>
            )}
            <Nav.Link as={Link} to="/donate" eventKey="3" >Donate</Nav.Link>
        </Navbar >
      );
    }
    export default Header