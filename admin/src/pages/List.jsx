import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import UpdateProduct from "./UpdateProduct";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id: productToDelete._id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setProductToDelete(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleUpdateSuccess = () => {
    fetchList();
    setEditingProduct(null);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All products</p>
      <div className="flex flex-col gap-2">
        {/* List table title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b >Action</b>
        </div>
        {/* List items */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border bg-gray-100 text-sm"
            data-testid="item"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {item.price}
              {currency}
            </p>
            <div className="flex gap-2">
              <p
                onClick={() => setEditingProduct(item)}
                className="text-right md:text-center cursor-pointer text-blue-500"
              >
                Edit
              </p>
              <p
                onClick={() => setProductToDelete(item)}
                className="text-right md:text-center cursor-pointer text-red-500"
              >
                Delete
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Update Modal */}
      {editingProduct && (
        <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <UpdateProduct
              token={token}
              product={editingProduct}
              onSuccess={handleUpdateSuccess}
            />
            <button
              onClick={() => setEditingProduct(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete the product "{productToDelete.name}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setProductToDelete(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={removeProduct}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;