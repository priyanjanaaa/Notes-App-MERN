import React from 'react'
import { useState,useEffect } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios'

const pastelCards = [
  "bg-[#FFF1F5]", // rose
  "bg-[#F1F5FF]", // blue
  "bg-[#FDF8C9]", // yellow
  "bg-[#E9FDF3]", // mint
];

const Trash = () => {
    const[error,setError]=useState('');
    const[search,setSearch]=useState('');
    const[notes,setNotes]=useState([]);

    const loadData=async()=>{
        try{
            const response=await axios.get(`http://localhost:5001/notes/delete`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            setNotes(response.data.filter((n)=>n.isDeleted));

        }catch(e){
            if(e.response && e.response.data){
                setError(e.response.data);
            }
            else{
                setError("Something went wrong");
            }

        }
    }

    useEffect(()=>{
        loadData();
    },[]);

    const debounce=(fn,delay)=>{
        let timer;
        return(...args)=>{
            clearTimeout(timer);
            timer=setTimeout(()=>fn(...args),delay);
        }
    }

    const handleSearch=async(query)=>{
        try{
            const response=await axios.get(`http://localhost:5001/notes/search?q=${query}&isDeleted=true`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            setNotes(response.data);

        }catch(e){
            if(e.response && e.response.data){
                setError(e.response.data);
            }
            else{
                setError("Something went wrong while fetching deleted search");
            }

        }
    }

    const debouncedSearch=debounce(handleSearch,500);

    const handleRestore=async(noteId)=>{
        try{
            const response=await axios.patch(`http://localhost:5001/notes/restore/${noteId}`,{},{
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
                setError("Something went wrong with restoring");
            }

        }
    }

    
  return (
    <div className="flex min-h-screen bg-[#FFFDF9]">
      {/* SIDEBAR */}
      <aside
        className="
          h-screen w-64 bg-gradient-to-b
          from-[#FFB7D5] via-[#FDE3D9] to-[#A7EFFF]
          p-6 shadow-inner flex flex-col
        "
      >
        <h1 className="text-3xl font-bold text-[#2E2E2E] mb-14">NOTELY</h1>
        
        
        <nav className="flex-1 flex flex-col justify-between items-center py-20">
          <Link to='/home' className="cursor-pointer text-l font-bold tracking-wide text-[#2E2E2E]">
            All Notes
          </Link>
          <Link to="/pinned" className="cursor-pointer text-[#2E2E2E] text-l font-bold tracking-wide" >
            Pinned
          </Link>
          <Link to='/archived' className="cursor-pointer text-[#2E2E2E] text-l font-bold tracking-wide">
            Archive
          </Link>
          <p className="cursor-pointer text-[#2E2E2E] text-l font-bold tracking-wide">
            Trash
          </p>
          
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-[100px] bg-[#FDF8F8] shadow-sm flex items-center justify-center px-14">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="w-[500px] py-3 rounded-full border border-[#EDE9E9] px-4 text-[#7C7C7C] text-lg shadow-sm bg-white focus:outline-none"
          />
        </header>

        {/* CONTENT */}
        <main className="px-12 py-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header row */}
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-semibold text-[#2E2E2E]">
                My Trash
              </h2>
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
                  className={`rounded-[14px] shadow-md p-5 flex flex-col ${pastelCards[i % pastelCards.length]} 
                  w-[260px] h-[240px] mt-6`}   
                >
                  <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    <h3 className="text-lg font-semibold">{note.title}</h3>
                    <p className="text-sm mt-2 text-[#555] leading-5">
                      {note.body}
                    </p>
                  </div>

                  <div className="flex justify-end mt-2 gap-x-4">
                    <button
                    onClick={() => handleRestore(note._id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Restore
                  </button>
                </div>
                </div>
              ))}
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-500 font-medium">{error}</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Trash