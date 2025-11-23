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
   
    <div className="flex min-h-screen bg-[#FFFDF9]">
    {/* SIDEBAR */}
    <aside className="h-screen w-64 bg-gradient-to-b 
      from-[#FFB7D5] via-[#FDE3D9] to-[#A7EFFF] 
      p-6 shadow-inner flex flex-col">

      {/* LOGO */}
      <h1 className="text-3xl font-bold text-[#2E2E2E] mb-14">
        NOTELY
      </h1>

      <nav className="flex-1 flex flex-col justify-between items-center py-20">
        <p className="cursor-pointer text-[#2E2E2E] text-xl font-bold tracking-wide">
          All Notes
        </p>
        <p className="cursor-pointer text-[#2E2E2E] text-xl font-bold tracking-wide">
          Pinned
        </p>
        <p className="cursor-pointer text-[#2E2E2E] text-xl font-bold tracking-wide">
          Archive
        </p>
        <p className="cursor-pointer text-[#2E2E2E] text-xl font-bold tracking-wide">
          Trash
        </p>
      </nav>
    </aside>

    {/* MAIN AREA */}
    <div className="flex-1">
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
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-semibold text-[#2E2E2E]">
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
            className="w-full grid gap-10 justify-center"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              maxWidth: "1400px",
              marginInline: "auto",
            }}
          >
            {notes.map((note) => (
              <div
                key={note._id}
                className="rounded-[14px] shadow-md p-5 h-40 bg-[#FFF1F5]"
                style={{ width: "260px" }}
              >
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <p className="text-sm mt-2 text-[#555] leading-5">{note.body}</p>

                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>


    {/* ADD NOTE MODAL */}
    {addNotes && (
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30" />

        <form
          onSubmit={handleAdd}
          className="relative z-50 w-full max-w-lg bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Add New Note</h3>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none"
          />
          <textarea
            placeholder="Content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none h-28"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAddNotes(false)}
              className="px-4 py-2 rounded-md border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#FF80AB] text-white"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    )}
  </div>
  )
}

export default Home



