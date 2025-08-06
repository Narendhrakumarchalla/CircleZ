import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Messages from './Pages/Messages'
import Discover from './Pages/Discover'
import Connections from './Pages/Connections'
import CreatePost from './Pages/CreatePost'
import Feed from './Pages/Feed'
import {useUser} from '@clerk/clerk-react'
import Layout from './Pages/Layout'
import {Toaster} from 'react-hot-toast'
import Chat from './Pages/Chat'
const App = () => {
  const {user} = useUser();
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