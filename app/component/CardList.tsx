import React from 'react'
interface cardListData {
    children: React.ReactNode
    className?: string
}
const CardList = ({ className, children }: cardListData) => {
    return (
        <div className={`card-list ${className}`}>
            {children}
        </div>
    )
}

export default CardList