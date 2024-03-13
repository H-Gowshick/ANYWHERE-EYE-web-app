

import React, { useState, useEffect } from "react";
import { Button, Alert, Modal, Dropdown, Table } from "react-bootstrap";
import ProductForm from "./ProductForm";
import ProductUpdateFormAdmin from "./ProductUpdateFormAdmin";
import NavigationBar from "../components/Navbar.js";
import { useNavigate } from "react-router-dom";

import * as XLSX from "xlsx";

const ProductManagement = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [productsData, setProductsData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showProductDeleteConfirmation, setShowProductDeleteConfirmation] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [productNameFilter, setProductNameFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const navigate = useNavigate();

  // api secret key
  const apiKey = process.env.REACT_APP_API_KEY;
  console.log(apiKey);

  useEffect(() => {
    const admin_email = localStorage.getItem("email");
    setAdminEmail(admin_email);
    fetchProductData(admin_email);
    fetchProductCount(admin_email);
    if (!localStorage.getItem("email")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    // Reset filters when category or product name filter changes
    setSizeFilter("");
    setColorFilter("");
  }, [categoryFilter, productNameFilter]);

  const fetchProductData = async (adminEmail) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/product?adminEmail=${adminEmail}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products data");
      }
      const data = await response.json();
      setProductsData(data);
    } catch (error) {
      console.error("Error fetching products data:", error);
      setErrorMessage("Failed to fetch products data. Please try again later.");
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
      setProductCount(data.count);
    } catch (error) {
      console.error("Error fetching product count:", error);
      setErrorMessage("Failed to fetch product count. Please try again later.");
    }
  };

  const confirmDeleteProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/product/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({
          productId: productToDelete,
          adminEmail: adminEmail,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      await fetchProductData(adminEmail);
      await fetchProductCount(adminEmail);
      setShowProductDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      setErrorMessage("Failed to delete product. Please try again later.");
    }
  };

  const handleCreateProductClose = () => {
    setShowProductForm(false);
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseForm = () => {
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setShowProductDeleteConfirmation(true);
  };
  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/login");
  };

  // Calculate in stock and out of stock counts
  const inStockCount = productsData.filter(
    (product) => product.quantity > 0
  ).length;
  const outOfStockCount = productsData.length - inStockCount;

  const exportToExcel = () => {
    const filteredExcelData = generateExcelData(filteredProducts);
    const worksheet = XLSX.utils.book_new();

    // Add filtered product details
    const productWorksheet = XLSX.utils.json_to_sheet(filteredExcelData);
    XLSX.utils.book_append_sheet(
      worksheet,
      productWorksheet,
      "Filtered Product Data"
    );

    // Add existing product details as table columns and rows
    const existingProductDetails = [
      ["Total Products", filteredProducts.length],
      ["In Stock Items", inStockCount],
      ["Out of Stock Items", outOfStockCount],
    ];
    const existingProductWorksheet = XLSX.utils.aoa_to_sheet(
      existingProductDetails
    );
    XLSX.utils.book_append_sheet(
      worksheet,
      existingProductWorksheet,
      "Existing Product Details"
    );

    // Export the workbook to an Excel file
    XLSX.writeFile(worksheet, "filtered_product_data.xlsx");
  };

  const generateExcelData = (data) => {
    return data.map((product) => ({
      supervisorEmail: product.supervisorEmail,
      productId: product.productId,
      productName: product.productName,
      productCategory: product.productCategory,
      productDescription: product.productDescription,
      color: product.color || "-",
      size: product.size || "-",
      quantity: product.quantity,
      price: product.price,
    }));
  };

  // Filtered products based on selected filters
  const filteredProducts = productsData.filter((product) => {
    return (
      (!categoryFilter || product.productCategory === categoryFilter) &&
      (!productNameFilter || product.productName === productNameFilter) &&
      (!sizeFilter || product.size === sizeFilter) &&
      (!colorFilter || product.color === colorFilter)
    );
  });

  // Get unique product names, sizes, and colors for dropdown options
  const getUniqueProductNames = () => {
    let filteredProducts = productsData;
    if (categoryFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.productCategory === categoryFilter
      );
    }
    return Array.from(
      new Set(filteredProducts.map((product) => product.productName))
    );
  };

  const getUniqueSizes = () => {
    let filteredProducts = productsData;
    if (categoryFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.productCategory === categoryFilter
      );
    }
    if (productNameFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.productName === productNameFilter
      );
    }
    return Array.from(new Set(filteredProducts.map((product) => product.size)));
  };

  const getUniqueColors = () => {
    let filteredProducts = productsData;
    if (categoryFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.productCategory === categoryFilter
      );
    }
    if (productNameFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.productName === productNameFilter
      );
    }
    if (sizeFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.size === sizeFilter
      );
    }
    return Array.from(
      new Set(filteredProducts.map((product) => product.color))
    );
  };

  return (
    <div className="container-fluid">
      <NavigationBar handleLogout={handleLogout} />
      <div className="container">
        {/* exist product details */}
        <Alert variant="primary" className="mt-5 mb-4 ">
          <p>
            <strong> Total Products :</strong> {productCount}
          </p>
          <p>
            <strong>In Stock Items:</strong> {inStockCount}
          </p>
          <p>
            <strong>Out of Stock Items:</strong> {outOfStockCount}
          </p>
        </Alert>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Button
          variant="primary"
          className=" mt-5"
          onClick={() => setShowProductForm(true)}
        >
          Create Product
        </Button>

        <ProductForm
          show={showProductForm}
          handleClose={handleCreateProductClose}
          fetchProductData={fetchProductData}
          fetchProductCount={fetchProductCount}
        />

        <h3 className="mt-5">Product List</h3>
        <div className="filters d-flex gap-2">
          {/* Main category filter */}
          <Dropdown>
            <Dropdown.Toggle variant="success" id="categoryDropdown">
              Category Filter
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setCategoryFilter("")}>
                All
              </Dropdown.Item>
              {Array.from(
                new Set(productsData.map((product) => product.productCategory))
              ).map((category) => (
                <Dropdown.Item
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Sub-category filters */}
          <Dropdown>
            <Dropdown.Toggle variant="success" id="productNameDropdown">
              Subcategory Filter
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setProductNameFilter("")}>
                All
              </Dropdown.Item>
              {getUniqueProductNames().map((name) => (
                <Dropdown.Item
                  key={name}
                  onClick={() => setProductNameFilter(name)}
                >
                  {name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="success" id="sizeDropdown">
              Size Filter
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSizeFilter("")}>
                All
              </Dropdown.Item>
              {getUniqueSizes().map((size) => (
                <Dropdown.Item key={size} onClick={() => setSizeFilter(size)}>
                  {size}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="success" id="colorDropdown">
              Color Filter
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setColorFilter("")}>
                All
              </Dropdown.Item>
              {getUniqueColors().map((color) => (
                <Dropdown.Item
                  key={color}
                  onClick={() => setColorFilter(color)}
                >
                  {color}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Supervisor Email</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Product Image</th>
                <th>Product Category</th>
                <th>Product Description</th>
                <th>Color</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Price(Rs)</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.supervisorEmail}</td>
                  <td>{product.productId}</td>
                  <td>{product.productName}</td>
                  <td>
                    {product.productImage && (
                      <img
                        src={`data:image/png;base64,${product.productImage}`}
                        alt="Product"
                        width="50"
                      />
                    )}
                  </td>
                  <td>{product.productCategory}</td>
                  <td>{product.productDescription}</td>
                  <td>{product.color || "-"}</td>
                  <td>{product.size || "-"}</td>
                  <td className="text-center">{product.quantity}</td>
                  <td className="text-center">{product.price}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateClick(product)}
                    >
                      Update
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteProduct(product.productId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Button
          variant="success"
          className="text-end mb-3"
          onClick={exportToExcel}
        >
          Export to Excel
        </Button>
        {selectedProduct && (
          <ProductUpdateFormAdmin
            adminEmail={adminEmail}
            product={selectedProduct}
            onClose={handleCloseForm}
            fetchProductData={fetchProductData}
          />
        )}

        <Modal
          show={showProductDeleteConfirmation}
          onHide={() => setShowProductDeleteConfirmation(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowProductDeleteConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteProduct}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ProductManagement;
