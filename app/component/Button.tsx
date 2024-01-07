"use client"
import React, { useState } from 'react'
interface buttonParams {
    children: React.ReactNode,
    exCla?: string,
    ariaExpanded?: boolean | undefined
}
const Button = ({ children, exCla, ariaExpanded = false }: buttonParams) => {
    let [aria, setAria] = useState(ariaExpanded);
    let handleClick = () => {
        setAria(!aria)
    }
    return (
        <button className={`btn ${exCla}`} aria-expanded={aria} onClick={handleClick}>{children}</button>
    )
}

export default Button