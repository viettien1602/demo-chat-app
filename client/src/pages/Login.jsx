import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {Link, useNavigate} from 'react-router-dom'
import Logo from '../assets/logo.svg'
import {ToastContainer, toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import {loginUrl} from '../utils/APIRoutes'


function Login() {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        username: '',
        password: ''
    })
    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }
    useEffect(() => {
        if(localStorage.getItem('user')) {
            navigate('/')
        }
    }, [])
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (handleValidation()) {
            const { username, password } = values
            const data = {
                username,
                password
            }
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())

            if (!response.status) {
                toast.error(response.msg, toastOptions)
            }
            else if (response.status) {
                localStorage.setItem('user', JSON.stringify(response.user))
                if (!response.user.isAvatarImageSet) navigate('/setAvatar')
                else {navigate('/');}
            }
            
        }
    }
    const handleValidation = () => {
        const {password, username} = values
        let valid = true
        if (!username || !password) {
            toast.error('Username and password required', toastOptions)
            valid = false
        } 
        return valid
    }
    const handleChange = (event) => {
        setValues({...values, [event.target.name]:event.target.value});
    }

    return (
        <>
            <FormContainer>
                <form onSubmit = {(event) => handleSubmit(event)}>
                    <div className='brand'> 
                        <img src={Logo} alt='Logo' />
                        <h1>snappy</h1>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        name="username" 
                        onChange={e => handleChange(e)}
                        min="3">
                    
                    </input>
                    
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        onChange={e => handleChange(e)}>
                    
                    </input>
                    
                    <button type="submit">Login</button>
                    <span>
                    Don't have an account ? <Link to="/register">Register</Link>
                    </span>
                </form>
            </FormContainer>
            <ToastContainer>

            </ToastContainer>
        </>
        
    )
}

const FormContainer = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #131324;
.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  img {
    height: 5rem;
  }
  h1 {
    color: white;
    text-transform: uppercase;
  }
}
form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: #00000076;
  border-radius: 2rem;
  padding: 5rem;
}
input {
  background-color: transparent;
  padding: 1rem;
  border: 0.1rem solid #4e0eff;
  border-radius: 0.4rem;
  color: white;
  width: 100%;
  font-size: 1rem;
  &:focus {
    border: 0.1rem solid #997af0;
    outline: none;
  }
}
button {
  background-color: #4e0eff;
  color: white;
  padding: 1rem 2rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;
  &:hover {
    background-color: #4e0eff;
  }
}
span {
  color: white;
  text-transform: uppercase;
  a {
    color: #4e0eff;
    text-decoration: none;
    font-weight: bold;
  }
}
`;

export default Login

