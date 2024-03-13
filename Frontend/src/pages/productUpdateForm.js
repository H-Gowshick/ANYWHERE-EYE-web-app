import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const ProductUpdateForm = ({
  product,
  onClose,
  fetchProducts,
  category,
  email,
}) => {
  const [productName, setProductName] = useState(product.productName);
  const [productCategory, setProductCategory] = useState(
    product.productCategory
  );
  const [productDescription, setProductDescription] = useState(
    product.productDescription
  );
  const [price, setPrice] = useState(product.price);
  const [color, setColor] = useState(product.color || ""); // Add color state
  const [size, setSize] = useState(product.size || ""); // Add size state
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const apiKey = process.env.REACT_APP_API_KEY;
  console.log(apiKey);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send PUT request to update the product
      await axios.put(
        `http://localhost:5000/api/product/${product._id}`,
        {
          productName,
          productCategory,
          productDescription,
          price,
          color, // Include color in the request body
          size, // Include size in the request body
        },
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      // Update success message and reset form fields
      setSuccessMessage("Product updated successfully");
      await fetchProducts(email, category);

      setErrorMessage("");
    } catch (error) {
      console.error("Error updating product:", error);
      // Update error message
      setErrorMessage("Failed to update product. Please try again later.");
      setSuccessMessage("");
    }
  };

  return (
    <div>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <h3>Update Product</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="productName">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="productCategory">
          <Form.Label>Product Category</Form.Label>
          <Form.Control
            type="text"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="productDescription">
          <Form.Label>Product Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="color">
          {" "}
          {/* Add color input field */}
          <Form.Label>Color</Form.Label>
          <Form.Control
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="size">
          {" "}
          {/* Add size input field */}
          <Form.Label>Size</Form.Label>
          <Form.Control
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Price(Rs)</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-4">
          Update Product
        </Button>{" "}
        <Button variant="secondary" onClick={onClose} className="mt-4">
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default ProductUpdateForm;
