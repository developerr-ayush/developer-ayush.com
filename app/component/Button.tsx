"use client"
import React, { useState } from 'react'
interface buttonParams {
    children: React.ReactNode,
    exCla?: string,
    ariaExpanded?: boolean | undefined,
    label: string
}
const Button = ({ children, exCla, ariaExpanded = false, label }: buttonParams) => {
    let [aria, setAria] = useState(ariaExpanded);
    let handleClick = () => {
        setAria(!aria)
    }
    return (
        <button className={`btn ${exCla}`} aria-expanded={aria} aria-label={label} onClick={handleClick}>{children}</button>
    )
}

export default Button