import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden'>
        <img 
          className='hover:scale-110 transition ease-in-out' 
          src={Array.isArray(image) && image.length > 0 ? image[0] : 'https://example.com/default-image.jpg'} 
          alt={name} 
        />
      </div>
      <div className="flex flex-col items-center">
        <p className='montserrat pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm prompt-bold'>{currency}{price}</p>
      </div>
    </Link>
  );
}

export default ProductItem;

