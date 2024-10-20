import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const { products } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");

  const fetchProductData = async () => {
    // Ürünü bul, yoksa null döner
    const product = products.find((item) => item._id === productId);
    
    if (product) {
      setProductData(product);
      // Eğer image varsa ilkini al, yoksa varsayılan bir resim ata
      setImage(product.image && product.image.length > 0 ? product.image[0] : "default-image-url");
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
            {
              productData.image && productData.image.length > 0 ? (
                productData.image.map((item, index) => (
                  <img
                    onClick={() => setImage(item)}
                    src={item}
                    key={index}
                    className="w-[25%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                    alt={productData.name || "Product Image"}
                  />
                ))
              ) : (
                <p>No images available</p> // Resim yoksa bir mesaj gösterebilirsin
              )
            }
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt={productData.name || "Product"} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Product not found</div> // Eğer ürün bulunamazsa bir mesaj gösterebilirsin
  );
};

export default Product;
