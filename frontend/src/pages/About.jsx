import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'About'} text2={'us'}></Title>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[200px]' src={assets.about_icon}></img>
        <div className='flex flex-col justify-center gap-6 md:w-2/4'>
        <p>dummy mummy</p>
        <p>dummy mummy</p></div>
      </div>
      
    </div>
  )
}

export default About
