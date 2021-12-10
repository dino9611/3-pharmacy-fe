import React from "react";
import "./styles/landingPage.css"
import { styled } from '@mui/material/styles';
import Logo1 from "./Asset/Landingpage1.svg"
import Logo2 from "./Asset/Landingpage2.svg"
import Button from '@mui/material/Button';
import Header from "../components/Header";

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
            <div className="top-cont container px-10 ">
                <div className=" flex justify-evenly items-center">
                    <div >
                        <div className="max-w-md text-3xl font-bold">Lorem ipsum dolor </div>
                        <div className="max-w-sm text-lg">sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin</div>
                    </div>
                    <div className=" img-cont">
                        <img src={Logo1} alt="Default" className="image-1" />
                    </div>
                </div>
            </div>
            <div className=" flex justify-evenly items-center pt-8 ">
                    <div className="img-cont">
                        <img src={Logo2} alt="Default"className="image-2" />
                    </div>
                    <div className="shop-bttn">
                        <div className="max-w-md text-3xl font-bold">Lorem ipsum dolor </div>
                        <div className="max-w-sm text-lg">sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin</div>
                        <div>
                            <ColorButton sx={{mt:3}} > Shop Now! </ColorButton>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default LandingPage