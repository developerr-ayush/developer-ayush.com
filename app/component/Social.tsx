import React from 'react'
import { FaTwitter, FaYoutube, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

const Social = () => {
    return (
        <>
            <a href="https://instagram.com" target="_blank" className="social-link social-link-instagram"><FaInstagram size={25} /></a>
            <a href="https://youtube.com" target="_blank" className="social-link social-link-youtube"><FaYoutube size={25} /></a>
            <a href="https://linkedin.com" target="_blank" className="social-link social-link-linkedin"><FaLinkedin size={25} /></a>
            <a href="https://github.com" target="_blank" className="social-link  social-link-github"><FaGithub size={25} /></a>
        </>
    )
}

export default Social