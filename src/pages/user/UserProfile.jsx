import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Avatest from "../Asset/Avatest.jpg"

const Userprofile = () => {




    return (
        <div>
            <div className="top-prof bg-bCol h-52 flex items-center">
                <div className="pl-10">
                    <Avatar
                        alt="Remy Sharp"
                        src={Avatest}
                        sx={{ width: 140, height: 140 }}
                    />
                </div>
                <div className="pl-10">
                    TEST1
                </div>
            </div>
            <div>
                test1
            </div>
        </div>
    )
}

export default Userprofile