import React from 'react'
import { Children } from 'react';
import { createContext,useContext,useEffect,useState } from 'react'

const ThemeContext=createContext();

export const ThemeProvider = ({children}) => {
    const[theme,setTheme]=useState('🔆');

    useEffect(()=>{
        const saved=localStorage.getItem("theme");
        if(saved){
            setTheme(saved);
        }
    },[]);

    useEffect(()=>{
        localStorage.setItem("theme",theme);
        if(theme==='⚫️'){
             document.documentElement.classList.add("dark");
             document.documentElement.classList.remove("light");
        }else{
            document.documentElement.classList.add("light");
            document.documentElement.classList.remove("dark");
        }
    },[theme]);

    const toggleTheme=()=>{
        setTheme(prev=>(prev==='🔆'?'⚫️':'🔆'))

    }
  return (
    <ThemeContext.Provider value={{theme,toggleTheme}}>
        {children}
    </ThemeContext.Provider>
  )

}
export const useTheme=()=>useContext(ThemeContext);


