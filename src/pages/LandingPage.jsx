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
            <div className="bg-primary1">
                <div className="font-poppins flex justify-evenly items-center">
                    <div >
                        <p className="max-w-sm text-3xl font-bold text-white mb-4">Lorem ipsum dolor </p>
                        <p className="max-w-sm text-base text-white">sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin</p>
                    </div>
                    <div className=" img-cont">
                        <img src={Logo1} alt="Default" className="image-1" />
                    </div>
                </div>
            </div>
            <div className="font-poppins bg-secondary1 flex justify-evenly items-center pt-8 py-20">
                <div className="img-cont">
                    <img src={Logo2} alt="Default" className="image-2" />
                </div>
                <div className="shop-bttn">
                    <p className="max-w-md text-3xl font-bold text-white mb-4">Lorem ipsum dolor </p>
                    <p className="max-w-sm text-base text-white">sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin</p>
                    <div>
                        <Link to="/products">
                            <button className="bg-primary1 hover:bg-secondary1 text-white rounded-md px-4 py-2 mt-4">Shop Now!</button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default LandingPage