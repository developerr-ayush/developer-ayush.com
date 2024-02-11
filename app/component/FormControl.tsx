import React from 'react'
interface formControlType {
    className?: string,
    onInput?: Function,
    formError?: string,
    type?: string,
    name?: string,
    id: string,
    label: string
}

export const FormControl = ({ className, type = "text", name, id, label }: formControlType) => {
    return (
        <div className={`form-group ${className}`}>
            <input type={type} className="form-control" placeholder='' name={name} id={id} />
            <label className="form-label" htmlFor={id}>{label}</label>
        </div>
    )
}
