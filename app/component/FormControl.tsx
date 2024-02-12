"use client"
import React from 'react'
interface formControlType {
    className?: string,
    onInput?: Function,
    formError?: string,
    type?: string,
    name?: string,
    id: string,
    label: string,
    value?: string
}

export const FormControl = ({ className, type = "text", name, id, label, onInput, value }: formControlType) => {
    return (
        <div className={`form-group ${className}`}>
            <input type={type} className="form-control" placeholder='' name={name} value={value} id={id} onChange={e => onInput} />
            <label className="form-label" htmlFor={id}>{label}</label>
        </div>
    )
}
