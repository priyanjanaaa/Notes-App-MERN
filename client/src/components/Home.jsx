import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'

const Home = () => {
  const[search,setSearch]=useState('');
  const[notes,setNotes]=useState([]);
  const[addNotes,setAddNotes]=useState(false);
  const[title,setTitle]=useState('');
  const[body,setBody]=useState('');
  const[error,setError]=useState('');

  
    const loadData=async()=>{
      try{
        const response=await axios.get('http://localhost:5001/notes',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
    })
    setNotes(response.data);

      }catch(e){
        if(e.response && e.response.data){
          setError(e.response.data);
        }
        else{
          setError("Something went wrong.")
        }
      }

    
    }
    useEffect(()=>{
      loadData();
    },[])
    
  

  const handleAdd=async(e)=>{
    e.preventDefault();
    try{
      const response=await axios.post('http://localhost:5001/notes',{
        title,
        body},{
          headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }

        }
      
      );
      console.log(response);
      const newNote=response.data;
      setNotes([...notes,newNote]);
      setAddNotes(false);
      setTitle('');
      setBody('');

    }catch(e){
      if(e.response && e.response.data){
        setError(e.response.data);
      }
      else{
        setError("Something went wrong.")
      }

    }
  }

  const handleDelete=async(noteId)=>{
    try{
      const response=await axios.delete(`http://localhost:5001/notes/${noteId}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotes(notes.filter(n=>n._id!==noteId));

    }catch(e){
      if(e.response && e.response.data){
        setError(e.response.data);
      }
      else{
        setError("Something went wrong");
      }

    }
  }

  const debounce=(fn,delay)=>{
    let timer;
    return(...args)=>{
      clearTimeout(timer);
      timer=setTimeout(()=>fn(...args),delay);

    }
  }

  const handleSearch=async(query)=>{
    
    try{
      if(!query){
        loadData();
        return;
      }
      const response=await axios.get(`http://localhost:5001/notes/search?q=${query}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotes(response.data);

    }catch(e){
      if(e.response && e.response.data){
        setError(e.response.data);
      }
      else{
        setError("Something went wrong");
      }

    }
  }

  const debouncedSearch=debounce(handleSearch,500);


 
  return (
    <div>
    {/*Sidebar*/}
      <aside>
        <h1>NOTELY</h1>
         <ul>
          <li>All Notes</li>
          <li>Pinned</li>
          <li>Archive</li>
          <li>Trash</li>
        </ul>
      </aside>
    {/*Topbar*/}
      <header>
        <input type='text' placeholder='Search Notes...' value={search} onChange={(e)=>{setSearch(e.target.value);debouncedSearch(e.target.value)}}></input>
        
      </header>
    {/*Main*/}
    <div>
      <div>
        <h3>My Notes</h3>
        <button type='submit' onClick={()=>setAddNotes(true)}>+New Notes</button>
      </div>
      {notes.map((note)=>(
        <div key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.body}</p>
          <button onClick={()=>handleDelete(note._id)}>Delete</button>
        </div>

      ))}
    </div>
    {addNotes && (
      <form onSubmit={handleAdd}>
        <input
        type='text'
        placeholder='Enter the title of the note'
        value={title}
        onChange={(e)=>setTitle(e.target.value)}>
        </input>

        <textarea
        placeholder='Enter the body of the title'
        value={body}
        onChange={(e)=>setBody(e.target.value)}>
        </textarea>

        <button type='submit'>Add</button>
        <button type='button' onClick={()=>setAddNotes(false)}>Delete</button>
        {error && (
          <p>{error}</p>
        )}
    

      </form>

    )}
  </div>
    
  )
}

export default Home