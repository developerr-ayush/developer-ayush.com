import React from 'react'
import Card from './Card'

const CardExp = () => {
    return (
        <Card className='card-exp'>
            <Card>
                <h3 className="card-title">03</h3>
                <p className="card-text"><span>Years</span><span>Experience</span></p>
            </Card>
            <Card>
                <h3 className="card-title">+30</h3>
                <p className="card-text"><span>Clients</span><span>Worldwide</span></p>
            </Card>
            <Card>
                <h3 className="card-title">+100</h3>
                <p className="card-text"><span>Total</span><span>Projects</span></p>
            </Card>
        </Card>
    )
}

export default CardExp