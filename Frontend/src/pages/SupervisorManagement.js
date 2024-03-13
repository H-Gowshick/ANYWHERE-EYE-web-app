import React, { useState, useEffect } from "react";
import { Button, Alert, ListGroup, Modal } from "react-bootstrap";
import SupervisorForm from "./SupervisorForm";
import NavigationBar from "../components/Navbar.js";
import { useNavigate } from "react-router-dom";
const SupervisorManagement = () => {
  const [showSupervisorForm, setShowSupervisorForm] = useState(false);
  const [supervisorAccounts, setSupervisorAccounts] = useState([]);
  const [supervisorCount, setSupervisorCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [supervisorToDelete, setSupervisorToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const navigate = useNavigate();
  const apiKey = process.env.REACT_APP_API_KEY;
  console.log(apiKey);
  useEffect(() => {
    const admin_email = localStorage.getItem("email");
    setAdminEmail(admin_email);
    fetchSupervisorCount(admin_email);
    fetchSupervisorAccounts(admin_email);
    if (!localStorage.getItem("email")) {
      navigate("/login");
    }
  }, []);

  const fetchSupervisorCount = async (adminEmail) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/supervisor/count?adminEmail=${adminEmail}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch supervisor count");
      }
      const data = await response.json();
      setSupervisorCount(data.count);
    } catch (error) {
      console.error("Error fetching supervisor count:", error);
      setErrorMessage(
        "Failed to fetch supervisor count. Please try again later."
      );
    }
  };

  const fetchSupervisorAccounts = async (adminEmail) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/supervisor/view?adminEmail=${adminEmail}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch supervisor accounts");
      }
      const data = await response.json();
      setSupervisorAccounts(data);
    } catch (error) {
      console.error("Error fetching supervisor accounts:", error);
      setErrorMessage(
        "Failed to fetch supervisor accounts. Please try again later."
      );
    }
  };

  const handleCreateSupervisorAccountClose = () => {
    setShowSupervisorForm(false);
  };

  const handleDeleteSupervisor = (supervisorEmail) => {
    setSupervisorToDelete(supervisorEmail);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteSupervisor = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/supervisor/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: apiKey,
          },
          body: JSON.stringify({
            adminEmail,
            supervisorEmail: supervisorToDelete,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete supervisor account");
      }
      fetchSupervisorAccounts(adminEmail);
      await fetchSupervisorCount(adminEmail);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting supervisor account:", error);
      setErrorMessage(
        "Failed to delete supervisor account. Please try again later."
      );
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/login");
  };
  return (
    <div className="container-fluid">
      <NavigationBar handleLogout={handleLogout} />
      <div className="container">
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Button
          variant="primary"
          className="me-3 mt-5"
          onClick={() => setShowSupervisorForm(true)}
        >
          Create Supervisor Account
        </Button>

        {showSupervisorForm && (
          <SupervisorForm
            adminEmail={adminEmail}
            handleClose={handleCreateSupervisorAccountClose}
            fetchSupervisorCount={fetchSupervisorCount}
            fetchSupervisorAccounts={fetchSupervisorAccounts}
          />
        )}

        <Alert variant="primary" className="mt-5 mb-4 ">
          Supervisor Accounts: {supervisorCount}
        </Alert>

        <ListGroup>
          <h3 className="mb-3 mt-4">Supervisor Accounts</h3>
          {supervisorAccounts.map((account, index) => (
            <ListGroup.Item key={index}>
              <p>Email: {account.supervisorEmail}</p>
              <p>Password: {account.supervisorPassword}</p>
              <p>Category: {account.category}</p>
              <Button
                variant="danger"
                onClick={() => handleDeleteSupervisor(account.supervisorEmail)}
              >
                Delete
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Modal
          show={showDeleteConfirmation}
          onHide={() => setShowDeleteConfirmation(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this supervisor account?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteSupervisor}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default SupervisorManagement;
