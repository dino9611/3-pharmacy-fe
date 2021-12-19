import React, {useState} from "react";
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ErrorIcon from '@mui/icons-material/Error';
import axios from "axios";
import { API_URL } from "../../constants/api";
import qs from 'query-string'
import {toast} from 'react-toastify'
import { useNavigate } from "react-router";

const TypoNotif = styled(Typography)(({theme}) => ({
  color: '#FFC286'
}))
const ColorButton = styled(Button)(({ theme }) => ({
    borderRadius: 10,
    color: 'black',
    backgroundColor: '#FFC286',
    '&:hover': {
      backgroundColor: '#66806A',
      color: 'white'
    },
}));
const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: 'white',
    },
    '& label': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
});
const ChangePassword = () => {

  const [errors, setErrors] = useState([])
  const [mistakePassword, setmistakePassword] = useState(false)
  const [passwordError, setpasswordError] = useState("")
  const [showPassword, setshowPassword] = useState(false)
  const [changePass, setchangePass] = useState({
    password: "",
    retype: ""
  })
  
  //! Kumpulan Regex
  const regexChar = new RegExp("^(?=.{6,})")
  const regexCaps = new RegExp("^(?=.*[A-Z])")
  const regexLow = new  RegExp("^(?=.*[a-z])")
  const regexNumb = new RegExp("^(?=.*[0-9])")
  const regexSpace = new RegExp("^(?!.*?[\\s])")


  const navigate = useNavigate()
  const inputHandler = (e) => {
    setchangePass({...changePass, [e.target.name] : e.target.value})
  }
  const handleShowPassword = () => {
    setshowPassword(!showPassword)
  }
  const changeClick = (e) => {
    e.preventDefault()
    passwordChecker()
  } 

  const dataPassword = async() => {
    const {token} = qs.parse(window.location.search)
    console.log(token)
    let {password} = changePass
    let dataBody = {
      password
    }
    try {
      const res = await axios.patch(`${API_URL}/auth/change/password`, dataBody, {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
      console.log(res.data)
      toast.success("Change Password Successful", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      })
      navigate("/")
    } catch (error) {
      console.log(error.response.data.message || "error server")
      toast.error(error.response.data.message ||"Server Error", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      })
    }
  }
  const checkpass = (pass) => {
      let arr = [{func : regexChar, message : "6 Character Minimum"}, {func : regexCaps, message: "Password Must Have Uppercase"}, {func : regexLow, message: "Password Must Have Lowercase"}, {func : regexNumb, message: "Password Must Have Number"}, {func: regexSpace, message: "Password Cannot Have Spaces"}]
      for (let i = 0 ; i < arr.length ; i++){
          if (!arr[i].func.test(pass)){
              setmistakePassword(true)
              setpasswordError(arr[i].message)
              return arr[i].message
          }
      }
      return ""
  }

  const passwordChecker = () => {
    let {password, retype} = changePass
    let arr = [] 
    if (password && retype){
      if (checkpass(password)){
        arr[0] = checkpass(password)
        setmistakePassword(true)
      }
    }else {
      arr[0] = "Please Fill Password & Retype Password"
      setmistakePassword(true)
    }
    if(password !== retype){
      arr[0] = "Password Are Not the Same"
      setmistakePassword(true)
    }

    if(!arr.length){
      setmistakePassword(false)
      console.log(password)
      // alert("berhasil")
      dataPassword()
    }else {
      setErrors([...arr])
      console.log(errors)
    }
  }

  return (
      <div className="container change-cont h-screen bg-bCol flex justify-center items-center">
          <div className="neu-change p-5 w-2/5">
              <div className="text-center text-white tracking-wider text-xl font-medium ">Change Password</div>
              {/* <Divider sx={{color: 'white', borderColor: 'white'}}  >Change Pass</Divider> */}
              <div>
                  <div className='pt-3 text-white'>Password</div>
                  <CssTextField name="password" value={changePass.password} onChange={inputHandler} fullWidth id="outlined-basic" type={showPassword ? "text" : "password" } label="Password" variant="outlined" sx={{mt:1.5}} 
                    InputProps={{
                        endAdornment: 
                        <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword}>
                                {showPassword ? <VisibilityOff sx={{color:'white'}} /> : <Visibility sx={{color:'white'}} /> } 
                            </IconButton>
                        </InputAdornment>,
                    }}
                  />
                  <div className='pt-3 text-white'>Re-type Password</div>
                  <CssTextField name="retype" value={changePass.retype} onChange={inputHandler} fullWidth id="outlined-basic" type={showPassword ? "text" : "password" } label="Retype Password" variant="outlined" sx={{mt:1.5}} 
                    InputProps={{
                        endAdornment: 
                        <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword}>
                                {showPassword ? <VisibilityOff sx={{color:'white'}}/> : <Visibility sx={{color:'white'}}/> } 
                            </IconButton>
                        </InputAdornment>,
                    }}
                  />
                  {/* <TypoNotif display={mistakePassword ? "block" : "none"} sx={{color:'black'}} sx={{fontSize:12, mt:0.5, justifyContent:'center'}} ><ErrorIcon sx={{fontSize:'medium', mr:0.5}} />{passwordError}</TypoNotif> */}
                  <TypoNotif display={mistakePassword ? "block" : "none"} sx={{fontSize:12, mt:0.5, justifyContent:'center', color:'black'}} ><ErrorIcon sx={{fontSize:'medium', mr:0.5}} />
                    {errors[0]}
                  </TypoNotif>
                  <ColorButton onClick={changeClick} fullWidth variant="contained" sx={{mt:2}} size='large' >
                          Change My Password
                  </ColorButton>
              </div>
          </div>
      </div>
  )
}
export default ChangePassword