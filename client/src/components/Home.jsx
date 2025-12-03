import React from 'react'
import { useState,useEffect, } from 'react'
import axios from 'axios'
import {Link,useNavigate} from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../context/ThemeContext'


const pastelCards = [
  "bg-[#FFF1F5]", // rose
  "bg-[#F1F5FF]", // blue
  "bg-[#FDF8C9]", // yellow
  "bg-[#E9FDF3]", // mint
];

const Home = () => {
  const {theme,toggleTheme}=useTheme();
  const navigate=useNavigate();
  const[search,setSearch]=useState('');
  const[notes,setNotes]=useState([]);
  const[addNotes,setAddNotes]=useState(false);
  const[title,setTitle]=useState('');
  const[body,setBody]=useState('');
  const[error,setError]=useState('');
  const[isEditing,setIsEditing]=useState(false);
  const[editNoteId,setEditNoteId]=useState(null);
  const[editTitle,setEditTitle]=useState('');
  const[editBody,setEditBody]=useState('');
  
    const loadData=async()=>{
      try{
        const response=await axios.get('http://localhost:5001/notes',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
    })
    const sorted=response.data.filter((n)=>!n.isDeleted)
    .filter((n)=>!n.isArchived)
    .sort((a,b)=>b.isPinned-a.isPinned)
    setNotes(sorted);

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
        const response=await axios.patch(`http://localhost:5001/notes/delete/${noteId}`,{},{
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        });
        setNotes(notes.filter(n=>n._id!==noteId));

      }catch(e){
        if(e.response && e.response.data){
          setError(e.response.data);
        }else{
          setError("Something went wrong");
        }

      }
    }
    

 

  const debounce=(fn,delay)=>{
    let timer;
    return (...args)=>{
      clearTimeout(timer);
      timer=setTimeout(()=>fn(...args),delay);
    }
  }

  const handleSearch=async(query)=>{
    if(!query){
      loadData();
      return;
    }
    try{
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

  const handlePin=async(noteId)=>{
    try{
      const response=await axios.patch(`http://localhost:5001/notes/pin/${noteId}`,{},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      loadData();

    }catch(e){
      if(e.response && e.response.data){
        setError(e.response.data);
      }
      else{
        setError("Something went wrong");
      }

    }
  }

    const handleUnpin=async(noteId)=>{
    try{
      const response=await axios.patch(`http://localhost:5001/notes/unpin/${noteId}`,{},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      loadData();

    }catch(e){
      if(e.response && e.response.data){
        setError(e.response.data);
      }
      else{
        setError("Something went wrong");
      }

    }
  }

  const handleArchive=async(noteId)=>{
    try{
      const response=await axios.patch(`http://localhost:5001/notes/archive/${noteId}`,{},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      });
      loadData();


    }catch(e){
      if(e.response && e.response.data){
        setError(e.response.data);

      }
      else{
        setError("Something went wrong");
      }

    }
  }

  const openModel=(note)=>{
    setIsEditing(true);
    setEditNoteId(note._id);
    setEditTitle(note.title);
    setEditBody(note.body);

  }

  const handleEditSubmit=async(e)=>{
    e.preventDefault();
    try{
      const response=await axios.patch(`http://localhost:5001/notes/update/${editNoteId}`,{
        title:editTitle,
        body:editBody
      },{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      });
      const updated=response.data;

      setNotes((prev)=>
      prev.map((n)=>(n._id===editNoteId)?updated:n));
      setIsEditing(false);
      setEditNoteId(null);
      setEditTitle('');
      setEditBody('');

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
  <div
    className={`flex min-h-screen transition duration-300 ${
      theme === "⚫️"
        ? "bg-[#1f1f1f] text-white"
        : "bg-[#fafafa] text-black"
    }`}
  >
    {/* SIDEBAR */}
    <aside
      className="
        h-screen w-64 p-6 shadow-inner flex flex-col 
        bg-gradient-to-b from-[#FFB7D5] via-[#FDE3D9] to-[#A7EFFF]
        text-[#2E2E2E]
      "
    >
      <h1 className="text-3xl font-bold mb-14">NOTELY</h1>

      <nav className="flex-1 flex flex-col justify-between items-center py-20">
        <p className="cursor-pointer text-l font-bold tracking-wide">
          All Notes
        </p>
        <Link to="/pinned" className="cursor-pointer text-l font-bold">
          Pinned
        </Link>
        <Link to="/archived" className="cursor-pointer text-l font-bold">
          Archive
        </Link>
        <Link to="/trash" className="cursor-pointer text-l font-bold">
          Trash
        </Link>
      </nav>
    </aside>

    {/* MAIN AREA */}
    <div className="flex-1 flex flex-col">
      
      {/* TOP BAR */}
      <header
        className={`h-[100px] shadow-sm flex items-center justify-center px-14`}
      >
        <div className="flex items-center gap-10 w-[700px] justify-center">
          
          {/* SEARCH BAR */}
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className={`
              w-[500px] py-3 rounded-full border px-4 text-lg shadow-sm transition duration-300
              ${
                theme === "⚫️"
                  ? "bg-[#3a3a3a] border-[#555] text-white placeholder-gray-400"
                  : "bg-white border-[#EDE9E9] text-[#7C7C7C]"
              }
            `}
          />

          <ThemeToggle />
        </div>
      </header>

      {/* CONTENT */}
      <main className="px-12 py-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER ROW */}
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-semibold">
              My Notes
            </h2>

            <button
              onClick={() => setAddNotes(true)}
              className="bg-[#FF80AB] text-white px-6 py-2 rounded-full shadow hover:bg-[#ff6fa1] transition font-medium"
            >
              + New Note
            </button>
          </div>

          {/* NOTES GRID */}
          <div
            className="w-full grid gap-y-20 gap-x-10 justify-center mt-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              maxWidth: "1400px",
              marginInline: "auto",
            }}
          >
            {notes.map((note, i) => (
              <div
                key={note._id}
                className={`rounded-[14px] shadow-md p-5 flex flex-col transition duration-300 
                  ${pastelCards[i % pastelCards.length]}
                `}
              >
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  <h3 className="text-lg font-semibold">
                    {note.title}
                  </h3>

                  <p className="text-sm mt-2 leading-5 text-[#555]">
                    {note.body}
                  </p>

                  <button
                    onClick={() => openModel(note)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Update
                  </button>
                </div>

                <div className="flex justify-end mt-2 gap-x-4">
                  {note.isPinned ? (
                    <button
                      onClick={() => handleUnpin(note._id)}
                      className="text-blue-600"
                    >
                      Unpin
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePin(note._id)}
                      className="text-blue-600"
                    >
                      Pin
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleArchive(note._id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-500 font-medium">
              {error}
            </p>
          )}
        </div>
      </main>
    </div>
  </div>
);

}

export default Home