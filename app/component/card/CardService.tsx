import React from 'react'
import Card from './Card'
import { FaHtml5, FaCss3, FaReact, FaNodeJs, FaGitAlt, FaSass, FaTwitter, FaYoutube, FaLinkedin, FaGithub } from "react-icons/fa";
import { SiMongodb, SiExpress, SiTailwindcss } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { TbBrandNextjs, TbBrandTypescript } from "react-icons/tb";
import RedirectAnchor from '../RedirectAnchor';
import Marquee from '../Marquee';

const CardService = () => {
    return (
        <Card className="card-service col-2">
            <Marquee>
                <FaHtml5 size={55} />
                <FaCss3 size={55} />
                <IoLogoJavascript size={55} />
                <TbBrandNextjs size={55} />
                <FaReact size={55} />
                <SiMongodb size={55} />
                <SiExpress size={55} />
                <FaNodeJs size={55} />
                <FaGitAlt size={55} />
                <FaSass size={55} />
                <SiTailwindcss size={55} />
                <TbBrandTypescript size={55} />
            </Marquee>

            <div className="card-content">
                <p className="card-sub-title">Specilization</p>
                <h3 className="card-title">Service Offering</h3>
            </div>
            <RedirectAnchor href="/" />
        </Card>
    )
}

export default CardService