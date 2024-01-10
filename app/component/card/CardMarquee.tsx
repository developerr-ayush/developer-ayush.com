import React from 'react'
import Card from './Card'
import Marquee from '../Marquee'

const CardMarquee = () => {
    return (
        <Card className="card-marquee col-2">
            <Marquee>
                <div className="marquee-item"><p>Latest Work and Feature</p></div>
                <div className="marquee-item"><p>Latest Work and Feature</p></div>
            </Marquee>
        </Card>
    )
}

export default CardMarquee