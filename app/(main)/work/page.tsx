import React from 'react'
import CardList from '@/component/card/CardList'
import Card from '@/component/card/Card'
import RedirectAnchor from '@/component/RedirectAnchor'
import Image from 'next/image'
import project from "@/assets/img/project.jpeg"
import BasicCard from '@/component/card/BasicCard'
import Title from '@/component/Title'
import { mywork } from '@/data/data'
import { metadata } from '../layout'

const page = () => {
    metadata.title = "Work"
    let len = Math.ceil(mywork.length / 3)
    const filterData = {
        data1: mywork.slice(0, len),
        data2: mywork.slice(len, 2 * len),
        data3: mywork.slice(2 * len),
    }
    return (
        <CardList className='grid grid-lg-3 align-start '>

            <CardList className='col-lg-2 align-start'>
                <div className="col-lg-2">
                    <Title>Projects</Title>
                </div>
                <CardList className="col-lg-1">
                    {filterData.data3.map((e, i) => {
                        return <div key={i}>
                            <BasicCard img={{
                                src: e.url,
                                alt: e.title
                            }}
                                content={{
                                    title: e.title,
                                    text: e.detail
                                }}
                                redirect={e.redirectLink}
                                className="card-project" />
                        </div>
                    })}
                </CardList>
                <CardList className="col-lg-1">
                    {filterData.data2.map((e, i) => {
                        return <div key={i}>
                            <BasicCard img={{
                                src: e.url,
                                alt: e.title
                            }}
                                content={{
                                    title: e.title,
                                    text: e.detail
                                }}
                                redirect={e.redirectLink}
                                className="card-project" />
                        </div>
                    })}
                </CardList>
            </CardList>
            <CardList className='col-lg-1'>
                {filterData.data1.map((e, i) => {
                    return <div key={i}>
                        <BasicCard img={{
                            src: e.url,
                            alt: e.title
                        }}
                            content={{
                                title: e.title,
                                text: e.detail
                            }}
                            redirect={e.redirectLink}

                            className="card-project" />
                    </div>
                })}
            </CardList>
        </CardList>
    )
}

export default page