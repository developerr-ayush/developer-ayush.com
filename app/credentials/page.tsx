import React from 'react'
import CardList from '../component/card/CardList'
import BasicCard from '../component/card/BasicCard'
import profile from "@/assets/img/profile.jpg"
import Social from '../component/Social'
import Button from '../component/Button'
import Title from '../component/Title'
import { edu, exp } from "../data/data";

interface dataObj {
    id: number,
    from: string,
    position: string,
    date: string,
    para: string,
}
const page = () => {
    return (
        <>
            <CardList className="grid grid-lg-3 align-start">
                <div className="col-lg-1 card-md-sticky">
                    {/* Profile Card */}
                    <BasicCard img={{
                        src: profile,
                        alt: "Ayush Shah"
                    }} className="card-about-profile" content={{ name: "Ayush Shah", text: "@developerr_ayush" }}>
                        <div className="card-social-wrap">
                            <Social />
                        </div>
                        <Button>Contact Me</Button>
                    </BasicCard>
                </div>
                <div className="col-lg-2">
                    {/* <CardList className='mb-0'>
                    </CardList> */}
                </div>
            </CardList>
        </>
    )
}

export default page