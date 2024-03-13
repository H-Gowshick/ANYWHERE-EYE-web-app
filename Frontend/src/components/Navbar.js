import React from "react";
import { Navbar, Container, Nav,Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../logo.svg";
const NavigationBar = ({ handleLogout }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {/* Logo and App Title */}
        <Navbar.Brand as={Link} to="/adminPage">
          <img
            src={logo} // Path to your logo image
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
          <Nav className="m-auto gap-5">
            <Nav.Link as={Link} to="/adminPage">
              Home
            </Nav.Link>
            {/* Supervisor Section */}

            <Nav.Link as={Link} to="/supervisors">
              Supervisors
            </Nav.Link>

            {/* Product Section */}
            <Nav.Link as={Link} to="/products">
              Products
            </Nav.Link>
          </Nav>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
