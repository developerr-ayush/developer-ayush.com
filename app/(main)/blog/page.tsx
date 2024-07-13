import Blog from '@/component/Blog'
import React from 'react'
import { metadata } from '../layout'


const page = async () => {
  metadata.title = "Blog"
  return (
    <Blog />
  )
}

export default page