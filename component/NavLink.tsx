"use client"
import { usePathname } from 'next/navigation'

import Link from 'next/link'
import React from 'react'
interface NavLinkType {
    href: string,
    label: string
}
const NavLink = ({ href, label }: NavLinkType) => {
    const pathname = usePathname()

    return (
        <li className={`site-nav__item ${pathname === href ? 'site-nav__active' : ''}`}>
            <Link className="site-nav__anchor" href={href}>
                {label}
            </Link>
        </li>
    )
}

export default NavLink