import React, { useEffect, useState } from "react";
import qs from 'query-string'
import axios from "axios";
import { API_URL } from "../../constants/api";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress';

const Verified = () => {
    const [condition, setcondition] = useState(1)
    const navigate = useNavigate()
    const fetchData = async() => {
        const {token} = qs.parse(window.location.search)
        console.log(token)
        // const parsed = qs.parse(props.location.search)
        
        try {
            const res = await axios.get(`${API_URL}/auth/verified`, {headers: {'Authorization' : `Bearer ${token}` }})
            console.log(res.data)
            setcondition(2)
            Swal.fire(
                `Verified!`,
                `Login Now and Make Us Rich!`,
                `success`
            )
            navigate("/")
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message ||"Server Error", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            })
            setcondition(3)
            navigate("/")
        }
    }
    useEffect (() => {
        fetchData()
    }, [])
    if(condition === 1){
        return (
            <div className='text-center text-6xl'>
                <CircularProgress color="secondary" />
                <CircularProgress color="secondary" />
            </div>
        )
    }
    if (condition === 2){
        return (
            <div className='text-center text-6xl'>
                <CircularProgress color="secondary" />
                <CircularProgress color="secondary" />
            </div>
        )
    }
    return (
        <div>
            <div className='text-center text-6xl'>
                <CircularProgress color="secondary" />
                <CircularProgress color="secondary" />
            </div>
        </div>
    )
}

export default Verified