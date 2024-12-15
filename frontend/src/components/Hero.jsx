import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { assets } from "../assets/assets"; // Adjust the import path if necessary

const Hero = () => {
  const slides = [
    {
      id: 1,
      title: "Latest Arrivals",
      subtitle: "OUR BEST SELLERS",
      image: assets.hero_img, // Use the imported image here
    },
    {
      id: 2,
      title: "Exclusive Collection",
      subtitle: "TOP PICKS",
      image: assets.hero_img2,
    },
    {
      id: 3,
      title: "New Season",
      subtitle: "FRESH STYLES",
      image: assets.hero_img3,
    },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Hero Slider */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Hero Slider */}
        <Swiper
          navigation={false}
          loop={true}
          autoplay={{ delay: 10, disableOnInteraction: false }}
          className="h-full w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="flex flex-col sm:flex-row items-center justify-center h-full w-full"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100vh", // Ensure this makes it take full screen height
                }}
              >
                {/* Left Side Content */}
                <div className="w-full sm:w-1/2 bg-black bg-opacity-50 text-white p-10">
                  <div className="flex items-center gap-2 mb-4">
                    <p className="w-8 md:w-11 h-[2px] bg-white"></p>
                    <p className="font-medium text-sm md:text-base">
                      {slide.subtitle}
                    </p>
                  </div>
                  <h1 className="prata-regular text-3xl sm:text-4xl lg:text-5xl sm:py-3 leading-relaxed">
                    {slide.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-4">
                    <button className="font-semibold text-sm md:text-base bg-white text-black py-2 px-6 rounded-lg hover:bg-gray-300">
                      SHOP NOW
                    </button>
                  </div>
                </div>
                {/* Optional Right Side Space */}
                <div className="w-full sm:w-1/2"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;
