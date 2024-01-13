import React from 'react'
import CardList from '../component/card/CardList'
import Card from '../component/card/Card'
import RedirectAnchor from '../component/RedirectAnchor'
import Image from 'next/image'
import project from "@/assets/img/project.jpeg"
import BasicCard from '../component/card/BasicCard'
import Title from '../component/Title'

const page = () => {
    return (
        <CardList className='grid grid-lg-3 align-start'>

            <CardList className='col-lg-2'>
                <div className="col-lg-2">
                    <Title>Projects</Title>

                </div>
                <div>
                    <BasicCard img={{
                        src: project,
                        alt: "profile"
                    }}
                        content={{
                            title: "Dynamic",
                            subTitle: "Web Development"
                        }}
                        redirect='/'
                        className="card-project" />
                </div>
                <div>
                    <BasicCard img={{
                        src: project,
                        alt: "profile"
                    }}
                        content={{
                            title: "Dynamic",
                            subTitle: "Web Development"
                        }}
                        redirect='/'
                        className="card-project" />
                </div>
                <div>
                    <BasicCard img={{
                        src: project,
                        alt: "profile"
                    }}
                        content={{
                            title: "Dynamic",
                            subTitle: "Web Development"
                        }}
                        redirect='/'
                        className="card-project" />
                </div>
                <div>
                    <BasicCard img={{
                        src: project,
                        alt: "profile"
                    }}
                        content={{
                            title: "Dynamic",
                            subTitle: "Web Development"
                        }}
                        redirect='/'
                        className="card-project" />
                </div>
                <div>
                    <BasicCard img={{
                        src: project,
                        alt: "profile"
                    }}
                        content={{
                            title: "Dynamic",
                            subTitle: "Web Development"
                        }}
                        redirect='/'
                        className="card-project" />
                </div>
                <div>
                    <BasicCard img={{
                        src: project,
                        alt: "profile"
                    }}
                        content={{
                            title: "Dynamic",
                            subTitle: "Web Development"
                        }}
                        redirect='/'
                        className="card-project" />
                </div>
            </CardList>
            <CardList className='col-lg-1'>
                <div>
                    <BasicCard img={{
                        src: project,
                        alt: "profile"
                    }}
                        content={{
                            title: "Dynamic",
                            subTitle: "Web Development"
                        }}
                        redirect='/'
                        className="card-project" />
                </div>
                <div>
                    <BasicCard img={{
                        src: project,
                        alt: "profile"
                    }}
                        content={{
                            title: "Dynamic",
                            subTitle: "Web Development"
                        }}
                        redirect='/'
                        className="card-project" />
                </div>
            </CardList>
        </CardList>
    )
}

export default page