import React, { useEffect } from 'react';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import { getRawMaterials } from '../../redux/actions/rawMaterialActions';

export default function RawMaterials() {
  const dispatch = useDispatch();
  const rawMaterials = useSelector((state) => state.rawMaterialReducers);

  useEffect(() => {
    dispatch(getRawMaterials(1, 5));
  }, [dispatch]);

  console.log(rawMaterials);
  return (
    <div>
      <h1 className='bg-black text-white text-center text-5xl'>
        raw materials
      </h1>

      <button
        onClick={() => dispatch(getRawMaterials(1, 2))}
        className='rounded-sm bg-green-500 h-20 w-20'
      >
        get
      </button>
    </div>
  );
}
