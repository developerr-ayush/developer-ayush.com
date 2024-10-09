"use client"
import React from 'react'
interface formControlType {
    className?: string,
    onChange?: Function,
    formError?: string,
    type?: string,
    name: string,
    id: string,
    label: string,
    value: string,
    error?: string,
    setForm: Function,
    disable?: boolean
}

export const FormControl = ({ className, type = "text", disable = false, name, id, label, setForm, value, error }: formControlType) => {
    const handleChange = (e: any) => {
        setForm((curr: any) => ({ ...curr, [e.target.name]: e.target.value }));
    }
    return (
        <div className={`form-group ${className}`}>
            <input type={type} className="form-control" placeholder='' name={name} value={value} id={id} onChange={handleChange} disabled={disable} />
            <label className="form-label" htmlFor={id}>{label}</label>
            <p className="form-error">{error}</p>
        </div>
    )
}
