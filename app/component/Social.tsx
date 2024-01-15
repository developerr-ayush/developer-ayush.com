import React, { CSSProperties } from 'react';
import { FaTwitter, FaYoutube, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

interface SocialItem {
    title: string;
    url: string;
    element: React.ElementType;
    color: string;
}

const social: SocialItem[] = [
    {
        title: "Instagram",
        url: "https://instagram.com",
        element: FaInstagram,
        color: "#bc2a8d" // Color for Instagram
    },
    {
        title: "Youtube",
        url: "https://youtube.com",
        element: FaYoutube,
        color: "#ff0000" // Color for Youtube
    },
    {
        title: "LinkedIn",
        url: "https://linkedin.com",
        element: FaLinkedin,
        color: "#0077b5" // Color for LinkedIn
    },
    {
        title: "GitHub",
        url: "https://github.com",
        element: FaGithub,
        color: "#7034a2" // Color for GitHub
    },
];

const Social = () => {
    return (
        <>
            {social.map((e, i) => {
                return (
                    <a
                        key={i}
                        href={e.url}
                        target="_blank"
                        className="social-link"
                        style={{ "--brand-color": e.color } as CSSProperties}
                        title={e.title}
                    >
                        <e.element size={25} />
                    </a>
                );
            })}
        </>
    );
};

export default Social;
