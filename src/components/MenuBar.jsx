import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const MenuBar = ({ open, close }) => {
    const location = useLocation()

    const navigate = useNavigate()

    const changePage = (pageName) => {
        navigate(`/${pageName}`)
        close()
    }

    return (
        <div
            className='bg-primary1 w-full phone:p-4 fixed z-50 rounded-b-lg shadow-2xl font-poppins'
            hidden={open}
        >
            <svg
                className="w-6 h-6 text-white mb-2 ml-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                onClick={close}
            >
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <div className='flex flex-col'>
                <button
                    className={'text-left shadow-md font-bold text-white px-3 py-2 rounded-md mb-2' +
                        (location.pathname.includes('products') ? ' bg-secondary1' : '')
                    }
                    onClick={() => changePage('products')}
                >
                    Products
                </button>
                <button
                    className={'text-left shadow-md font-bold text-white px-3 py-2 rounded-md mb-2' +
                        (location.pathname.includes('prescription') ? ' bg-secondary1' : '')
                    }
                    onClick={() => changePage('prescription')}
                >
                    Prescription
                </button>
            </div>
        </div>
    )
}

export default MenuBar
