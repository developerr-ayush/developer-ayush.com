import React from 'react'
import Card from './Card'
import RedirectAnchor from '../RedirectAnchor'
import { FaTwitter, FaYoutube, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";


const CardShare = () => {
    return (
        <Card className="card-share col-2">
            <Card className="card-social">
                <a href="https://instagram.com" target="_blank" className="social-link social-link-instagram"><FaInstagram size={25} /></a>
                <a href="https://youtube.com" target="_blank" className="social-link social-link-youtube"><FaYoutube size={25} /></a>
                <a href="https://linkedin.com" target="_blank" className="social-link social-link-linkedin"><FaLinkedin size={25} /></a>
                <a href="https://github.com" target="_blank" className="social-link  social-link-github"><FaGithub size={25} /></a>
            </Card>
            <div className="card-content">
                <p className="card-sub-title"> STAY WITH ME</p>
                <h3 className="card-title">Profiles</h3>
            </div>
            <RedirectAnchor href="/" />
        </Card>
    )
}

export default CardShare