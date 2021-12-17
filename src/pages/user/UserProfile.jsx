import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { API_URL } from "../../constants/api";
import axios from 'axios';
import {toast} from 'react-toastify'
import { useSelector } from 'react-redux';

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#FFF1AF',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#FFF1AF',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FFF1AF',
      },
      '&:hover fieldset': {
        borderColor: '#FFF1AF',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FFF1AF',
      },
    },
});
const CssFormControl = styled(FormControl)({
    '& label.Mui-focused': {
      color: '#FFF1AF',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#FFF1AF',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FFF1AF',
      },
      '&:hover fieldset': {
        borderColor: '#FFF1AF',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FFF1AF',
      },
    },
});
const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 56,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(30px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
}));
const ColorButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  color: 'black',
  backgroundColor: '#FFC286',
  '&:hover': {
    backgroundColor: '#66806A',
    color: 'white'
  },
}))
const Input = styled('input')({
  display: 'none',
});
const Userprofile = () => {
  const [date, setDate] = useState();
  const [user, setuser] = useState()
  const [file,setFile] = useState(null)
  const [editMode, seteditMode] = useState(false)
  const [editAccount, seteditAccount] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    gender: "",
  })
  const authState = useSelector(state => state.auth)
  // const id = authState.id
  const id = 32
    
  const fetchData = async() => {
    try {
      const res = await axios.get(`${API_URL}/profile/user/${id}`)
      setuser(res.data[0])
    } catch (error) {
      console.log(error)
    }
  }
    useEffect(() => {
      fetchData()
    },[])
    
    const inputHandler = (e) => {
      seteditAccount({...editAccount, [e.target.name] : e.target.value})
    }

    const handleSwitch = () => {
        seteditMode(!editMode)
        if (editMode){
          // dateChecker()
          saveHandler()
        }
    }
    
    const saveHandler = async() => {
      let formDate
      if (date){
        let month = date.getUTCMonth() + 1
        let day = date.getUTCDate()
        let year = date.getUTCFullYear()
        formDate = `${year}-${month}-${day}`
      }
      console.log(formDate)
      console.log(date)
      const {firstName,lastName,email,address,gender} = editAccount
      try {
        let res = await axios.patch(`${API_URL}/profile/edit/${id}`, {
          firstName,
          lastName,
          email,
          address,
          gender,
          birthdate: formDate
        })
        setuser(res.data[0])
        toast.success("Data Edited", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        })
      } catch (error) {
        console.log(error.response.data.message)
        toast.error(error.response.data.message ||"Server Error", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
        })
      }
    }

    const onFileChange = async(e) => {
      console.log(e.target.files)
      if(e.target.files[0]){
        // setFile(e.target.files[0])
        try {
          const formData = new FormData()
          formData.append('avatar', e.target.files[0])
          console.log(formData)
          let config = {
            headers: {
              "Content-Type" : "multipart/form-data"
            }
          }
          const res = await axios.patch(`${API_URL}/profile/editavatar/${id}`, formData, config)
          console.log(res.data)
          setuser(res.data[0])
          toast.success("Upload Success", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          })
        } catch (error) {
          console.log(error.response.data.message, "dari sini")
          toast.error(error.response.data.message ||"Server Error", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          })
        }
      }else {
        setFile(null)
      }
    }

    return (
        <div className="h-screen bg-dCol">
            <div className="top-prof bg-bCol h-52 flex items-center">
                <div className="pl-40">
                    <Avatar
                      alt="Aemy Sharp"
                      src={API_URL + user?.avatar}
                      sx={{ width: 140, height: 140 }}
                    />
                </div>
                <div className="pl-10">
                    <div className="text-4xl mb-1 tracking-wide text-cCol ">{user?.username ?  user?.username : "None"}</div>
                    <div className={editMode ? "flex" : "hidden"} >
                      <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={onFileChange} />
                        <ColorButton  variant="contained" component="span" size='small' sx={{mt:2, mr:3}}>
                          Upload
                        </ColorButton>
                      </label>
                      <ColorButton variant="contained" sx={{mt:2}} size='small' >
                              Remove
                      </ColorButton>
                    </div>
                </div>
            </div>
            <div className="text-right">
              <FormControlLabel control={<IOSSwitch sx={{ m: 1 }} />} checked={editMode} onChange={handleSwitch} label={editMode? "Save" : "Edit Mode"}/>
            </div>
            <div className="flex justify-evenly w-full">
                {editMode ? 
                (
                    <>
                        <div className="w-2/5 ">
                            <div>
                                <CssTextField defaultValue={user?.firstName} name="firstName"  onChange={inputHandler} fullWidth label="First Name" id="custom-css-outlined-input" />
                            </div>
                            <div className="mt-8">
                                <CssTextField name="address" defaultValue={user?.address} onChange={inputHandler} fullWidth multiline  label="Address" id="custom-css-outlined-input"  />
                            </div>
                            <div className="mt-8">
                              <CssFormControl  fullWidth >
                                <InputLabel id="demo-simple-select-standard-label" >Gender</InputLabel>
                                <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                name="gender"
                                defaultValue=""
                                onChange={inputHandler}
                                label="Gender"
                                >
                                  <MenuItem value={"male"}>Male</MenuItem>
                                  <MenuItem value={"female"}>Female</MenuItem>
                                  <MenuItem value={"others"}>Others</MenuItem>
                                </Select>
                              </CssFormControl>
                            </div>
                        </div>
                        <div className="w-2/5 ">
                            <div>
                                <CssTextField defaultValue={user?.lastName} name="lastName" onChange={inputHandler} fullWidth label="Last Name" id="custom-css-outlined-input" />
                            </div>
                            <div className="mt-8">
                                <CssTextField name="email" defaultValue={user?.email} onChange={inputHandler} fullWidth label="Email" id="custom-css-outlined-input"  />
                            </div>
                            <div className="mt-8">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Pick Date"
                                        // views={['year', 'month', 'day']}
                                        // inputFormat="MM/dd/yyyy"
                                        // type="date"
                                        value={date}
                                        onChange={(newValue) => {
                                        setDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-2/5 ">
                            <div>
                                <div className="text-3xl font-light tracking-wide">First Name</div>
                                <div className="text-2xl break-words font-medium pl-5">{user?.firstName}</div>
                            </div>
                            <div className="pt-5">
                                <div className="text-3xl font-light tracking-wide">Address</div>
                                <div className="text-xl break-words font-medium pl-5">{user?.address ?  user?.address : "None"}</div>
                            </div>
                            <div className="pt-5">
                                <div className="text-3xl font-light tracking-wide">Gender</div>
                                <div className="text-2xl font-medium pl-5">{user?.gender ?  user?.gender : "None"}</div>
                            </div>
                        </div>
                        <div className="w-2/5 ">
                            <div>
                                <div className="text-3xl font-light tracking-wide">Last Name</div>
                                <div className="text-2xl break-words font-medium pl-5">{user?.lastName}</div>
                            </div>
                            <div className="pt-5">
                                <div className="text-3xl font-light tracking-wide">Email</div>
                                <div className="text-2xl font-medium pl-5">{user?.email}</div>
                            </div>
                            <div className="pt-5">
                                <div className="text-3xl font-light tracking-wide">Birth Date</div>
                                <div className="text-2xl font-medium pl-5">{user?.birthdate ?  user?.birthdate : "None"}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Userprofile