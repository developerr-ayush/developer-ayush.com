import React from 'react'
import Image from "next/image";
import myWork from "@/assets/img/my-works.png"
import Card from './Card';
import RedirectAnchor from '../RedirectAnchor';

const CardWork = () => {
    return (
        <Card className="card-work">
            <div className="card-image">
                <Image src={myWork} width={240} alt="mywork" />
            </div>
            <div className="card-content">
                <p className="card-sub-title">Showcase</p>
                <h3 className="card-title">Projects</h3>
            </div>
            <RedirectAnchor href="/" />
        </Card>
    )
}

export default CardWork