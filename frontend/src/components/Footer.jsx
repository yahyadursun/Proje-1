import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">Dummy mummy</p>
        </div>

        <div>
          <p className="poppins-regular text-x1 font-bold mb-5">COMPANY</p>
          <ul className="poppins-regular flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="poppins-regular text-x1 font-bold mb-5">GET IN TOUCH</p>
          <ul className="poppins-regular flex flex-col gap-1 text-gray-600">
            <li>222-22-222</li>
            <li>contact@sneakster.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="prompt-bold py-5 text-sm text-center">Copyright 2024@sneakster.com- All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
