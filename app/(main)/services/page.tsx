import React from 'react'
import CardList from '@/component/card/CardList'
import { servicesArray } from '@/data/data'
import BasicCard from '@/component/card/BasicCard'

const page = () => {
    return (
        <CardList className='grid grid-lg-3'>
            {servicesArray.map((e, i) => {
                return (
                    <BasicCard key={i} content={{
                        title: e.heading,
                        text: e.paragraph
                    }} className="card-service-item" />
                )
            })}
        </CardList>
    )
}

export default page