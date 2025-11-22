import React from 'react'
import Signup from './Signup.jsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const navigate=useNavigate();
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[error,setError]=useState('');

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      const response=await axios.post('http://localhost:5001/login',{email,password});
      console.log(response);
      navigate('/');
      localStorage.setItem('token',response.data.token)


    }catch(e){
      if(e.response && e.response.data){
        setError(e.response.data);
      }
      else{
        setError("Something went wrong")
      }

    }
  }
  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-4 rounded w-25">
        <h2 className='text-center'>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email'>
              <strong>Email</strong>
            </label>
            <input className="form-control" 
            type="text" 
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
           >
            </input>

          </div>

            <div className='mb-3'>
            <label htmlFor='password'>
              <strong>Password</strong>
            </label>
            <input className="form-control" 
            type="text" 
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
           >
            </input>

          </div>
          <div className='text-center'>
            <button type="submit"  className="btn btn-secondary  ">Login</button>
          </div>
          {error && (
            <div className='btn btn-warning'>{error}</div>
          )}
          

        </form>
        <p className='text-center mt-3 mb-2'>New here? Consider signing up first!</p>
        <div className='text-center'>
            <Link to='/register' type="button" className="btn btn-info">Signup</Link>

        </div>


      </div>
    </div>
  )
}

export default Login