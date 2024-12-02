import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filters, setFilters] = useState({
    gender: [],
    shoeType: [],
    shoeSize: [],
    brand: [],
    color: [],
  });
  const [sortType, setSortType] = useState("relavent");
  const modalRef = useRef(null);

  const categories = [
    { id: "gender", label: "Cinsiyet", options: ["Erkek", "Kadın", "Unisex"] },
    { id: "shoeType", label: "Ayakkabı Türü", options: ["Spor", "Klasik", "Outdoor"] },
    { id: "shoeSize", label: "Ayakkabı Numarası", options: ["36", "37", "38", "39", "40"] },
    { id: "brand", label: "Marka", options: ["Nike", "Adidas", "Puma"] },
    { id: "color", label: "Renk", options: ["Kırmızı", "Mavi", "Siyah", "Beyaz"] },
  ];

  const toggleFilter = (category, option) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(option)
        ? prev[category].filter((item) => item !== option)
        : [...prev[category], option],
    }));
  };

  const applyFilter = () => {
    let filtered = products.slice();

    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    categories.forEach((cat) => {
      if (filters[cat.id].length > 0) {
        filtered = filtered.filter((item) =>
          filters[cat.id].includes(item[cat.id])
        );
      }
    });

    setFilterProducts(filtered);
  };

  const clearFilters = () => {
    setFilters({
      gender: [],
      shoeType: [],
      shoeSize: [],
      brand: [],
      color: [],
    });
  };

  useEffect(() => {
    applyFilter();
  }, [filters, search, showSearch, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowFilterModal(false);
      }
    };

    if (showFilterModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterModal]);

  return (
    <div className="flex flex-col pt-10 border-t">
      {/* Title and sort options */}
      <div className="flex justify-between items-center mb-4">
        <Title text1={"All"} text2={" Collections"} />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:opacity-90 transition-all duration-300"
          >
            Filtreler
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
        {filterProducts.map((item, index) => (
          <ProductItem
            key={index}
            name={item.name}
            id={item._id}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
          <div
            ref={modalRef}
            className="bg-white w-full max-w-lg h-full p-4 flex flex-col divide-y divide-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center py-4">
              <h2 className="text-xl font-bold">FİLTRELER</h2>
              <div className="flex gap-4">
                <button 
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Temizle
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-lg font-bold text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-grow">
              {/* Left Side */}
              <div className="w-1/3 border-r p-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left py-2 px-4 rounded-md text-sm ${
                      selectedCategory?.id === cat.id
                        ? "bg-gray-200 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Right Side */}
              <div className="w-2/3 p-4">
                {selectedCategory && (
                  <div>
                    {selectedCategory.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={filters[selectedCategory.id]?.includes(option)}
                          onChange={() =>
                            toggleFilter(selectedCategory.id, option)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="py-4">
              <button
                onClick={() => {
                  applyFilter();
                  setShowFilterModal(false);
                }}
                className="w-full py-2 bg-black text-white rounded-md"
              >
                Filtreleri Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
