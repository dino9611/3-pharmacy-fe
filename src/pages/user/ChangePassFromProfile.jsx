import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ForgetPass from '../../components/ForgetPassword';
import { API_URL } from '../../constants/api';

const ChangePassFromProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const authState = useSelector(state => state.auth)

    const [password, setPassword] = useState({
        currentpass: '',
        newpass: '',
        confirmpass: ''
    })
    const inputHandler = e => {
        setPassword({ ...password, [e.target.name]: e.target.value })
    }

    const [type, setType] = useState('password')
    const checkHandler = e => {
        if (e.target.checked) {
            setType('text')
        } else {
            setType('password')
        }
    }

    const [openDialog, setopenDialog] = useState(false);
    const handleopenDialog = () => setopenDialog(true)
    const handlecloseDialog = () => setopenDialog(false);

    const [alertPass, setAlertPass] = useState({
        isHidden: true,
        isDisabled: false
    })

    const onConfirm = async () => {
        const { currentpass, newpass, confirmpass } = password
        if (!currentpass || !newpass || !confirmpass) {
            Swal.fire({
                icon: 'error',
                title: 'Oops..',
                text: 'Fill all fields!',
                timer: 1500,
                timerProgressBar: true,
                confirmButtonColor: '#22577a'
            })
            return
        }
        setAlertPass({ ...password, isDisabled: true, isHidden: true })
        try {
            let res = await axios.patch(`${API_URL}/auth/changeprofilepass/${authState.id}`, {
                currentPass: currentpass,
                newPass: newpass,
                confirmNewPass: confirmpass
            })
            dispatch({ type: 'login', payload: res.data[0] })
            navigate('/user_profile')
            Swal.fire({
                icon: 'success',
                title: 'Yay!',
                text: 'Changing password success',
                timer: 1500,
                timerProgressBar: true,
                confirmButtonColor: '#22577a'
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops..',
                text: error.response.data?.message,
                timer: 1500,
                timerProgressBar: true,
                confirmButtonColor: '#22577a'
            })
            setAlertPass({ ...password, isDisabled: false, isHidden: true })
        } finally {
            setAlertPass({ ...password, isDisabled: false, isHidden: true })
        }
    }

    useEffect(() => {
        setPassword(password)

        const pwChecker = new RegExp('^(?=.{6,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*?[\\s])')
        if (!pwChecker.test(password.newpass)) {
            setAlertPass({ ...alertPass, isHidden: false, isDisabled: true })
        } else {
            setAlertPass({ ...alertPass, isHidden: true, isDisabled: false })
        }

    }, [password])

    return (
        <>
            <ForgetPass
                setopenDialog={setopenDialog}
                openDialog={openDialog}
                handlecloseDialog={handlecloseDialog}
                handleopenDialog={handleopenDialog}
            />
            <div className='min-h-screen flex flex-col justify-center phone:justify-start items-center font-poppins'>
                <div className='bg-white phone:bg-lightblue w-2/5 phone:w-full shadow-md phone:shadow-none rounded-md p-5 cursor-pointer'>
                    <div className='flex items-center mb-4' onClick={() => navigate('/user_profile')}>
                        <svg className="w-6 h-6 mr-2 text-primary1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                        </svg>
                        <p className='font-bold text-primary1'>Back to Profile</p>
                    </div>
                    <div className='mb-4'>
                        <p
                            className='text-center text-xl font-bold mb-6'
                        >
                            Change Password
                        </p>
                        <div className='text-sm mb-2'>
                            <label htmlFor="currentpass" className='text-primary1 font-bold text-sm'>Current Password</label>
                            <input
                                type={type} id='currentpass' name='currentpass'
                                className='focus:outline-none bg-gray-200 phone:bg-white w-full px-3 py-2 rounded-md'
                                onChange={inputHandler}
                            />
                        </div>
                        <div className='text-sm mb-2'>
                            <label htmlFor="newpass" className='text-primary1 font-bold text-sm'>New Password</label>
                            <input
                                type={type} id='newpass' name='newpass'
                                className='focus:outline-none bg-gray-200 phone:bg-white w-full px-3 py-2 rounded-md'
                                onChange={inputHandler}
                            />
                            <p
                                className='text-red-500'
                                hidden={alertPass.isHidden}
                            >
                                * Password must have 6 characters; at least one uppercase, one lowercase, one number; and can't include space
                            </p>
                        </div>
                        <div className='text-sm mb-2'>
                            <label htmlFor="confirmnewpass" className='text-primary1 font-bold text-sm'>Confirm New Password</label>
                            <input
                                type={type} id='confirmnewpass' name='confirmpass'
                                className='focus:outline-none bg-gray-200 phone:bg-white w-full px-3 py-2 rounded-md'
                                onChange={inputHandler}
                            />
                        </div>
                        <div className='flex justify-between'>
                            <div className='flex items-center'>
                                <input
                                    type="checkbox" id='showpass'
                                    className='mr-1'
                                    onChange={checkHandler}
                                />
                                <label htmlFor="showpass" className='text-sm'>Show Password</label>
                            </div>
                            <button
                                className='text-sm text-primary1 hover:opacity-70'
                                onClick={handleopenDialog}
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>
                    <div
                        className='text-center'
                    >
                        <button
                            disabled={alertPass.isDisabled}
                            className={'px-3 py-2 bg-primary1 text-white rounded-md' +
                                (alertPass.isDisabled
                                    ? ' bg-opacity-70 cursor-default'
                                    : ' hover:bg-opacity-70')
                            }
                            onClick={onConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default ChangePassFromProfile;
