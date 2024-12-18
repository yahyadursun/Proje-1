import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { User, Edit, Save, X, List } from "lucide-react";

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    surname: "",
    email: "",
    phoneNo: "",
    identityNo: "",
    gender: "",
  });

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
        setUser(response.data.user);
        setEditForm(response.data.user);
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

  const updateUserProfile = async () => {
    if (!token) {
      toast.error("Lütfen giriş yapın.");
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        editForm,
        { headers: { token: token } }
      );

      if (response.data.success) {
        toast.success("Profil başarıyla güncellendi.");
        setUser(response.data.user);
        setIsEditing(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="animate-pulse text-gray-500">
          <User size={48} className="mx-auto mb-4" />
          <p className="text-xl font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <X size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-xl text-red-500">Kullanıcı bilgileri bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-300 transform transition-all duration-300 hover:scale-105">
        <div className="bg-gray-200 text-gray-800 p-6 flex items-center border-b border-gray-300">
          <User size={48} className="mr-4 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-700">Profilim</h1>
        </div>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Profil Bilgilerini Düzenle
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Ad", key: "name" },
                  { label: "Soyad", key: "surname" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Telefon Numarası", key: "phoneNo" },
                  { label: "TC Kimlik", key: "identityNo" },
                  { label: "Cinsiyet", key: "gender" },
                ].map(({ label, key, type = "text" }) => (
                  <div key={key} className="relative">
                    <input
                      type={type}
                      value={editForm[key]}
                      placeholder={label}
                      onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                      className="w-full bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none rounded-t-lg"
                    />
                    <label className="absolute left-2 top-0 text-gray-500 text-xs transition-all duration-300">
                      {label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6 space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
                >
                  <X size={20} className="mr-2" /> İptal
                </button>
                <button
                  onClick={updateUserProfile}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
                >
                  <Save size={20} className="mr-2" /> Kaydet
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Kullanıcı Bilgileri
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Ad", value: user.name },
                  { label: "Soyad", value: user.surname },
                  { label: "Email", value: user.email },
                  { label: "Telefon Numarası", value: user.phoneNo },
                  { label: "TC Kimlik", value: user.identityNo },
                  { label: "Cinsiyet", value: user.gender },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-100 p-3 rounded-lg">
                    <span className="text-gray-500 font-medium mr-2">{label}:</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6 space-x-4">
                <button
                  onClick={() => window.location.href = "/orders"}
                  className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
                >
                  <List size={20} className="mr-2" /> Siparişlerim
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
                >
                  <Edit size={20} className="mr-2" /> Profil Düzenle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
