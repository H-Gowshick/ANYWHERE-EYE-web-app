import { React, useEffect, useState } from "react";
import { Button, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../components/Navbar.js";
import { BarChart } from "@mui/x-charts/BarChart";
const AdminPage = () => {
  const [supervisorCount, setSupervisorCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [adminEmail, setAdminEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [supervisorEmails, setSupervisorEmails] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [stockCounts, setStockCounts] = useState({});
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const apiKey = process.env.REACT_APP_API_KEY;
  console.log(apiKey);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/loginauth").then((res) => {
      console.log(res.data);
      if (
        res.data !== "Success" ||
        res.data === "Missing token" ||
        res.data === "Invalid token"
      ) {
        navigate("/login");
      }
    });

    if (!localStorage.getItem("email")) {
      navigate("/login");
    }

    const admin_email = localStorage.getItem("email");
    setAdminEmail(admin_email);
    fetchSupervisorCount(admin_email);
    fetchProductCount(admin_email);
    fetchSupervisorEmails();
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



  const fetchProductCount = async (adminEmail) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/adminPage/count?adminEmail=${adminEmail}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch product count");
      }
      const data = await response.json();
      const productCount = data.count;

      // Fetch quantity for out of stock count
      const responseQuantity = await fetch(
        `http://localhost:5000/api/product/quantity?adminEmail=${adminEmail}&quantity=0`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      if (!responseQuantity.ok) {
        throw new Error("Failed to fetch out of stock count");
      }
      const dataQuantity = await responseQuantity.json();
      const outOfStockCount = dataQuantity.count;

      setProductCount({
        total: productCount,
        outOfStock: outOfStockCount,
        inStock: productCount - outOfStockCount,
      });
    } catch (error) {
      console.error("Error fetching product count:", error);
      setErrorMessage("Failed to fetch product count. Please try again later.");
    }
  };
  // supervisor emails
  const fetchSupervisorEmails = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/supervisor/emails",
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch supervisor emails");
      }
      const data = await response.json();
      setSupervisorEmails(data.emails);
    } catch (error) {
      console.error("Error fetching supervisor emails:", error);
      setErrorMessage(
        "Failed to fetch supervisor emails. Please try again later."
      );
    }
  };

  const handleSupervisorChange = async (e) => {
    const selectedEmail = e.target.value;
    setSelectedSupervisor(selectedEmail);
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/supervisorEmail/quantity?supervisorEmail=${selectedEmail}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch product quantity");
      }
      const data = await response.json();
      const outOfStockCount = data.quantity.filter((item) => item === 0).length;
      const inStockCount = data.quantity.length - outOfStockCount;
      setStockCounts({
        outOfStock: outOfStockCount,
        inStock: inStockCount,
      });
    } catch (error) {
      console.error("Error fetching product quantity:", error);
      setErrorMessage(
        "Failed to fetch product quantity. Please try again later."
      );
    }
  };

  // Fetch stock counts for all supervisors
  useEffect(() => {
    const fetchStockCounts = async () => {
      const counts = {};
      for (const email of supervisorEmails) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/product/supervisorEmail/quantity?supervisorEmail=${email}`,
            {
              headers: {
                Authorization: apiKey,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch stock count for ${email}`);
          }
          const data = await response.json();
          const outOfStockCount = data.quantity.filter(
            (item) => item === 0
          ).length;
          const inStockCount = data.quantity.length - outOfStockCount;
          counts[email] = {
            inStock: inStockCount,
            outOfStock: outOfStockCount,
          };
        } catch (error) {
          console.error(`Error fetching stock count for ${email}:`, error);
          counts[email] = {
            inStock: 0,
            outOfStock: 0,
          };
        }
      }
      setStockCounts(counts);
    };
    if (supervisorEmails.length > 0) {
      fetchStockCounts();
    }
  }, [supervisorEmails]);

  // logout
  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="container-fluid">
      <NavigationBar handleLogout={handleLogout} />
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-uppercase">Admin Dashboard</h2>
        </div>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Alert variant="primary">
          {adminEmail && productCount && (
            <div>
              <p>
                <strong>Admin Email:</strong> {adminEmail}
              </p>
              <p>
                <strong>Total Products:</strong> {productCount.total}
              </p>
              <p>
                <strong>Out of Stock Items:</strong> {productCount.outOfStock}
              </p>
              <p>
                <strong>In Stock Items: </strong>
                {productCount.inStock}
              </p>
            </div>
          )}
        </Alert>

        <Form.Group controlId="supervisorSelect">
          <Form.Label className="fw-bold">
            Supervisors products instock outstock count:
          </Form.Label>
          <Form.Control
            as="select"
            value={selectedSupervisor}
            onChange={handleSupervisorChange}
          >
            <option value="">Select Supervisor</option>
            {supervisorEmails.map((email, index) => (
              <option key={index} value={email}>
                {email}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {selectedSupervisor && (
          <div className="mt-3">
            <p>
              <strong>Out of Stock Items:</strong> {stockCounts.outOfStock}
            </p>
            <p>
              <strong>In Stock Items:</strong> {stockCounts.inStock}
            </p>
          </div>
        )}

        {/* Bar Chart */}
        {selectedSupervisor && (
          <div>
            <h4 className="mt-5 text-uppercase">
              Bar Chart of Supervisor Product's In Stock and Out of Stock
            </h4>
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: [selectedSupervisor],
                },
              ]}
              series={[
                { label: "In Stock", data: [stockCounts.inStock] },
                { label: "Out of Stock", data: [stockCounts.outOfStock] },
              ]}
              width={500}
              height={400}
            />
          </div>
        )}

        <h4 className="mt-5 text-uppercase">
          Bar chart of all supervisor's product's inStock and outOfStock{" "}
        </h4>
        {/* all supervisors bar chart */}
        {supervisorEmails.length > 0 && (
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: supervisorEmails,
              },
            ]}
            series={[
              {
                label: "In Stock",
                data: supervisorEmails.map(
                  (email) => stockCounts[email]?.inStock || 0
                ),
              },
              {
                label: "Out of Stock",
                data: supervisorEmails.map(
                  (email) => stockCounts[email]?.outOfStock || 0
                ),
              },
            ]}
            width={800}
            height={400}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
