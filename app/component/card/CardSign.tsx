import React from 'react'
import Card from './Card'
import Image from 'next/image'
import RedirectAnchor from '../RedirectAnchor'
import sign from "@/assets/img/signature.png"

const CardSign = () => {
    return (
        <Card className="card-sign">
            <div className="card-image">
                <Image src={sign} width={240} alt="creds" />
            </div>
            <div className="card-content">
                <p className="card-sub-title">more about me</p>
                <h3 className="card-title">Credentials</h3>
            </div>
            <RedirectAnchor href="/" />
        </Card>
    )
}

export default CardSign