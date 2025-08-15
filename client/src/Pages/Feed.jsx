import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData, } from '../assets/assets'
import StoriesBar from '../Components/StoriesBar'
import PostCard from '../Components/PostCard'
import RecentMessages from '../Components/RecentMessages'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const {getToken} = useAuth()


  const fetchPosts = async () => {
    const token = await getToken()
    try {
      setLoading(true)
      const {data} = await api.get('/api/post/feed', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(data.success){
        setFeeds(data.posts)
      }else{
        toast.error(data.mesaage)
      }
    } catch (error) {
      toast.error(error.mesaage)
    }
    setLoading(false)
  }

  useEffect(()=>{
    fetchPosts();
  },[])

  return (
    <div className='h-full overlow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      <div>
        <StoriesBar />
        <div className='p-4 space-y-6'>
          {
            feeds.map((post)=>(
              <PostCard post={post} key={post._id}/>
            ))
          }
        </div>
      </div>
      <div className='max-xl:hidden sticky top-0'>
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
          <h3 className='text-slate-800 font-semibold'>Sponsored</h3>
          <img src={assets.sponsored_img} className='w-75 h-50 rounded-md' />
          <p className='text-slate-600'>Email marketing</p>
          <p className='text-slate-400'>Superchange your marketing with a powerful, easy-to-use platform built for results.</p> 
        </div>
        <RecentMessages />
      </div>
    </div>
  )
}

export default Feed