import React, { useEffect, useState } from "react";

const pastelCards = [
  "bg-[#FFF1F5]", // rose
  "bg-[#F1F5FF]", // blue
  "bg-[#FDF8C9]", // yellow
  "bg-[#E9FDF3]", // mint
];




  return (
    <div className="flex min-h-screen bg-[#FFFDF9]">

     {/* SIDEBAR */}
     <aside className="h-screen w-60 bg-gradient-to-b 
  from-[#FFB7D5] via-[#FDE3D9] to-[#A7EFFF] 
  p-6 shadow-inner flex flex-col">

  {/* LOGO */}
  <h1 className="text-3xl font-semibold text-[#2E2E2E] mb-14">
    NOTELY
  </h1>

  {/* PERFECT Figma-style spacing */}
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
        {/* TOP BAR — NOW WIDER & BALANCED */}
        <header className="h-[100px] bg-[#FDF8F8] shadow-sm flex items-center justify-between px-14">
          <div className="flex-1 flex justify-center">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-[500px] py-3 rounded-full border border-[#EDE9E9] px-4 text-[#7C7C7C] text-lg shadow-sm bg-white focus:outline-none"
            />
          </div>

          <div className="w-10 h-10 rounded-full bg-[#FFDDE8] border border-[#FBCEDF] shadow-sm" />
        </header>

        {/* CONTENT */}
        <main className="px-12 py-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col">
                <h2 className="text-3xl font-semibold text-[#2E2E2E]">
                  My Notes
                </h2>
              </div>

              {/* Button now right beside My Notes */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FF80AB] text-white px-6 py-2 rounded-full shadow hover:bg-[#ff6fa1] transition font-medium"
              >
                + New Note
              </button>
            </div>

            {/* PERFECT RESPONSIVE GRID */}
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
                  key={note.id}
                  className={`rounded-[14px] shadow-md p-5 h-40 ${pastelCards[note.colorIndex]}`}
                  style={{
                    width: "260px",
                  }}
                >
                  <h3 className="text-lg font-semibold">{note.title}</h3>
                  <p className="text-sm mt-2 text-[#555] leading-5">
                    {note.content}
                  </p>

                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => deleteNote(note.id)}
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsModalOpen(false)}
          />
          <form
            onSubmit={addNote}
            className="relative z-50 w-full max-w-lg bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Add New Note</h3>

            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Title"
              className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none"
            />

            <textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Content"
              className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none h-28"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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
  );


export default Home;
