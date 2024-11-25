import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from 'axios';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const  {navigate,backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext);
  const[formData,setFormData]= useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  })


  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData(data =>({...data, [name]:value}))
  }

    const onSubmitHandler = async (event) => {
      event.preventDefault()
      try {
          let orderItems = []

          for(const items in cartItems){
            for(const item in cartItems[items]){
              if(cartItems[items][item]>0){
                const itemInfo=structuredClone(products.find(product=>product._id === items))
                if (itemInfo) {
                  itemInfo.size = item
                  itemInfo.quantity = cartItems[items][item]
                  orderItems.push(itemInfo)
                }
              }
            }
          }
          
          let orderData = {
            address: formData,
            items: orderItems,
            amount: getCartAmount() + Number(delivery_fee || 0 )
          }
          
          switch(method){
            case 'cod':
              const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers:{token}})
              if (response.data.success) {
                setCartItems({})
                navigate('/orders')

              } else {
                toast.error(response.data.message)
              }
              break;

            default:
              break;
          }

      } catch (error) {
          console.log(error)
          toast.error(error.message)
      }
  }


  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/*left side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2x1 my-3">
          <Title text1={"TESLİMAT"} text2={"BİLGİSİ"} />
        </div>
        <div className="flex gap-3">
          <input 
            required onChange={onChangeHandler} name='firstName' value={formData.firstName}
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="first name"
          />
          <input
            required onChange={onChangeHandler} name='lastName' value={formData.lastName}
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="last name"
          />
        </div>
        <input
          required onChange={onChangeHandler} name='email' value={formData.email}
          type="email"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="email adress"
        />
        <input
          required onChange={onChangeHandler} name='street' value={formData.street}
          type="text"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="street"
        />
        <div className="flex gap-3">
          <input
            required onChange={onChangeHandler} name='city' value={formData.city}
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="city"
          />
          <input
            required onChange={onChangeHandler} name='state' value={formData.state}
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="state"
          />
        </div>
        <div className="flex gap-3">
          <input
            required onChange={onChangeHandler} name='zipcode' value={formData.zipcode}
            type="number"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="zipcode"
          />
          <input
            required onChange={onChangeHandler} name='country' value={formData.country}
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="country"
          />
        </div>
        <input
          required onChange={onChangeHandler} name='phone' value={formData.phone}
          type="phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="phone"
        />
      </div>
      {/* right side */}
      <div className="mt-8">
        <div className=" mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12 ">
          <Title text1={"Ödeme"} text2={"Seçenekleri"} />
          {/*ödeme seçenkleri */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.stripe_icon}
                alt="Stripe"
              ></img>
            </div>
            <div
              onClick={() => setMethod("kredikartı")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "kredikartı" ? "bg-green-400" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.kredikart_icon}
                alt="Kredi Kartı"
              ></img>
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                Kapıda Ödeme
              </p>
            </div>
          </div>
          <div  className="w-full text-end mt-8">
                <button type='submit' className="bg-black text-white px-16 py-3 text-sm">Ödeme</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
