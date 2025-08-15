import React, { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Messages from './Pages/Messages'
import Discover from './Pages/Discover'
import Connections from './Pages/Connections'
import CreatePost from './Pages/CreatePost'
import Feed from './Pages/Feed'
import {useAuth, useUser} from '@clerk/clerk-react'
import Layout from './Pages/Layout'
import toast, {Toaster} from 'react-hot-toast'
import Chat from './Pages/Chat'
import {useDispatch} from 'react-redux'
import { fetchUser } from './featutes/user/userSlice.js'
import {fetchConnections} from './featutes/connections/connectionSlice.js'
import { addMessage } from './featutes/messages/messagesSlice.js'
import Notification from './Components/Notification.jsx'

const App = () => {
  const {user} = useUser();
  const {getToken} = useAuth()
  const {pathname} = useLocation()
  const pathnameRef = useRef(pathname)
  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchData = async () => {
      if(user){
        const token = await getToken()
        dispatch(fetchUser(token))
        dispatch(fetchConnections(token))
      }
    }

    fetchData()
  },[user, getToken, dispatch])

  useEffect(()=>{
    pathnameRef.current = pathname
  },[pathname])


  useEffect(()=>{
    if(user){
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/'+ user.id)

      eventSource.onmessage = (event)=>{
        const message = JSON.parse(event.data)
        if(pathnameRef.current === ('/messages/' + message.from_user_id._id)){
          dispatch(addMessage(message))
        }
        else{
          toast.custom((t)=>(
            <Notification t={t} message={message}/>
          ),{position:'top-right'})
        }
      }
      return ()=>{
        eventSource.close()
      }
    }
  },[ user, dispatch ])

  return (
    <div>
        <Toaster />
        <Routes>
            <Route path='/' element={!user ?<Login /> : <Layout/>} >
                <Route index element={<Feed />} />
                <Route path='profile' element={<Profile />} />
                <Route path='profile/:profileId' element={<Profile />} />
                <Route path='messages' element={<Messages />} />
                <Route path='messages/:userId' element={<Chat />} />
                <Route path='discover' element={<Discover />} />
                <Route path='connections' element={<Connections />} />
                <Route path='create-post' element={<CreatePost />} />
            </Route>
        </Routes>
    </div>
  )
}

export default App