import React from 'react'
import CardList from '../component/card/CardList'
import BasicCard from '../component/card/BasicCard'
import profile from "@/assets/img/profile.jpg"
import Social from '../component/Social'
import Button from '../component/Button'
import Title from '../component/Title'
import { edu, exp } from "../data/data";
import Cardknowledege from '../component/card/Cardknowledege'
import Marquee from '../component/Marquee'
import ServiceList from '../component/ServiceList'

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
                        <Button label="contact">Contact Me</Button>
                    </BasicCard>
                </div>
                <div className="col-lg-2">
                    <CardList className="mb-0">

                        <BasicCard content={{
                            name: "Ayush Shah",
                            text: "Hello There! I am Ayush Shah from Mumbai, and I love coding websites.I ensure that the entire website is responsive and displays well across different devices.I believe this is just the beginning, and there are many more exciting things to explore in the world of web development."
                        }} />
                        <Cardknowledege title="Experience" data={exp} />
                        <Cardknowledege title="Education" data={edu} />

                        <BasicCard content={{
                            subTitle: "Specilization",
                            title: "Service Offering"
                        }} redirect='/services' className="card-service col-2">
                            <div className="card-service-list">

                                <ServiceList />
                            </div>
                        </BasicCard>
                    </CardList>
                </div>
            </CardList>
        </>
    )
}

export default page