import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // Default role is 'admin'
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  // handle login
  const handleLogin = async (event) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    console.log(apiKey);
    event.preventDefault();
    try {
      let loginData = { email, password };

      if (role === "admin") {
        // If role is 'admin', send login request to /api/admin/login endpoint
        const response = await axios.post(
          "http://localhost:5000/api/admin/login",
          loginData,
          {
            headers: {
              Authorization: apiKey, // Add your API key here
            },
          }
        );
        console.log(response.data);

        // Navigate to admin page after successful login
        navigate("/adminPage");
      } else if (role === "supervisor") {
        // If role is 'supervisor', send login request to /api/supervisor/login endpoint
        console.log("supervosor login api request entered");
        const response = await axios.post(
          "http://localhost:5000/api/supervisor/login",
          loginData,
          {
            headers: {
              Authorization: apiKey, // Add your API key here
            },
          }
        );
        console.log(response.data);
        // Navigate to supervisor page after successful login
        navigate("/supervisorPage");
      }
      // Reset form fields after successful login
      setEmail("");
      setPassword("");
      setError("");
      // Set success message
      setSuccessMsg("Login successful!");
      localStorage.setItem("email", email);
    } catch (error) {
      console.error(
        "Error logging in:",
        error.response ? error.response.data : error.message
      );
      setError("Invalid email or password. Please try again."); // Set error message
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}{" "}
              {/* Display error message if there's an error */}
              {successMsg && <Alert variant="success">{successMsg}</Alert>}{" "}
              {/* Display success message if login is successful */}
              <Form onSubmit={handleLogin}>
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

                <Form.Group controlId="role">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="supervisor">Supervisor</option>
                  </Form.Control>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    className="px-2 py-2 mt-3 "
                  >
                    Login
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
