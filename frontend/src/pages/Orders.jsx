import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setorderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];

        // Siparişler verisini işleme
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            // Her bir item için döngü
            const formattedItem = { ...item }; // item'i kopyala
            formattedItem["status"] = order.status;
            formattedItem["payment"] = order.payment;
            formattedItem["paymentMethod"] = order.paymentMethod;
            formattedItem["date"] = order.date;
            allOrdersItem.push(formattedItem); // Her bir item'ı diziye ekle
          });
        });

        setorderData(allOrdersItem.reverse()); // Ters çevir ve state'e ata
      } else {
        toast.error(response.data.message || "Siparişler alınamadı.");
      }
    } catch (error) {
      console.error("Siparişler yüklenirken hata oluştu:", error);
      toast.error("Siparişler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // Status'e göre renk döndüren fonksiyon
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "order placed":
      case "packing":
        return "bg-yellow-500"; // Sarı
      case "shipped":
      case "out for delivery":
        return "bg-green-500"; // Yeşil
      case "delivered":
        return "bg-red-500"; // Kırmızı
      default:
        return "bg-gray-400"; // Varsayılan renk
    }
  };

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"Siparişlerim"} />
      </div>

      <div>
        {orderData.length > 0 ? (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20"
                  src={item.image?.[0] || "fallback-image-url.jpg"}
                  alt={item.name}
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-500">
                    <p>
                      {item.price}
                      {currency}
                    </p>
                    <p>Adet: {item.quantity}</p>
                    <p>Beden: {item.size}</p>
                  </div>
                  <p className="mt-1">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1">
                    Payment:{" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p
                    className={`min-w-2 h-2 rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  ></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Kargo Takip
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Sipariş bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
