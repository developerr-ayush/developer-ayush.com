import React from 'react'
import Card from './Card'

const CardEdu = () => {
    return (
        <Card>
            <h3 className="title">Education</h3>
            <Card>
                <h3 className="card-title">Amity Univercity</h3>
                <p className="card-text">2022 - <span className="highlight">2025</span></p>
                <p className="card-text">Bachlors of Computer Application</p>
            </Card>
            <Card>
                <h3 className="card-title">Mumbai University</h3>
                <p className="card-text">2020 - 2021</p>
                <p className="card-text">HSC</p>
            </Card>
        </Card>
    )
}

export default CardEdu