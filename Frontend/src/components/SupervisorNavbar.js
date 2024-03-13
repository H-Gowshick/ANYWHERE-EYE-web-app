// SupervisorNavbar.js

import React from "react";
import { Navbar, Nav,Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../logo.svg";

const SupervisorNavbar = ({handleLogout}) => {
  return (
    <Navbar bg="light" expand="lg" className="mx-5">
      <Navbar.Brand as={Link} to="/supervisorPage">
        <img
          src={logo} // Replace with your logo image path
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="Logo"
        />{" "}
        Product Management
      </Navbar.Brand>

      {/* Collapse button for mobile */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      {/* Navbar items */}
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto">
          <Nav.Link as={Link} to="/supervisorPage" className="mx-3">
            Home
          </Nav.Link>
        </Nav>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default SupervisorNavbar;
