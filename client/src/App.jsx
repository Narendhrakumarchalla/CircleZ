import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Messages from './Pages/Messages'
import Discover from './Pages/Discover'
import Connections from './Pages/Connections'
import CreatePost from './Pages/CreatePost'
import Feed from './Pages/Feed'
import {useAuth, useUser} from '@clerk/clerk-react'
import Layout from './Pages/Layout'
import {Toaster} from 'react-hot-toast'
import Chat from './Pages/Chat'
import {useDispatch} from 'react-redux'
import { fetchUser } from './featutes/user/userSlice'

const App = () => {
  const {user} = useUser();
  const {getToken} = useAuth()

  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchData = async () => {
      if(user){
        const token = await getToken()
        dispatch(fetchUser(token))
      }
    }

    fetchData()
  },[user, getToken, dispatch])


  return (
    <div>
        <Toaster />
        <Routes>
            <Route path='/' element={!user ?<Login /> : <Layout/>} >
                <Route index element={<Feed />} />
                <Route path='profile' element={<Profile />} />
                <Route path='profile/:profileId' element={<Profile />} />
                <Route path='messages' element={<Messages />} />
                <Route path='messages/:messageId' element={<Chat />} />
                <Route path='discover' element={<Discover />} />
                <Route path='connections' element={<Connections />} />
                <Route path='create-post' element={<CreatePost />} />
            </Route>
        </Routes>
    </div>
  )
}

export default App