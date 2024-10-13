import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className=' text-gray-900 text-4xl'> 
        {text1}
        <span className=' text-gray-500 font-small text-2xl'> 
          {text2}
        </span>
      </p>
    </div>
  );
};

export default Title;
