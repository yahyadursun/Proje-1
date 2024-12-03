import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterProducts, setFilterProducts] = useState(products || []);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filters, setFilters] = useState({
    category: [],
    subCategory: [],
    sizes: [],
    brand: [],
    color: [],
  });
  const [sortType, setSortType] = useState("relevant");
  const modalRef = useRef(null);

  const categories = [
    { id: "category", label: "Cinsiyet", options: ["Men", "Women", "Unisex"] },
    {
      id: "subCategory",
      label: "Ayakkabı Türü",
      options: ["Daily", "Basketball", "Klasik", "Outdoor", "Others"],
    },
    {
      id: "sizes",
      label: "Ayakkabı Numarası",
      options: [36, 37, 38, 39, 40],
    },
    {
      id: "brand",
      label: "Marka",
      options: ["New Balance", "Adidas", "Puma", "Nike"],
    },
    {
      id: "color",
      label: "Renk",
      options: ["Kırmızı", "Mavi", "Siyah", "Beyaz"],
    },
  ];

  const toggleFilter = (category, option) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(option)
        ? prev[category].filter((item) => item !== option)
        : [...prev[category], option],
    }));
  };

  const applyFilter = useCallback(() => {
    let filtered = [...products];

    // Apply search filter
    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category-based filters
    categories.forEach((cat) => {
      if (filters[cat.id]?.length > 0) {
        filtered = filtered.filter((item) =>
          filters[cat.id].includes(item[cat.id])
        );
      }
    });

    // Apply sorting
    if (sortType === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortType === "bestseller") {
      filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }

    setFilterProducts(filtered);
  }, [filters, search, showSearch, products, sortType, categories]);

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
  }, [filters, search, showSearch, products, sortType, applyFilter]);

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
      {/* Title and Sort Options */}
      <div className="flex justify-between items-center mb-4">
        <Title text1="All" text2=" Collections" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center px-4 py-2 text-sm bg-gradient-to-r from-white to-gray-200 text-black rounded-full shadow-lg hover:opacity-90 transition-all duration-300"
          >
            Filtreler
          </button>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="px-4 py-2 text-sm border rounded-full shadow-md bg-gradient-to-r from-white to-gray-200"
          >
            <option value="relevant">Sırala</option>
            <option value="price-asc">Fiyat: Azdan Çoğa</option>
            <option value="price-desc">Fiyat: Çoktan Aza</option>
            <option value="bestseller">Best Seller</option>
          </select>
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
            bestseller={item.bestseller}
          />
        ))}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div
            ref={modalRef}
            className="bg-white w-full max-w-lg h-full p-6 flex flex-col divide-y divide-gray-200"
          >
            <div className="flex justify-between items-center py-4">
              <h2 className="text-2xl text-gray-900">FİLTRELER</h2>
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
            <div className="flex flex-grow">
              <div className="w-2/4 border-r border-gray-200 p-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left py-3 px-6 text-lg font-medium ${
                      selectedCategory?.id === cat.id
                        ? "bg-gray-200 text-gray-900"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="w-2/3 p-4">
                {selectedCategory &&
                  selectedCategory.options.map((option) => (
                    <label key={option} className="flex items-center gap-3 py-3">
                      <input
                        type="checkbox"
                        checked={filters[selectedCategory.id]?.includes(option)}
                        onChange={() => toggleFilter(selectedCategory.id, option)}
                        className="w-5 h-5"
                      />
                      {option}
                    </label>
                  ))}
              </div>
            </div>
            <button
              onClick={() => {
                applyFilter();
                setShowFilterModal(false);
              }}
              className="w-full py-3 bg-black text-white text-xl rounded-md"
            >
              Filtreleri Uygula
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
