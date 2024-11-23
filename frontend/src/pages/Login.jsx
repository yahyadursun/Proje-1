import React, { useState } from 'react'

const Login = () => {
  const [currentState,setCurrentState] = useState('Login');
  const onSubmitHandler = async (event) => {event.preventDefault();
    
  }

  return (
    <form onSubmit={onSubmitHandler} className=' flex flex-col items-center w-[90%] sm:max-w-96 m-auto gap-4 mt-14 text-black'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      <div className='flex flex-row'>
      {currentState === 'Login' ? "" : <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Ad' required/>} 
      {currentState === 'Login' ? "" : <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Soyad' required/>}</div>
      <input type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
      <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Şifre' required />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Şifremi unuttum</p>
        {
          currentState==='Login' ? <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer'>Hesap Oluştur</p> : <p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Giriş Yap </p>
        }
      </div> 
      <button className='bg-black text-white font-light px-8 py-2 mt-4 '>{currentState === 'Login' ? 'Giriş Yap' : 'Hesap Oluştur'}</button>
    </form>
  )
}

export default Login
