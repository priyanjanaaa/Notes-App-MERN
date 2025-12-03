import React from 'react'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
    const{theme,toggleTheme}=useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
    >
      {theme === "🔆" ? "⚫️" : "🔆"}
    </button>
  )
}

export default ThemeToggle;