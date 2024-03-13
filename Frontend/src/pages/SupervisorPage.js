import React, { useState, useEffect } from "react";
import { Alert, Table, Button, Dropdown } from "react-bootstrap";
import axios from "axios";
import ProductUpdateForm from "./productUpdateForm";
import { useNavigate } from "react-router-dom";
import SupervisorNavbar from "../components/SupervisorNavbar.js";
import * as XLSX from "xlsx"; // Import xlsx library
import { saveAs } from "file-saver";

const SupervisorPage = () => {
  // State variables
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const supervisorEmail = localStorage.getItem("email");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const [supervisorCategory, setSupervisorCategory] = useState("");
  const [inStockCount, setInStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [productNameFilter, setProductNameFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const apiKey = process.env.REACT_APP_API_KEY;
  console.log(apiKey);

  useEffect(() => {
    // Fetch products and count when supervisor email changes
    if (supervisorEmail) {
      fetchProductCount(supervisorEmail);
      fetchProducts(supervisorEmail);
    } else {
      setErrorMessage("Supervisor email not found in local storage.");
    }
  }, [supervisorEmail]);

  useEffect(() => {
    // Calculate in-stock and out-of-stock counts when products change
    const inStock = products.filter((product) => product.quantity > 0).length;
    const outOfStock = products.filter(
      (product) => product.quantity <= 0
    ).length;
    setInStockCount(inStock);
    setOutOfStockCount(outOfStock);
  }, [products]);

  const fetchProductCount = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/product/supervisorPage/count?supervisorEmail=${email}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      setProductCount(response.data.count);
    } catch (error) {
      console.error("Error fetching product count:", error);
      setErrorMessage("Failed to fetch product count. Please try again later.");
    }
  };

  const fetchProducts = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/product/supervisorPage?supervisorEmail=${email}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      if (response.data.length > 0) {
        setProducts(response.data);
        // Assuming all products have the same supervisor category, so setting it from the first product
        setSupervisorCategory(response.data[0].productCategory);
      } else {
        setErrorMessage("No products found for this supervisor.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage("Failed to fetch products. Please try again later.");
    }
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseForm = () => {
    setSelectedProduct(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handleProductNameFilterChange = (productName) => {
    setProductNameFilter(productName);
    // Filter colors and sizes based on selected product name
    const selectedProduct = products.find(
      (product) => product.productName === productName
    );
    if (selectedProduct) {
      setColors([selectedProduct.color]);
      setSizes([selectedProduct.size]);
    }
  };

  const handleColorFilterChange = (color) => {
    setColorFilter(color);
    // Filter sizes based on selected color
    const sizesWithSelectedColor = products
      .filter((product) => product.color === color)
      .map((product) => product.size);
    setSizes([...new Set(sizesWithSelectedColor)]);
  };

  const handleSizeFilterChange = (size) => {
    setSizeFilter(size);
  };

  // Filter products based on selected filters
  useEffect(() => {
    let filteredProducts = products;

    // Filter by product name if selected
    if (productNameFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.productName === productNameFilter
      );
    }

    // Filter by color if selected
    if (colorFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.color === colorFilter
      );
    }

    // Filter by size if selected
    if (sizeFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.size === sizeFilter
      );
    }

    // Set filtered products
    setFilteredProducts(filteredProducts);
  }, [products, productNameFilter, colorFilter, sizeFilter]);

  useEffect(() => {
    // Initialize filter dropdown options
    const uniqueProductNames = Array.from(
      new Set(products.map((product) => product.productName))
    );
    const uniqueColors = Array.from(
      new Set(products.map((product) => product.color))
    );
    const uniqueSizes = Array.from(
      new Set(products.map((product) => product.size))
    );
    setProductNames(uniqueProductNames);
    setColors(uniqueColors);
    setSizes(uniqueSizes);
  }, [products]);

  const exportToExcel = () => {
    // Define the columns for the product details worksheet
    const productColumns = [
      "Product ID",
      "Product Name",
      "Product Category",
      "Product Description",
      "Color",
      "Size",
      "Quantity",
      "Price(Rs)",
    ];

    // Map the filtered products data to an array of rows
    const productRows = filteredProducts.map((product) => [
      product.productId,
      product.productName,
      product.productCategory,
      product.productDescription,
      product.color || "-",
      product.size || "-",
      product.quantity || 0,
      product.price,
    ]);

    // Define the data for the additional information worksheet
    const additionalData = [
      ["Total Products:", productCount],
      ["In Stock Items:", inStockCount],
      ["Out of Stock Items:", outOfStockCount],
    ];

    // Create a new workbook and add worksheets
    const wb = XLSX.utils.book_new();
    const productWs = XLSX.utils.aoa_to_sheet([productColumns, ...productRows]);
    const additionalWs = XLSX.utils.aoa_to_sheet(additionalData);

    // Add the worksheets to the workbook
    XLSX.utils.book_append_sheet(wb, productWs, "Product Details");
    XLSX.utils.book_append_sheet(wb, additionalWs, "Additional Info");

    // Convert the workbook to a binary Excel file and download it
    const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const fileName = "filtered_products.xlsx";
    saveAs(blob, fileName);
  };

  // Function to convert string to array buffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  return (
    <div className="container-fluid">
      <SupervisorNavbar handleLogout={handleLogout} />
      <div className="container mt-5">
        <div className="row justify-content-between mb-3">
          <div className="col-md-6">
            <h1 className="text-uppercase">Supervisor Dashboard</h1>
            <p>
              <strong className="text-primary">
                The category that assigned:
              </strong>{" "}
              {supervisorCategory}
            </p>
            {/* Display Supervisor Category */}
          </div>
          <div className="col-md-6 text-end"></div>
        </div>
        <p>
          <strong>Supervisor Email:</strong> {supervisorEmail}
        </p>
        {/* product detail */}
        <Alert varient="primary">
          <p>
            <strong>Total Products:</strong> {productCount}
          </p>
          <p>
            <strong>In Stock Items:</strong> {inStockCount}
          </p>
          <p>
            <strong>Out of Stock Items:</strong> {outOfStockCount}
          </p>
        </Alert>
        {errorMessage ? (
          <Alert variant="warning">{errorMessage}</Alert>
        ) : (
          <div>
            {/* Filters */}
            <h2 className="mt-5">Products List</h2>
            <div className="mb-3 d-flex gap-4 mt-3">
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="productNameFilter">
                  Subcategory Filter
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleProductNameFilterChange("")}
                  >
                    All
                  </Dropdown.Item>
                  {productNames.map((productName, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleProductNameFilterChange(productName)}
                    >
                      {productName}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="primary" id="colorFilter">
                  Color Filter
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleColorFilterChange("")}>
                    All
                  </Dropdown.Item>
                  {colors.map((color, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleColorFilterChange(color)}
                    >
                      {color}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="primary" id="sizeFilter">
                  Size Filter
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSizeFilterChange("")}>
                    All
                  </Dropdown.Item>
                  {sizes.map((size, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleSizeFilterChange(size)}
                    >
                      {size}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Product Table */}
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
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
                      <td className="text-center">{product.quantity || "0"}</td>
                      <td className="text-center">{product.price}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleUpdateClick(product)}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {/* Add export to Excel button */}
            <div className="text-end mb-3">
              <Button variant="success" onClick={exportToExcel}>
                Export to Excel
              </Button>
            </div>

            {selectedProduct && (
              <ProductUpdateForm
                product={selectedProduct}
                onClose={handleCloseForm}
                adminEmail={supervisorEmail}
                fetchProducts={fetchProducts}
                email={supervisorEmail}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorPage;
