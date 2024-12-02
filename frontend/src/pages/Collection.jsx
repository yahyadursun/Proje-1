import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterProducts, setFilterProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filters, setFilters] = useState({
    category: [], // Unisex, Erkek, Kadın
    subCategory: [], // Daily, Spor, vb.
    sizes: [], // 37, 38, 39, 40, vb.
    brand: [], // Nike, Adidas, Puma, vb.
    color: [], // Kırmızı, Mavi, vb.
  });
  const [sortType, setSortType] = useState("relavent");
  const modalRef = useRef(null);

  const categories = [
    { id: "category", label: "Cinsiyet", options: ["Men", "Woman", "Unisex"] },
    { id: "subCategory", label: "Ayakkabı Türü", options: ["Daily", "Spor", "Klasik", "Outdoor"] },
    { id: "sizes", label: "Ayakkabı Numarası", options: ["36", "37", "38", "39", "40"] },
    { id: "brand", label: "Marka", options: ["New Balance", "adidas", "Puma", "Nike"] },
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

    // Apply search filter
    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filters
    categories.forEach((cat) => {
      if (filters[cat.id] && filters[cat.id].length > 0) {
        filtered = filtered.filter((item) =>
          filters[cat.id].includes(item[cat.id])
        );
      }
    });

    // Apply size filters
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((item) =>
        item.sizes.some((size) => filters.sizes.includes(size))
      );
    }

    setFilterProducts(filtered);
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      subCategory: [],
      sizes: [],
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
            className="bg-white w-full max-w-lg h-full p-6 flex flex-col divide-y divide-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center py-4">
              <h2 className="text-2xl font-semibold text-gray-900">FİLTRELER</h2>
              <div className="flex gap-6">
                <button 
                  onClick={clearFilters}
                  className="text-lg text-gray-500 hover:text-black"
                >
                  Temizle
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-2xl font-bold text-gray-500 hover:text-black"
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
                    className={`block w-full text-left py-3 px-6 text-lg font-medium ${
                      selectedCategory?.id === cat.id
                        ? "bg-gray-100 text-gray-900"
                        : "hover:bg-gray-50 text-gray-600"
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
                        className="flex items-center gap-3 py-3 text-lg text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={filters[selectedCategory.id]?.includes(option)}
                          onChange={() =>
                            toggleFilter(selectedCategory.id, option)
                          }
                          className="text-gray-600"
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
                className="w-full py-3 bg-black text-white text-xl font-semibold rounded-md hover:bg-gray-800 transition-all duration-300"
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
