import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const UpdateProduct = ({ token, product }) => {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [sizes, setSizes] = useState([]);

  // Effect to parse sizes from the backend format
  useEffect(() => {
    if (product?.sizes) {
      // Gelen boyutları direkt olarak state'e aktar
      setSizes(product.sizes);
    }
  }, [product]);
  

  const handleSizeChange = (e) => {
    const selectedSize = parseFloat(e.target.value);
    setSizes((prevSizes) =>
      prevSizes.includes(selectedSize)
        ? prevSizes.filter((size) => size !== selectedSize)
        : [...prevSizes, selectedSize]
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", product._id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
  
      // Float formatında boyutları backend'e gönder
      formData.append("sizes", JSON.stringify(sizes));
  
      const response = await axios.post(`${backendUrl}/api/product/update`, formData, {
        headers: { token },
      });
  
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the product.");
    }
  };
  

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p>Product Name</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          required
        />
      </div>
      <div>
        <p>Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product Description"
          required
        />
      </div>
      <div>
        <p>Price</p>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
        />
      </div>
      <div>
        <p>Stock</p>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock Quantity"
          required
        />
      </div>
      <div>
        <p>Sizes</p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 73 }, (_, i) => (19 + i * 0.5).toFixed(1)).map((size) => (
            <label key={size} className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                value={size}
                checked={sizes.includes(parseFloat(size))}
                onChange={handleSizeChange}
              />
              {size}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Update Product
      </button>
    </form>
  );
};

export default UpdateProduct;