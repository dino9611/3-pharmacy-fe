import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import './styles/AdminNavbar.css'

const AdminNavbar = () => {
    // untuk ngambil parameter url
    let params = window.location.pathname.replace("/", "")

    // dispatch
    const dispatch = useDispatch()

    // fungsi log out
    const onLogout = () => {
        dispatch({ type: "logout" })
        localStorage.removeItem("token")
    }

    return (
        <div className="bg-green-dark w-80 fixed h-full text-center flex flex-col py-6">
            <h1 className="admin-font-style mb-20">
                <span className="tokobat-font-style">Tokobat</span>  admin
            </h1>

            {/* Button menuuuuuuu */}
            {params === "adminproducts" ? (
                <Link to="/adminproducts">
                    <button
                        className="bg-green-light text-green-dark hover:text-green-dark w-3/4 rounded-lg py-2 mb-2"
                    >
                        Products
                    </button>
                </Link>
            ) : (
                <Link to="/adminproducts">
                    <button className="text-green-light hover:bg-green-light hover:text-green-dark w-3/4 rounded-lg py-2 mb-2">Products</button>
                </Link>
            )}
            {params === "admintransaction" ? (
                <Link to="/admintransaction">
                    <button
                        className="bg-green-light text-green-dark hover:text-green-dark w-3/4 rounded-lg py-2 mb-2"
                    >
                        Transaction
                    </button>
                </Link>
            ) : (
                <Link to="/admintransaction">
                    <button className="text-green-light hover:bg-green-light hover:text-green-dark w-3/4 rounded-lg py-2 mb-2">Transaction</button>
                </Link>
            )}
            {params === "adminhistory" ? (
                <Link to="/adminhistory">
                    <button
                        className="bg-green-light text-green-dark hover:text-green-dark w-3/4 rounded-lg py-2 mb-2"
                    >
                        History
                    </button>
                </Link>
            ) : (
                <Link to="/adminhistory">
                    <button className="text-green-light hover:bg-green-light hover:text-green-dark w-3/4 rounded-lg py-2 mb-2">History</button>
                </Link>
            )}
            {params === "adminreport" ? (
                <Link to="/adminreport">
                    <button
                        className="bg-green-light text-green-dark hover:text-green-dark w-3/4 rounded-lg py-2 mb-2"
                    >
                        Report
                    </button>
                </Link>
            ) : (
                <Link to="/adminreport">
                    <button className="text-green-light hover:bg-green-light hover:text-green-dark w-3/4 rounded-lg py-2 mb-2">Report</button>
                </Link>
            )}
            <div>
                <button onClick={onLogout} className="bg-peach-dark hover:bg-peach-light w-3/4 rounded-lg py-2 mt-52">Log out</button>
            </div>
        </div>
    )
}

export default AdminNavbar
