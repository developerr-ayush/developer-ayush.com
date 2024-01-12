import React from 'react'
interface content {
    subTitle?: string,
    title?: string,
    name?: string
    children?: React.ReactNode,
    text?: string
}
const Content = ({ subTitle, title, name, children, text }: content) => {
    return (
        <div className="card-content">
            {subTitle && <p className="card-sub-title">{subTitle}</p>}
            {name && <h3 className="card-name">{name}</h3>}
            {title && <h3 className="card-title">{title}</h3>}
            {text && <h3 className="card-text">{text}</h3>}
            {children}
        </div>
    )
}

export default Content