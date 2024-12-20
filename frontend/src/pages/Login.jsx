import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify"; // Toast importu

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [identityNo, setIdentityNo] = useState("");
  const [gender, setGender] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Boş alanları kontrol et
    if (!email || !password) {
      toast.error("Email ve şifre gerekli. Lütfen her iki alanı da doldurun.");
      return;
    }

    try {
      if (currentState === "Sign Up") {
        // Kayıt işlemi
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          surname,
          email,
          password,
          phoneNo,
          identityNo,
          gender,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Başarıyla kaydoldunuz. Giriş yapabilirsiniz.");
        } else {
          // Eğer email zaten veritabanında varsa
          if (response.data.message === "user already exists") {
            toast.error("Böyle bir kullanıcı zaten mevcut.");
          } else {
            toast.error(response.data.message); // Diğer hatalar
          }
        }
      } else {
        // Giriş işlemi
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Giriş başarılı!");
        } else {
          // Hatalı giriş durumlarını kontrol et
          if (response.data.message === "User not found") {
            toast.error("Böyle bir kullanıcı bulunamadı.");
          } else if (response.data.message === "Incorrect password") {
            toast.error("Hatalı şifre. Lütfen tekrar deneyin.");
          } else {
            // Diğer hatalar
            toast.error("Hatalı email veya şifre.");
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/"); // Token varsa, ana sayfaya yönlendir
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto gap-4 mt-14 text-black"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      <div className="flex flex-row">
        {currentState === "Sign Up" && (
          <>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="Ad"
              required
            />
            <input
              onChange={(e) => setSurname(e.target.value)}
              value={surname}
              type="text"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="Soyad"
              required
            />
            <input
              onChange={(e) => setPhoneNo(e.target.value)}
              value={phoneNo}
              type="text"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="Telefon Numarası"
              required
            />
            <input
              onChange={(e) => setIdentityNo(e.target.value)}
              value={identityNo}
              type="text"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="TC Kimlik Numarası"
              required
            />
            <select
              onChange={(e) => setGender(e.target.value)}
              value={gender}
              className="w-full px-3 py-2 border border-gray-800"
              required
            >
              <option value="">Cinsiyet</option>
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
            </select>
          </>
        )}
      </div>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Şifre"
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Şifremi unuttum</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Hesap Oluştur
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Giriş Yap
          </p>
        )}
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "Login" ? "Giriş Yap" : "Hesap Oluştur"}
      </button>
    </form>
  );
};

export default Login;
