import React from 'react'

const Footer = () => {
    return (
        <div className="font-poppins h-72 w-full bg-primary1 flex phone:flex-col">
            <h1 className="footer-font-style text-4xl phone:text-2xl w-1/4 pt-10 pl-20 phone:pl-10 ">Tokobat</h1>
            <div className="pt-12 phone:pt-5 pl-20 phone:pl-10">
                <h1 className="poppins font-bold text-light-light mb-4 phone:mb-2 phone:text-sm">Contact us</h1>
                <p className="poppins text-sm phone:text-xs text-light-light mb-1">hahaha@mail</p>
                <p className="poppins text-sm phone:text-xs text-light-light mb-1">089888989</p>
                <p className="poppins text-sm phone:text-xs text-light-light">Jl. hahahhahaha</p>
            </div>
        </div>
    )
}

export default Footer
