import React from "react";
import "./styles/landingPage.css"
import { styled } from '@mui/material/styles';
import Logo1 from "./Asset/Landingpage1.svg"
import Logo2 from "./Asset/Landingpage2.svg"
import Button from '@mui/material/Button';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const LandingPage = () => {
    const ColorButton = styled(Button)(({ theme }) => ({
        borderRadius: 16,
        color: 'black',
        backgroundColor: '#FFC286',
        '&:hover': {
            backgroundColor: '#66806A',
            color: 'white'
        },
    }));
    return (
        <div>
            <Header />
            <div className="font-poppins bg-primary1 flex phone:flex-col justify-evenly items-center py-6">
                <div className="phone:order-2 phone:mx-10 my-4">
                    <p className="max-w-sm text-3xl phone:text-lg font-bold text-white mb-4 phone:mb-1">Lorem ipsum dolor </p>
                    <p
                        className="max-w-sm text-base phone:text-sm text-white">
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin
                    </p>
                </div>
                <img src={Logo1} alt="Default" className="w-96 phone:w-3/6 phone:mx-auto" />
            </div>
            <div className="font-poppins bg-secondary1 flex phone:flex-col justify-evenly items-center py-6">
                <img src={Logo2} alt="Default" className="w-96 phone:w-3/6" />
                <div className="phone:mx-10 phone:mt-4">
                    <p className="max-w-md text-3xl font-bold phone:text-lg text-white mb-4 phone:mb-1">Lorem ipsum dolor </p>
                    <p className="max-w-sm text-base text-white phone:text-sm">sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin</p>
                    <Link to="/products">
                        <button className="bg-primary1 hover:bg-peach-light text-white rounded-md px-4 py-2 phone:w-full phone:text-sm mt-4">Shop Now!</button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default LandingPage