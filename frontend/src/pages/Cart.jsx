import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity,navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    if (products.length > 0) {
          const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
    }
  }, [cartItems,products]);
  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"Your"} text2={"Cart"}></Title>
      </div>
      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          return (
            <div className="flex items-center gap-6 p-4 bg-white shadow-md rounded-lg border">
              <img
                className="w-16 sm:w-20 rounded-lg object-cover"
                src={productData.image[0]}
                alt={productData.name}
              />

              <div className="flex flex-col gap-2 flex-grow">
                <p className="text-sm sm:text-lg font-semibold text-gray-800">
                  {productData.name}
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-base sm:text-lg font-medium text-gray-600">
                    {productData.price}
                    {currency}
                  </p>

                  <p className="px-3 py-1 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-full border border-gray-300">
                    Size: {item.size}
                  </p>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
              ></img>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button onClick={() => navigate('/place-order')} className="bg-black text-white text-sm my-8 px-8 py-3">SEPETİ ONAYLA</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
