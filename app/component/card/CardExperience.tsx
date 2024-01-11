import React from 'react'
import Card from './Card'

const CardExperience = () => {
    return (
        <Card>
            <h3 className="title">Experience</h3>
            <Card>
                <h3 className="card-title">Sportz Interactive</h3>
                <p className="card-text">2022 - <span className="highlight">Present</span></p>
                <p className="card-text">Front End Developer</p>
            </Card>
            <Card>
                <h3 className="card-title">DataViv Technologies</h3>
                <p className="card-text">2021 - 2022</p>
                <p className="card-text">Front End Developer</p>
            </Card>
        </Card>
    )
}

export default CardExperience