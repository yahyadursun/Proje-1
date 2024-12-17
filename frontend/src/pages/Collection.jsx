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
    { id: "category", label: "Cinsiyet", options: ["Erkek", "Kadın", "Unisex","Çocuk"] },
    {
      id: "subCategory",
      label: "Kategori",
      options: ["Bot","Koşu Ayakkabısı", "Outdoor", "Sneaker","Sandalet","Terlik"],
    },
    {
      id: "sizes",
      label: "Beden",
      options: ["19", "20", "20.5", "21", "21.5", "22", "22.5", "51", 208],
    },
    {
      id: "brand",
      label: "Marka",
      options: ["New Balance", "Adidas", "Puma", "Nike","Reebok","Skechers","The North Face","Timberland","Tommy Hilfiger","Vans","Jack Wolfskin","U.S. Polo Assn."],
    },
    {
      id: "color",
      label: "Renk",
      options: ["Kırmızı", "Mavi", "Siyah","Gri", "Beyaz","Pembe","Krem","Lacivert","Haki"],
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

    categories.forEach((cat) => {
      if (filters[cat.id]?.length > 0) {
        filtered = filtered.filter((item) => {
          if (cat.id === "sizes") {
            // Normalize both filter and product sizes to strings
            const productSizes = item[cat.id].map((size) => size.toString());
            const filterSizes = filters[cat.id].map((size) => size.toString());
            return filterSizes.some((filterSize) => productSizes.includes(filterSize));
          }
          return filters[cat.id].includes(item[cat.id]);
        });
      }
    });

    // Apply sorting
    if (sortType === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortType === "bestseller") {
      filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }else if ( sortType==="newSeason"){
      filtered.sort((a,b)=>(b.newSeason ? 1 : 0)-(a.newSeason ? 1 : 0 ));
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
            className="flex funnel-sans items-center px-4 py-2 text-sm bg-gradient-to-r from-white to-gray-200 text-black rounded-full shadow-lg hover:opacity-90 transition-all duration-300"
          >
            Filtreler
          </button>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="px-4 funnel-sans py-2 text-sm border rounded-full shadow-md bg-gradient-to-r from-white to-gray-200"
          >
            <option value="relevant">Sırala</option>
            <option value="price-asc">Fiyat: Azdan Çoğa</option>
            <option value="price-desc">Fiyat: Çoktan Aza</option>
            <option value="bestseller">Best Seller</option>
            <option value="newSeason">New Season</option>
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
            newSeason={item.newSeason}
          />
        ))}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div
            ref={modalRef}
            className="bg-white w-full  funnel-sans max-w-lg h-full p-6 flex flex-col divide-y divide-gray-200"
          >
            <div className="flex funnel-sans justify-between items-center py-4">
              <h2 className="text-2xl funnel-sans text-gray-900">FİLTRELER</h2>
              <div className="flex gap-6">
                <button
                  onClick={clearFilters}
                  className="text-lg text-gray-500 hover:text-black"
                >
                  Temizle
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-2xl funnel-sans font-bold text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex funnel-sans flex-grow">
              <div className="w-2/4 funnel-sans border-r border-gray-200 p-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full funnel-sans text-left py-3 px-6 text-lg font-medium ${
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
                    <label key={option} className="funnel-sans flex items-center gap-3 py-3">
                      <input
                        type="checkbox"
                        checked={filters[selectedCategory.id]?.includes(option)}
                        onChange={() => toggleFilter(selectedCategory.id, option)}
                        className="w-4 h-4 "
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
              className="w-full funnel-sans py-3 bg-black text-white text-xl rounded-md"
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
