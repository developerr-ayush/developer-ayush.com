import Image from 'next/image'
import logo from "@/assets/img/logo.png"
import React from 'react'
import Link from 'next/link'
import Button from './component/Button'
import NavLink from './component/NavLink'
const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Work", href: "/work" },
    { name: "Contact", href: "/contact" },
]
const Header = () => {
    return (
        <header>
            <div className="container flex">
                <Link href="/" className='logo'>Ayush</Link>
                <Button exCla="btn-hamburger" ariaExpanded={false}>
                    <span className="line"></span><span className="line"></span><span className="line"></span>
                </Button>
                <nav className="site-nav">
                    <ul className="site-nav-list">
                        {navLinks.map((navLink: any, id: number) => {
                            return <NavLink key={id} href={navLink.href} label={navLink.name} />
                        })}
                    </ul>
                </nav>
                <Button >Lets Talk</Button>
            </div>
        </header >
    )
}

export default Header