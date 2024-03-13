

import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const ProductForm = ({
  show,
  handleClose,
  fetchProductCount,
  fetchProductData,
}) => {
  const [adminEmail, setAdminEmail] = useState("");
  const [supervisorEmails, setSupervisorEmails] = useState([]);
  const [selectedSupervisorEmail, setSelectedSupervisorEmail] = useState("");

  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({}); // State for errors

  const apiKey = process.env.REACT_APP_API_KEY;
  console.log(apiKey);

  useEffect(() => {
    // Fetch supervisor emails when component mounts
    fetchSupervisorEmails();
  }, []);

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
    }
  };

  const fetchSupervisorCategory = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/supervisor/category?email=${email}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch supervisor category");
      }
      const data = await response.json();

      setProductCategory(data.category);
    } catch (error) {
      console.error("Error fetching supervisor category:", error);
    }
  };

  const handleSupervisorChange = (email) => {
    setSelectedSupervisorEmail(email);
    setProductCategory("");
    fetchSupervisorCategory(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !adminEmail &&
      !selectedSupervisorEmail &&
      !productId &&
      !productName &&
      !productImage &&
      !productDescription &&
      !price &&
      !color &&
      !size &&
      !quantity
    ) {
      setErrors({ details: "Please fill in at least one detail." });
      return;
    }
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append("adminEmail", adminEmail);
        formData.append("supervisorEmail", selectedSupervisorEmail);
        formData.append("productId", productId);
        formData.append("productName", productName);
        formData.append("productImage", e.target.productImage.files[0]);
        formData.append("productCategory", productCategory);
        formData.append("productDescription", productDescription);
        formData.append("price", price);
        formData.append("color", color);
        formData.append("size", size);
        formData.append("quantity", quantity);

        const response = await fetch(
          "http://localhost:5000/api/product/create",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: apiKey,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create product");
        }

        const data = await response.json();
        setSuccessMessage(data.message);
        resetForm();
        await fetchProductData(adminEmail);
        await fetchProductCount(adminEmail);
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
  };

  // Validate form fields
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!adminEmail) {
      errors.adminEmail = "Admin Email is required";
      isValid = false;
    }

    if (!selectedSupervisorEmail) {
      errors.selectedSupervisorEmail = "Supervisor Email is required";
      isValid = false;
    }

    if (!productId) {
      errors.productId = "Product ID is required";
      isValid = false;
    }

    if (!productName) {
      errors.productName = "Product Name is required";
      isValid = false;
    }

    if (!quantity) {
      errors.quantity = "Quantity is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const resetForm = () => {
    setAdminEmail("");
    setSelectedSupervisorEmail("");
    setProductId("");
    setProductName("");
    setProductImage("");
    setProductCategory("");
    setProductDescription("");
    setPrice("");
    setColor("");
    setSize("");
    setQuantity("");
    setErrors({});
  };

  return (
    <div className="mt-5">
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form
        onSubmit={handleSubmit}
        style={{ display: show ? "block" : "none" }}
      >
        <h3>Product Form</h3>
        {errors.details && <Alert variant="danger">{errors.details}</Alert>}
        <Form.Group controlId="adminEmail">
          <Form.Label>Admin Email</Form.Label>
          <Form.Control
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
          {errors.adminEmail && (
            <Form.Text className="text-danger">{errors.adminEmail}</Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="supervisorEmail">
          <Form.Label>Supervisor Email</Form.Label>
          <Form.Control
            as="select"
            value={selectedSupervisorEmail}
            onChange={(e) => handleSupervisorChange(e.target.value)}
          >
            <option value="">Select Supervisor Email</option>
            {supervisorEmails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </Form.Control>
          {errors.selectedSupervisorEmail && (
            <Form.Text className="text-danger">
              {errors.selectedSupervisorEmail}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="productId">
          <Form.Label>Product ID</Form.Label>
          <Form.Control
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          {errors.productId && (
            <Form.Text className="text-danger">{errors.productId}</Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="productName">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          {errors.productName && (
            <Form.Text className="text-danger">{errors.productName}</Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="productImage">
          <Form.Label>Product Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setProductImage(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group controlId="productCategory">
          <Form.Label>Product Category</Form.Label>
          <Form.Control
            type="text"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            readOnly
          />
        </Form.Group>

        <Form.Group controlId="productDescription">
          <Form.Label>Product Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="color">
          <Form.Label>Color</Form.Label>
          <Form.Control
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="size">
          <Form.Label>Size</Form.Label>
          <Form.Control
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {errors.quantity && (
            <Form.Text className="text-danger">{errors.quantity}</Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="price">
          <Form.Label>Price(RS)</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className=" mt-4">
          Submit
        </Button>
        <Button variant="secondary" onClick={handleClose} className="ms-3 mt-4">
          Close
        </Button>
      </Form>
    </div>
  );
};

export default ProductForm;
