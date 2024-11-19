import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const [method, setMethod] = useState(" ");
  const   {navigate} = useContext(ShopContext);

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/*left side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2x1 my-3">
          <Title text1={"TESLİMAT"} text2={"BİLGİSİ"} />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="first name"
          />
          <input
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="last name"
          />
        </div>
        <input
          type="email"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="email adress"
        />
        <input
          type="text"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="street"
        />
        <div className="flex gap-3">
          <input
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="city"
          />
          <input
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="state"
          />
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="zipcode"
          />
          <input
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="country"
          />
        </div>
        <input
          type="phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="phone"
        />
      </div>
      {/* right side */}
      <div className="mt-8">
        <div className=" mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12 ">
          <Title text1={"Ödeme"} text2={"Seçenekleri"} />
          {/*ödeme seçenkleri */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.stripe_icon}
                alt="Stripe"
              ></img>
            </div>
            <div
              onClick={() => setMethod("kredikartı")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "kredikartı" ? "bg-green-400" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.kredikart_icon}
                alt="Kredi Kartı"
              ></img>
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                Kapıda Ödeme
              </p>
            </div>
          </div>
          <div onClick={()=>navigate('/orders')} className="w-full text-end mt-8">
                <button className="bg-black text-white px-16 py-3 text-sm">Ödeme</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
