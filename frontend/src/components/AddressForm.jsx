import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';

const AddressForm = ({ isOpen, onClose, editAddress, setEditAddress, onSave, onDelete }) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          {editAddress.id ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={editAddress.label || ''}
              onChange={(e) => setEditAddress({...editAddress, label: e.target.value})}
              placeholder="Adres Etiketi (Ev, İş, vb.)"
              className="w-full bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none"
            />
          </div>
          
          <div>
            <input
              type="text"
              value={editAddress.street || ''}
              onChange={(e) => setEditAddress({...editAddress, street: e.target.value})}
              placeholder="Sokak Adresi"
              className="w-full bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none"
            />
          </div>
          
          <div>
            <input
              type="text"
              value={editAddress.city || ''}
              onChange={(e) => setEditAddress({...editAddress, city: e.target.value})}
              placeholder="İl"
              className="w-full bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none"
            />
          </div>

          <div>
            <input
              type="text"
              value={editAddress.state || ''}
              onChange={(e) => setEditAddress({...editAddress, state: e.target.value})}
              placeholder="İlçe"
              className="w-full bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none"
            />
          </div>
          
          <div>
            <input
              type="text"
              value={editAddress.postalCode || ''}
              onChange={(e) => setEditAddress({...editAddress, postalCode: e.target.value})}
              placeholder="Posta Kodu"
              className="w-full bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none"
            />
          </div>
          
          <div>
            <input
              type="text"
              value={editAddress.country || ''}
              onChange={(e) => setEditAddress({...editAddress, country: e.target.value})}
              placeholder="Ülke"
              className="w-full bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6 space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
            >
              <X size={20} className="mr-2" /> İptal
            </button>
            {editAddress.label && (
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-300 flex items-center justify-center"
              >
                <Trash2 size={20} className="mr-2" /> Sil
              </button>
            )}
          </div>
          <button
            onClick={onSave}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
          >
            <Save size={20} className="mr-2" /> Kaydet
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Adresi Sil</h4>
              <p className="text-gray-600 mb-6">Bu adresi silmek istediğinizden emin misiniz?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    onDelete(editAddress.label);
                    setIsDeleteConfirmOpen(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;