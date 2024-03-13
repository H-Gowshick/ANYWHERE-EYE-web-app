import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import React, { useState } from "react";
const ProductUpdateFormAdmin = ({
  product,
  onClose,
  fetchProductData,
  adminEmail,
}) => {
  const [productName, setProductName] = useState(product.productName);

  const [productDescription, setProductDescription] = useState(
    product.productDescription
  );
  const [price, setPrice] = useState(product.price);
  const [color, setColor] = useState(product.color || "");
  const [size, setSize] = useState(product.size || "");
  const [quantity, setQuantity] = useState(product.quantity || ""); // New state for quantity
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const apiKey = process.env.REACT_APP_API_KEY;
  console.log(apiKey);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/product/${product._id}`,
        {
          productName,

          productDescription,
          price,
          color,
          size,
          quantity, // Include quantity in the request body
        },
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      setSuccessMessage("Product updated successfully");
      await fetchProductData(adminEmail);
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating product:", error);
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
            required
          />
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            
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

export default ProductUpdateFormAdmin;
