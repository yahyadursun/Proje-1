import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext"; // ShopContext'ten token'ı almak
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // API'den kullanıcı verisini çekme
  const getUserProfile = async () => {
    if (!token) {
      toast.error("Lütfen giriş yapın.");
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token: token },
      });

      if (response.data.success) {
        setUser(response.data.user); // API'den gelen kullanıcı verisini set et
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">Kullanıcı bilgileri bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700">
      <h1 className="text-3xl font-bold mb-4">Profilim</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Kullanıcı Bilgileri</h2>
          <div className="space-y-2">
            <p className="text-gray-600"><strong>Ad:</strong> {user.name}</p>
            <p className="text-gray-600"><strong>Soyad:</strong> {user.surname}</p>
            <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => window.location.href = "/orders"}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Siparişlerim
          </button>
          <button
            onClick={() => window.location.href = "/edit-profile"}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Profil Düzenle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
