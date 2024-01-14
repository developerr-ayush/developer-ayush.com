import React from 'react'
import Card from './Card'
import BasicCard from './BasicCard'
import Content from './Content'
import CardList from './CardList'
interface data {
    title?: string,
    data: Array<dataObj>
    showDesc?: Boolean
}
interface dataObj {
    id: number,
    from: string,
    position: string,
    date: string,
    para: string,
}
const Cardknowledege = ({ title, data, showDesc = false }: data) => {
    return (
        <BasicCard className='card-knowledge'>
            <div>

                {title && <h3 className="title">{title}</h3>}
                <CardList className='mb-0'>
                    {data?.map((e, i) => {
                        return <Card key={i}>
                            <h3 className="card-title">{e.position}</h3>
                            <p className="card-text">{e.date.split("-")[0]} - <span className="highlight">{e.date.split("-")[1]}</span></p>
                            <p className="card-text">{e.from}</p>
                            <p className="card-text">{e.para}</p>
                        </Card>
                    })}
                </CardList>
            </div>
        </BasicCard>
    )
}

export default Cardknowledege