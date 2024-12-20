import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Modal } from "antd";
import { MapPin } from "lucide-react";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Kullanıcı bilgilerini ve adreslerini getir
  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });

      if (response.data.success) {
        const { user } = response.data;

        // Kullanıcı bilgilerini form'a doldur
        setFormData((prevData) => ({
          ...prevData,
          firstName: user.name || "",
          lastName: user.surname || "",
          phone: user.phoneNo || "",
          email: user.email || "",
        }));

        // Adresleri kaydet
        if (user.addresses) {
          setUserAddresses(user.addresses);
        }
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri yüklenirken hata oluştu:", error);
      toast.error("Kullanıcı bilgileri yüklenirken bir hata oluştu");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Seçilen adrese göre sadece adres bilgilerini doldur
  const handleAddressSelect = (address) => {
    setSelectedAddressId(address.label);
    setFormData((prevData) => ({
      ...prevData,
      street: address.street || "",
      city: address.city || "",// il bilgisini state olarak da kullanıyoruz
      state: address.state || "", // ilçe bilgisini state olarak da kullanıyoruz
      zipcode: address.postalCode || "",
      country: address.country || "",
    }));
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };
  const handleCardChange = (event) => {
    const { name, value } = event.target;

    // Ensure card number is 16 digits, expiry is MM/YY format, CVC is 3 digits
    if (name === "cardNumber" && value.length <= 16) {
      setCardData((prev) => ({ ...prev, [name]: value }));
    } else if (name === "expiry") {
      const formattedValue = value.replace(/\D/g, ""); // Sadece rakamları al
      if (formattedValue.length <= 4) {
        // Format: MMYY -> MM/YY
        const newExpiry = formattedValue.replace(/(\d{2})(\d{2})/, "$1/$2");
        setCardData((prev) => ({ ...prev, [name]: newExpiry }));
      }
    } else if (name === "cvc" && value.length <= 3) {
      setCardData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (method === "stripe" || method === "kredikartı") {
      setIsModalOpen(true);
      return;
    }

    await placeOrder();
  };

  const placeOrder = async () => {
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + Number(delivery_fee || 0),
      };

      const response = await axios.post(
        backendUrl + "/api/order/place",
        orderData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setCartItems({});
        toast.success("Ödeme yapıldı! Siparişiniz başarıyla oluşturuldu.");
        navigate("/orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePayment = async () => {
    if (!cardData.cardNumber || !cardData.expiry || !cardData.cvc) {
      toast.error("Lütfen tüm kart bilgilerini doldurun.");
      return;
    }
    setIsModalOpen(false);
    await placeOrder();
  };

  return (
    <>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        {/* Left Side */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2x1 my-3">
            <Title text1={"TESLİMAT"} text2={"BİLGİSİ"} />
          </div>

          {/* Kayıtlı Adresler Seçimi */}
          {userAddresses.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Kayıtlı Adresleriniz</h3>
              <div className="grid gap-3">
                {userAddresses.map((address) => (
                  <div
                    key={address.label}
                    onClick={() => handleAddressSelect(address)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedAddressId === address.label
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={20} className="text-gray-500" />
                      <span className="font-medium">{address.label}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city},{address.state}, {address.postalCode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Inputs - Existing code remains the same */}
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              type="text"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              placeholder="Adınız"
            />
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              type="text"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              placeholder="Soyadınız"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            type="email"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="E-posta Adresiniz"
          />
          <input
            required
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="Sokak Adresi"
          />
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              type="text"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              placeholder="İl"
            />
            <input
              required
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              type="text"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              placeholder="İlçe"
            />
          </div>
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              type="text"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              placeholder="Posta Kodu"
            />
            <input
              required
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              type="text"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              placeholder="Ülke"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="Telefon Numarası"
          />
        </div>
        {/* Right Side */}
        <div className="mt-8">
          <CartTotal />
          <div className="mt-12">
            <Title text1={"Ödeme"} text2={"Seçenekleri"} />
            <div className="flex gap-3 flex-col lg:flex-row">
              <div
                onClick={() => setMethod("stripe")}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              >
                <img
                  className="h-5 mx-4"
                  src={assets.stripe_icon}
                  alt="Stripe"
                />
              </div>
              <div
                onClick={() => setMethod("kredikartı")}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                  method === "kredikartı" ? "bg-green-400" : ""
                }`}
              >
                <img
                  className="h-5 mx-4"
                  src={assets.kredikart_icon}
                  alt="Kredi Kartı"
                />
              </div>
              <div
                onClick={() => setMethod("cod")}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              >
                <p className="text-gray-500 text-sm font-medium mx-4">
                  Kapıda Ödeme
                </p>
              </div>
            </div>
            <div className="w-full text-end mt-8">
              <button
                type="submit"
                className="bg-black text-white px-16 py-3 text-sm"
              >
                Ödeme
              </button>
            </div>
          </div>
        </div>
      </form>

      <Modal
        title="Ödeme Bilgileri"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={400}
      >
        <div className="text-center">
          <div>
            <input
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleCardChange}
              type="text"
              placeholder="Kart Numarası"
              maxLength={16}
              className="border p-3 rounded w-full mb-3"
            />
          </div>
          <div className="flex gap-3">
            <input
              name="expiry"
              value={cardData.expiry}
              onChange={handleCardChange}
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              className="border p-3 rounded w-full"
            />
            <input
              name="cvc"
              value={cardData.cvc}
              onChange={handleCardChange}
              type="text"
              placeholder="CVC"
              maxLength={3}
              className="border p-3 rounded w-full"
            />
          </div>
          <div className="mt-6">
            <button
              onClick={handlePayment}
              className="bg-black text-white px-16 py-3 text-sm"
            >
              Onayla ve Öde
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PlaceOrder;
