import React from 'react'
import Card from './Card'
import { FaHtml5, FaCss3, FaReact, FaNodeJs, FaGitAlt, FaSass, FaTwitter, FaYoutube, FaLinkedin, FaGithub } from "react-icons/fa";
import { SiMongodb, SiExpress, SiTailwindcss } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { TbBrandNextjs, TbBrandTypescript } from "react-icons/tb";
import RedirectAnchor from '../RedirectAnchor';

const CardService = () => {
    return (
        <Card className="card-service col-2">
            <div className="card-icons">
                <FaHtml5 size={35} />
                <FaCss3 size={35} />
                <IoLogoJavascript size={35} />
                <TbBrandNextjs size={35} />
                <FaReact size={35} />
                <SiMongodb size={35} />
                <SiExpress size={35} />
                <FaNodeJs size={35} />
                <FaGitAlt size={35} />
                <FaSass size={35} />
                <SiTailwindcss size={35} />
                <TbBrandTypescript size={35} />
            </div>
            <div className="card-content">
                <p className="card-sub-title">Specilization</p>
                <h3 className="card-title">Service Offering</h3>
            </div>
            <RedirectAnchor href="/" />
        </Card>
    )
}

export default CardService