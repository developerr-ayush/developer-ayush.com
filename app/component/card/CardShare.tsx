import React from 'react'
import Card from './Card'
import RedirectAnchor from '../RedirectAnchor'
import Social from '../Social'


const CardShare = () => {
    return (
        <Card className="card-share col-2">
            <Card className="card-social">
                <Social />
            </Card>
            <div className="card-content">
                <p className="card-sub-title"> STAY WITH ME</p>
                <h3 className="card-title">Profiles</h3>
            </div>
            <RedirectAnchor href="/" />
        </Card>
    )
}

export default CardShare