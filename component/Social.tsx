import React, { CSSProperties } from 'react';
import { FaTwitter, FaYoutube, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { SiPeerlist } from "react-icons/si";
interface SocialItem {
    title: string;
    url: string;
    element: React.ElementType;
    color: string;
}

const social: SocialItem[] = [
    {
        title: "Instagram",
        url: "https://instagram.com/developerr_ayush/",
        element: FaInstagram,
        color: "#bc2a8d" // Color for Instagram
    },
    {
        title: "Youtube",
        url: "https://www.youtube.com/ayushshah",
        element: FaYoutube,
        color: "#ff0000" // Color for Youtube
    },
    {
        title: "LinkedIn",
        url: "https://www.linkedin.com/in/developerr-ayush/",
        element: FaLinkedin,
        color: "#0077b5" // Color for LinkedIn
    },
    {
        title: "GitHub",
        url: "https://github.com/developerr-ayush",
        element: FaGithub,
        color: "#7034a2" // Color for GitHub
    },
    {
        title: "Peerlist",
        url: "https://peerlist.io/developerayush",
        element: SiPeerlist,
        color: "rgb(0 170 69)" // Color for Peerlist
    }
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
                        <e.element size={20} />
                    </a>
                );
            })}
        </>
    );
};

export default Social;
