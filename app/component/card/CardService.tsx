import React, { CSSProperties } from 'react'
import Card from './Card'
import { FaHtml5, FaCss3, FaReact, FaNodeJs, FaGitAlt, FaSass, FaTwitter, FaYoutube, FaLinkedin, FaGithub } from "react-icons/fa";
import { SiMongodb, SiExpress, SiTailwindcss } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { TbBrandNextjs, TbBrandTypescript } from "react-icons/tb";
import RedirectAnchor from '../RedirectAnchor';
import Marquee from '../Marquee';
import BasicCard from './BasicCard';
let serviceData = [
    {
        title: "NextJS",
        svg: TbBrandNextjs,
        color: "#0070f3" // Add the color value for NextJS
    },
    {
        title: "Typescript",
        svg: TbBrandTypescript,
        color: "#3178c6" // Add the color value for Typescript
    },
    {
        title: "JavaScript",
        svg: IoLogoJavascript,
        color: "#f7df1e" // Add the color value for JavaScript
    },
    {
        title: "ReactJS",
        svg: FaReact,
        color: "#61dafb" // Add the color value for ReactJS
    },
    {
        title: "MongoDB",
        svg: SiMongodb,
        color: "#4db33d" // Add the color value for MongoDB
    },
    {
        title: "Express",
        svg: SiExpress,
    },
    {
        title: "Node JS",
        svg: FaNodeJs,
        color: "#68a063" // Add the color value for Node JS
    },
    {
        title: "GIT",
        svg: FaGitAlt,
        color: "#f1502f" // Add the color value for GIT
    },
    {
        title: "HTML",
        svg: FaHtml5,
        color: "#e44d26" // Add the color value for HTML
    },
    {
        title: "CSS",
        svg: FaCss3,
        color: "#264de4" // Add the color value for CSS
    },
    {
        title: "SCSS",
        svg: FaSass,
        color: "#c6538c" // Add the color value for SCSS
    },
    {
        title: "Tailwind",
        svg: SiTailwindcss,
        color: "#38b2ac" // Add the color value for Tailwind
    },
];

const CardService = () => {
    return (
        <BasicCard content={{
            subTitle: "Specilization",
            title: "Service Offering"
        }} redirect='/services' className="card-service col-2">
            <Marquee>
                {serviceData.map((e, i) => {
                    return (
                        <div key={i} title={e.title} style={{ "--brand-color": e.color } as CSSProperties} className="card-icon">
                            <a title={e.title}>
                                <e.svg size={40} />
                            </a>
                        </div>
                    );
                })}
            </Marquee>
        </BasicCard>
    )
}

export default CardService