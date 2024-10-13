import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";

const Collection = () => {
  const { products } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-1 pt-10 border-t">
      {/* Filter options */}
      <div className="min-w-60">
        <p onClick={()=>setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">
          FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-0' :"rotate-180"}`} src={assets.dropdown_icon} alt="" />
        </p>
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden "
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORY</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700 ">
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={"Men"} />Men
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={"Women"} />Women
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={"Kids"} />Kids
            </p>
          </div>
        </div>
        {/*subcat filter*/}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden "
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700 ">
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={"Sneaker"} />Sneaker
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={"Basketball"} />Basketball
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={"Outdoor"} />Outdoor
            </p>
          </div>
        </div>
      </div>

{/*rightside */}
<div className="flex-1">
<div className="flex justify-between text-base sm:text-2x1 mb-4">
  <Title text1={'All'} text2={' Collections'}></Title>
</div>

</div>

    </div>
  );
};

export default Collection;
