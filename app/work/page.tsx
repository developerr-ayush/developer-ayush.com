import React from 'react'
import CardList from '../component/card/CardList'
import Card from '../component/card/Card'
import RedirectAnchor from '../component/RedirectAnchor'
import Image from 'next/image'
import project from "@/assets/img/project.jpeg"

const page = () => {
    return (
        <CardList className='grid-3'>
            <Card>
                <Image src={project} alt='project' className='card-img' />
                <RedirectAnchor href='/' />
            </Card>
        </CardList>
    )
}

export default page