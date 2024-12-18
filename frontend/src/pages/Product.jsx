import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/relatedProduct";
import { ToastContainer, toast } from "react-toastify"; // Toastify importu
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState(""); // Size state
  const [activeTab, setActiveTab] = useState("details");

  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
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

  const handleAddToCart = () => {
    if (!size) {
      toast.warn("Lütfen bir beden seçin!", { position: "top-right" });
      return;
    }
    addToCart(productData._id, size);
    toast.success(`Beden: ${size} sepete eklendi!`, { position: "top-right" });
  };

  // Eğer productData yoksa, hiç bir şey render etmeyelim
  if (!productData) return null;

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <ToastContainer autoClose={3000} /> {/* Toastify Container */}
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
              <p>No images available</p>
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

        {/* product info */}
        <div className="flex-1">
          <h1 className="font-medium funnel-sans prompt-bold text-3x1 mt-2">
            {productData.name}
          </h1>
          <div className="flex items-center ">
            <p className="mt-5 funnel-sans font-small text-gray-400">
              {productData.description}
            </p>
          </div>

          <p className="mt-5 text-3x1 funnel-sans font-medium">
            {productData.price}
            {currency}
          </p>

          {/* Select Size Dropdown */}
          <div className="flex flex-col gap-4 my-8">
            <p className="prompt-bold funnel-sans">Select Size</p>
            <select
              onChange={(e) => setSize(e.target.value)} // Select size on change
              className="custom-select" // Custom select class
              value={size} // Pre-select the size if already chosen
            >
              <option value="" hidden disabled>
                Size Seçin
              </option>
              {productData.sizes
                .filter((item) => productData.stock[item] > 0) // Stok kontrolü
                .map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          <button
            onClick={handleAddToCart} // Sepete ekle butonunda bildirim çağırma
            className="montserrat bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            SEPETE EKLE
          </button>
          <hr className="mt-8 sm:w-4/5" />

          {/* Ürün Detayları ve Teslimat Başlıkları */}
          <div className="mt-4 sm:mt-6 flex justify-between items-center sm:w-full pt-4">
            <div className="w-full sm:w-[50%]">
              <div className="flex gap-8 mb-4">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`font-semibold text-xs ${
                    activeTab === "details"
                      ? "text-gray-700 border-b-2 border-gray-700" // Seçili sekme
                      : "text-gray-400 border-b border-gray-300" // Seçili olmayan sekme
                  }`}
                >
                  Ürün Detayları
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`font-semibold text-xs ${
                    activeTab === "shipping"
                      ? "text-gray-700 border-b-2 border-gray-700" // Seçili sekme
                      : "text-gray-400 border-b border-gray-300" // Seçili olmayan sekme
                  }`}
                >
                  Teslimat ve Kargo
                </button>
              </div>

              {/* Seçilen Tab'ın İçeriği */}
              {activeTab === "details" && (
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <p>
                    <strong>Marka:</strong> {productData.brand}
                  </p>
                  <p>
                    <strong>Cinsiyet:</strong> {productData.category}
                  </p>
                  <p>
                    <strong>Renk:</strong> {productData.color}
                  </p>
                  <p>
                    <strong>Ürün Adı:</strong> {productData.name}
                  </p>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <p>
                    Sneakster.com’da siparişler 1-2 gün içinde, hafta sonu ve
                    resmi tatillerde verdiğin siparişler ise takip eden ilk iş
                    gününde hazırlanmaya başlar. Siparişler ortalama 1-3 iş günü
                    içerisinde kargoya teslim edilir.
                  </p>
                  <p>
                    Siparişleri Türkiye’nin her bölgesinde adresine teslim
                    ediyoruz ancak yurt dışı ve Kıbrıs’a şuan için ne yazık ki
                    teslimat yapamıyoruz.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* display related products */}
      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
