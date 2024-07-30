"use client"
import React, { useEffect } from 'react'
import { FaRegLightbulb } from "react-icons/fa";

const DarkmodeToggle = () => {
    let handleChange = () => {
        document.body.classList.toggle("dark-mode")
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('dark-mode', 'true')
        } else {
            localStorage.setItem('dark-mode', 'false')
        }
    }
    useEffect(() => {
        if (localStorage.getItem('dark-mode') !== 'true') {
            document.body.classList.add('dark-mode')
        } else {
            document.body.classList.remove('dark-mode')
        }
    }, [])
    return (
        <div className="dark-mode-wrap">
            <input type="checkbox" className='dark-mode-toggler' id="dark-mode" onChange={handleChange} />
            <label htmlFor="dark-mode" className='dark-mode-label'><FaRegLightbulb size={25} /></label>
        </div>
    )
}

export default DarkmodeToggle