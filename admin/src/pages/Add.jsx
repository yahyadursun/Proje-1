import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setimage1] = useState(false);
  const [image2, setimage2] = useState(false);
  const [image3, setimage3] = useState(false);
  const [image4, setimage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setsubCategory] = useState("Other");
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);


  const availableSizes = Array.from({ length: 73 }, (_, i) =>
    (19 + i * 0.5).toFixed(1)
  );
  const handleSizeChange = (e) => {
    const selectedSize = parseFloat(e.target.value);
    if (sizes.includes(selectedSize)) {
      // If the size is already selected, remove it
      setSizes(sizes.filter((size) => size !== selectedSize));
    } else {
      // If the size is not selected, add it
      setSizes([...sizes, selectedSize]);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      // for error about trying to read not existing image
      image1 && formData.append("image1", image1);
      image1 && formData.append("image2", image2);
      image1 && formData.append("image3", image3);
      image1 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setsubCategory("Other");
        setSizes([]);
        setBestseller(false);
        setimage1(false);
        setimage2(false);
        setimage3(false);
        setimage4(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Image</p>

        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setimage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            ></input>
          </label>
          <label htmlFor="image2">
            <img
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setimage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            ></input>
          </label>
          <label htmlFor="image3">
            <img
              className="w-20"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setimage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            ></input>
          </label>
          <label htmlFor="image4">
            <img
              className="w-20"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setimage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            ></input>
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Unisex">Unisex</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setsubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Athletic Shoes">Athletic Shoes</option>
            <option value="Casual Shoes">Casual Shoes</option>
            <option value="Formal Shoes">Formal Shoes</option>
            <option value="Boots">Boots</option>
            <option value="Heels">Heels</option>
            <option value="Sandals and Slippers">Sandals and Slippers</option>
            <option value="House Shoes">House Shoes</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>
      <div>
        <p>Product Sizes</p>
        <div className="flex gap-1 w-full sm:gap-2  flex-wrap">
          {availableSizes.map((size, index) => (
            <label key={index} className="block ">
              <input
                type="checkbox"
                value={size}
                onChange={handleSizeChange}
                className="mr-2"
                checked={sizes.includes(parseFloat(size))}
                
              />
              {size}
            </label>
          ))}
        </div>
        <div>
          <p>Selected Sizes:</p>
          <ul className=" flex gap-1 flex-wrap w-full sm:gap-5 bg-blue-100 p-2 border rounded-xl border-gray-300 ">
            {sizes.map((size, index) => (
              <li key={index}>{size}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-2 mt-2 ">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="curs-pointer -" htmlFor="bestseller">
          Add to Bestseller
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
