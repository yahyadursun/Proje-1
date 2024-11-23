import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"About"} text2={"us"}></Title>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full md:max-w-[200px]" src={assets.about_icon}></img>
        <div className="flex flex-col justify-center gap-6 md:w-2/4">
          <p>dummy mummy</p>
          <p>dummy mummy</p>
          <b className="text-gray-800">Our mission</b>
          <p>our mission at sneakster is to empower customers with choices</p>
        </div>
      </div>

      <div className=" text-4xl py-4 ">
        <Title text1={'WHY'} text2={"CHOOSE US"}></Title>
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b >QUALITY ASSURANCE :</b>
          <p className="text-gray-600">dummy</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b >Conveience :</b>
          <p className="text-gray-600">dummy</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b >exceptional customer service :</b>
          <p className="text-gray-600">dummy</p>
        </div>
      </div>
      <NewsLetterBox></NewsLetterBox>
    </div>
  );
};

export default About;
