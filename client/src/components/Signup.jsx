import React from 'react'
import Login from './Login.jsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Signup = () => {
  const navigate=useNavigate();
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[error,setError]=useState("");

  const handleSubmit =async(e)=>{
    e.preventDefault();
    try{
      const response=await axios.post('http://localhost:5001/register',{name,email,password});
      console.log(response);
      navigate('/login');
    }catch(e){
      if(e.response && e.response.data){
        setError(e.response.data);
        
      }
      else{
        setError("Something went wrong");
      }

    }
  }
  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-4 rounded w-25">
        <h2 className='text-center'>Signup</h2>

        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='name'>
              <strong>Name</strong>
            </label>
            <input className="form-control" 
            type="text" 
            placeholder="Enter your name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            >
            </input>

          </div>

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
            <button type="submit"  className="btn btn-secondary  ">Signup</button>
          </div>
          {error &&(
            <div  className="btn btn-warning">{error}</div>
          )}
          

        </form>
        <p className='text-center mt-3 mb-2'>Already have an account?</p>
        <div className='text-center'>
              <Link to='/login' type="button" className="btn btn-info">Login</Link>
        </div>


      </div>
    </div>
  )
}

export default Signup