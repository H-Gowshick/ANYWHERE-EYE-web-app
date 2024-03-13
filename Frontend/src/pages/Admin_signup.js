import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link for routing
import axios from "axios";

const SignUpPage = () => {
  const [adminId, setAdminId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const apiKey = process.env.REACT_APP_API_KEY;
  console.log(apiKey);
  
  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        {
          adminId,
          email,
          password,
        },
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      console.log(response.data);
      // Reset form fields after successful sign-up
      setAdminId("");
      setEmail("");
      setPassword("");
      // Set success message
      setSuccessMsg("Registration successful! You can now log in.");

      // Clear error message if any
      setError("");
    } catch (error) {
      console.error(
        "Error signing up:",
        error.response ? error.response.data : error.message
      );
      setError("Error signing up. Please try again."); // Set error message
      // Clear success message if any
      setSuccessMsg("");
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Admin Sign Up</h2>
              {successMsg && <Alert variant="success">{successMsg}</Alert>}{" "}
              {/* Display success message if registration is successful */}
              <Form onSubmit={handleSignUp}>
                <Form.Group controlId="adminId">
                  <Form.Label>Admin ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}{" "}
                {/* Display error message if there's an error */}
                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    className="px-2 py-2 mt-3"
                  >
                    Sign Up
                  </Button>
                </div>
              </Form>
              <div className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
