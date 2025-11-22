import React from 'react'
import { useState,useEffect } from 'react';
import axios from'axios'



const Home = () => {
  const[search,setSearch]=useState('');
  const[error,setError]=useState('');
  const[notes,setNotes]=useState([]);
  const[addNotes,setAddNotes]=useState(false);
  const[title,setTitle]=useState('');
  const[body,setBody]=useState('');

  useEffect(()=>{
    const loadData=async()=>{
      try{
          const response=await axios.get('http://localhost:5001/notes',{
            headers:{
              Authorization:`Bearer ${localStorage.getItem('token')}`
            }
          });
          setNotes(response.data);

      }catch(e){
        console.log(e);
      }


    }
    loadData();
  },[])

  const handleAdd=async(e)=>{
    e.preventDefault();
    try{
      const response=await axios.post('http://localhost:5001/notes',{title,body},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response);
      const newNote=response.data;
      setNotes([...notes,newNote]);
      setTitle('');
      setBody('');
      setAddNotes(false);


    }catch(e){
      if(e.response && e.response.data){
        setError(e.response.data);
      }

    }

  }
  
  const filteredNotes=notes.filter((note)=>
    note.title.toLowerCase().includes(search.toLowerCase())||
    note.body.toLowerCase().includes(search.toLowerCase())
)
  return (
   
    <div>
      {/* sidebar*/}
      <div>
        <nav>
          <h1>NOTELY</h1>
          <ul>
            <li>All Notes</li>
            <li>Pinned</li>
            <li>Archive</li>
            <li>Trash</li>
          </ul>
        </nav>
      </div>

      {/*Topbar*/}
      <div>
        
          <input type="text" placeholder='Search notes...' onChange={(e)=>setSearch(e.target.value)}></input>
          
      </div>
      {/*Main section */}
      <div>
        <div>
          <h3>My notes</h3>
          <button type='submit'onClick={()=>setAddNotes(true)}>+New Note</button>
        </div>
         <div>
      {filteredNotes.map((note)=>(
        <div key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.body}</p>
        </div>

      ))}
    </div>
      </div>
      {addNotes && (
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Enter the content here"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <button type="submit">Add</button>
          <button type="button" onClick={() => setAddNotes(false)}>Cancel</button>
        </form>
      )}

      {error && <p>{error}</p>}
         
    


    </div>
  )
}

export default Home


