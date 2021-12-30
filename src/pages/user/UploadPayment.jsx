import { Alert, Button } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import Header from '../../components/Header'
import { API_URL } from '../../constants/api'

const UploadPayment = () => {
    const { order_id } = useParams()

    const [checkout, setCheckout] = useState([])
    const [file, setFile] = useState(null)

    const hiddenFileInput = useRef(null)

    const handleClick = e => {
        hiddenFileInput.current.click()
    }

    const handleChange = e => {
        setFile(e.target.files[0])
    }

    const onUpload = async () => {
        if (!file) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No image uploaded',
                timer: 1500,
                timerProgressBar: true
            })
        }
        const formData = new FormData();
        formData.append('product', file);
        try {
            await axios.patch(`${API_URL}/transaction/paymentproof/${order_id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            Swal.fire({
                icon: 'success',
                title: 'Yay!',
                text: 'Upload image success',
                timer: 1500,
                timerProgressBar: true
            })
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    useEffect(() => {
        const getCheckout = async () => {
            try {
                let res = await axios.get(`${API_URL}/transaction/getcheckout/${order_id}`)
                setCheckout(res.data)
            } catch (error) {
                alert(error)
            }
        }
        getCheckout()
        setFile(file)
    }, [file])

    return (
        <div>
            <Header />
            <div className='text-center mt-16'>
                <div className='flex w-max mx-auto'>
                    <Alert icon={false} severity="success">{`${checkout[0]?.bank} - ${checkout[0]?.accountNumber}`}</Alert>
                </div>
                <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    style={{ display: "none" }}
                />
                {file ? (
                    <>
                        <img
                            className='object-contain h-64 w-96 cursor-pointer bg-gray-200 rounded-lg mx-auto my-5'
                            src={URL.createObjectURL(file)}
                            alt={file}
                            onClick={handleClick}
                        ></img>
                        <Link to='/history'>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#66806a', marginRight: 10 }}
                                onClick={onUpload}
                            >
                                Upload
                            </Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <div
                            className='h-64 w-96 bg-gray-200 hover:bg-gray-300 cursor-pointer border-dashed border-2 border-green-dark rounded-lg mx-auto my-5 flex items-center justify-center'
                            onClick={handleClick}
                        >
                            <p className='text-green-dark font-medium text-lg'>No image</p>
                        </div>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#66806a', marginRight: 10 }}
                            onClick={onUpload}
                        >
                            Upload
                        </Button>
                    </>
                )}

                <Link to="/products">
                    <Button
                        variant="text"
                        style={{ color: '#66806a', fontWeight: "bold" }}
                    >
                        Later
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default UploadPayment
