import Image from 'next/image'
import { FaRegLightbulb } from "react-icons/fa";
import React from 'react'
import Link from 'next/link'
import Button from '@/component/Button'
import NavLink from '@/component/NavLink'
import sign from "@/assets/img/signature.png"
import DarkmodeToggle from '@/component/DarkmodeToggle';

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Work", href: "/work" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
]

const Header = () => {
    return (
        <header>
            <div className="container flex">
                <Link href="/" className='logo'><Image src={sign} width={100} alt="profile" className="logo-img" loading='eager' /></Link>
                <Button exCla="btn-hamburger" ariaExpanded={false} label="Hamburger">
                    <span className="line"></span><span className="line"></span><span className="line"></span>
                </Button>
                <nav className="site-nav">
                    <ul className="site-nav-list">
                        {navLinks.map((navLink: any, id: number) => {
                            return <NavLink key={id} href={navLink.href} label={navLink.name} />
                        })}
                    </ul>
                </nav>
                <DarkmodeToggle />
            </div>
        </header >
    )
}

export default Header