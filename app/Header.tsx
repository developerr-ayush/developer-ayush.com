"use client"
import Image from 'next/image'
import logo from "@/assets/img/logo.png"
import React from 'react'
import Link from 'next/link'
import Button from './component/Button'
import { usePathname } from 'next/navigation'
const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Work", href: "/work" },
    { name: "Contact Us", href: "/contact" },
]
const Header = () => {
    const pathname = usePathname()
    return (
        <header>
            <div className="container flex">
                <Link href="/"><Image src={logo} alt='logo' width="100" /></Link>
                <Button exCla="btn-hamburger" ariaExpanded={false}>
                    <span className="line"></span><span className="line"></span><span className="line"></span>
                </Button>
                <nav className="site-nav">
                    <ul className="site-nav-list">
                        {navLinks.map((navLink: any, id: number) => {
                            return <li key={id} className={`site-nav__item ${pathname === navLink.href ? 'site-nav__active' : ''}`}> <Link className="site-nav__anchor" href={navLink.href}>{navLink.name}</Link></li>
                        })}
                    </ul>
                </nav>
                <Button >Lets Talk</Button>
            </div>
        </header >
    )
}

export default Header