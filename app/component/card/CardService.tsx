import React from 'react'
import Card from './Card'
import { FaHtml5, FaCss3, FaReact, FaNodeJs, FaGitAlt, FaSass, FaTwitter, FaYoutube, FaLinkedin, FaGithub } from "react-icons/fa";
import { SiMongodb, SiExpress, SiTailwindcss } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { TbBrandNextjs, TbBrandTypescript } from "react-icons/tb";
import RedirectAnchor from '../RedirectAnchor';
import Marquee from '../Marquee';
import BasicCard from './BasicCard';

const CardService = () => {
    return (
        <BasicCard content={{
            subTitle: "Specilization",
            title: "Service Offering"
        }} redirect='/services' className="card-service col-2">
            <Marquee>
                <div className="card-icon">
                    <FaHtml5 size={40} />
                </div>
                <div className="card-icon">
                    <FaCss3 size={40} />
                </div>
                <div className="card-icon">
                    <IoLogoJavascript size={40} />
                </div>
                <div className="card-icon">
                    <TbBrandNextjs size={40} />
                </div>
                <div className="card-icon">
                    <FaReact size={40} />
                </div>
                <div className="card-icon">
                    <SiMongodb size={40} />
                </div>
                <div className="card-icon">
                    <SiExpress size={40} />
                </div>
                <div className="card-icon">
                    <FaNodeJs size={40} />
                </div>
                <div className="card-icon">
                    <FaGitAlt size={40} />
                </div>
                <div className="card-icon">
                    <FaSass size={40} />
                </div>
                <div className="card-icon">
                    <SiTailwindcss size={40} />
                </div>
                <div className="card-icon">
                    <TbBrandTypescript size={40} />
                </div>
            </Marquee>
        </BasicCard>
    )
}

export default CardService