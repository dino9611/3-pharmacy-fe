import React from 'react'
import { useSelector } from 'react-redux'
import { toRupiah } from '../helpers/toRupiah'

const CartFooter = () => {
    // global states
    const cartState = useSelector(state => state.cart)

    const renderTotal = () => {
        let total = 0
        cartState.forEach(val => {
            total += val.productPriceRp * val.qty
        })
        return total
    }

    return (
        <div className='bg-green-dark fixed left-0 bottom-0 w-full h-24 flex justify-end items-center px-4'>
            <p className='mr-4 text-white text-lg'>Total = {toRupiah(renderTotal())}</p>
            <button className='bg-peach-light hover:bg-peach-dark px-10 py-3 rounded-lg'>
                Checkout
            </button>
        </div>
    )
}

export default CartFooter
