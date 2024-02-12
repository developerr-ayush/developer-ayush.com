import React from 'react'
import CardList from '../component/card/CardList'
import Title from '../component/Title'
import BasicCard from '../component/card/BasicCard'
let articleData = [
  {
    id: 1,
    title: "Best websites to learn Javascript",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente deserunt quasi, quaerat praesentium iure vel ratione animi harum ipsam ad, culpa consequatur necessitatibus similique! Modi, officia. Eos tenetur quae delectus!",
    img: "https://picsum.photos/seed/picsum/200/200"
  }
]
const page = () => {
  return (
    <CardList className='grid grid-lg-3 align-start '>
      <div className="col-lg-3">
        <Title>Blogs</Title>
      </div>
      <CardList className='col-lg-3 grid-lg-3 align-start'>
        <div>
          <BasicCard img={{
            src: articleData[0].img,
            alt: articleData[0].title,
            height: 500
          }}
            content={{
              title: articleData[0].title,
              text: articleData[0].description
            }}
            redirect={`/blog/${articleData[0].id}`}
            className="card-blog" />
        </div>
        <div>
          <BasicCard img={{
            src: articleData[0].img,
            alt: articleData[0].title,
            height: 500
          }}
            content={{
              title: articleData[0].title,
              text: articleData[0].description
            }}
            redirect={`/blog/${articleData[0].id}`}
            className="card-blog" />
        </div>
        <div>
          <BasicCard img={{
            src: articleData[0].img,
            alt: articleData[0].title,
            height: 500
          }}
            content={{
              title: articleData[0].title,
              text: articleData[0].description
            }}
            redirect={`/blog/${articleData[0].id}`}
            className="card-blog" />
        </div>
      </CardList>
    </CardList>
  )
}

export default page