"use client"
import React from 'react'
import { FaRegLightbulb } from "react-icons/fa";

const DarkmodeToggle = () => {
    return (
        <div className="dark-mode-wrap">
            <input type="checkbox" className='dark-mode-toggler' id="dark-mode" onChange={() => { document.body.classList.toggle("dark-mode") }} />
            <label htmlFor="dark-mode" className='dark-mode-label'><FaRegLightbulb size={25} /></label>
        </div>
    )
}

export default DarkmodeToggle