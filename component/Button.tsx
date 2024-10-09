"use client"
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
interface buttonParams {
    children: React.ReactNode,
    exCla?: string,
    ariaExpanded?: boolean | undefined,
    label: string,
    disable?: boolean
}
const Button = ({ children, exCla, ariaExpanded = false, label, disable }: buttonParams) => {
    const pathname = usePathname();
    let [aria, setAria] = useState(ariaExpanded);
    let handleClick = () => {
        setAria(!aria)
    }
    useEffect(() => {
        setAria(false)
    }, [pathname])
    return (
        <button className={`btn ${exCla}`} aria-expanded={aria} aria-label={label} onClick={handleClick} disabled={disable}>{children}</button>
    )
}

export default Button