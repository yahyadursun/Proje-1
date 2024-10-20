import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    // Ürünü bul, yoksa null döner
    const product = products.find((item) => item._id === productId);

    if (product) {
      setProductData(product);
      // Eğer image varsa ilkini al, yoksa varsayılan bir resim ata
      setImage(
        product.image && product.image.length > 0
          ? product.image[0]
          : "default-image-url"
      );
    }
  };

  useEffect(() => {
    if (products && products.length > 0) {
      fetchProductData();
    }
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* product images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image && productData.image.length > 0 ? (
              productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  alt={productData.name || "Product Image"}
                />
              ))
            ) : (
              <p>No images available</p> // Resim yoksa bir mesaj gösterebilirsin
            )}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto"
              src={image}
              alt={productData.name || "Product"}
            />
          </div>
        </div>
        {/*product info */}
        <div className="flex-1">
          <h1 className="font-medium montserrat text-3x1 mt-2">
            {productData.name}
          </h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3x1 prompt-bold font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-cyan-600" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button className="montserrat bg-black text-white px-8 py-3 text-sm active:bg-gray-700">
            SEPETE EKLE
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="montserrat text-sm text-gray-400 flex flex-col gap-1">
            <p>Hayallerini Giyin</p>
            <p>7 gün içinde kolay iade seçenekleriyle</p>
            <p>Dükkan sizin</p>
          </div>
        </div>
      </div>
      {/* description and review section */}
      <div className="mt-20">
        <div className="flex ">
          <b className="border px-5 py-3 text-sm">Açıklama</b>
          <p className="border px5 py3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm">
          <p>
          açıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklama
          </p>
          <p>açıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklamaaçıklama</p>
        </div>
      </div>
    </div>
  ) : (
    <div>Product not found</div> // Eğer ürün bulunamazsa bir mesaj gösterebilirsin
  );
};

export default Product;
