import React from 'react'
import CardList from '@/component/card/CardList'
import Title from '@/component/Title'
import BasicCard from '@/component/card/BasicCard'

async function getData() {
  const res = await fetch("https://auth-sigma-two.vercel.app/api/blog", { cache: "no-store" })
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
interface Article {
  id: string,
  title: string,
  createdAt: Date,
  updatedAt: Date,
  status: string,
  banner: string
  description?: string
  author: {
    name: string,
  }
}
const page = async () => {
  const data = await getData()
  console.log(data)
  return (
    <CardList className='grid grid-lg-3 align-start '>
      <div className="col-lg-3">
        <Title>Blogs</Title>
      </div>
      <CardList className='col-lg-3 grid-lg-3 align-start'>
        {data.map((article: Article) =>
          <div key={article.id}>
            <BasicCard img={{
              src: article.banner,
              alt: article.title,
              height: 500
            }}
              content={{
                title: article.title,
                text: article.description
              }}
              redirect={`/blog/${article.id}`}
              className="card-blog" />
          </div>
        )}
      </CardList>
    </CardList>
  )
}

export default page