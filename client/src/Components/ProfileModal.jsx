import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../featutes/user/userSlice';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const ProfileModal = ({setShowEdit}) => {
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch()
    const {getToken} = useAuth()
    const navigate = useNavigate()

    const [editForm, setEditForm] = useState({
        username: user.username,
        bio:user.bio,
        location: user.location,
        profile_picture: user.profile_picture,
        full_name: user.full_name,
        cover_photo:null
    })

    const handleSaveProfile = async(e)=>{
        e.preventDefault()
        try {
            const userData = new FormData()
            const {full_name, username, bio, location, profile_picture, cover_photo} = editForm

            userData.append('username', username)
            userData.append('bio', bio)
            userData.append('location', location)
            userData.append('full_name', full_name)
            profile_picture && userData.append('profile', profile_picture)
            cover_photo && userData.append('cover', cover_photo)

            const token = await getToken()
            dispatch(updateUser({userData, token}))
            navigate('/profile')
        } catch (error) {
            toast.error(error.message)
        }
    }
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50'>
        <div className='max-w-2xl sm:py-6 mx-auto'>
            <div className='bg-white rounded-lg shadow p-6'>
                <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h1>

                <form className='space-y-4' onSubmit={e=> toast.promise(
                    handleSaveProfile(e), {loading: 'Saving...'}
                )}>
                    {/* profile picture */}
                    <div className='flex flex-col items-start gap-3'>
                        <label htmlFor='profile_picture' className='block text-sm font-medium text-gray-700 mb-1 cursor-pointer'>
                            Profile Picture
                            <input type='file' accept='image/*' id='profile_picture' 
                            className='w-full p-3 border border-gray-200 rounded-lg'
                            onChange={(e)=>setEditForm({...editForm, profile_picture: e.target.files[0]})}
                            hidden
                            />
                            <div className='group/profile relative'>
                                <img src={editForm.profile_picture instanceof File ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} 
                                className='w-24 h-24 rounded-full object-cover mt-2'
                                />

                                <div className='absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center'>
                                    <Pencil className='w-5 h-5 text-white'/>
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className='flex flex-col items-start gap-3'>
                        <label htmlFor='cover_photo'
                        className='block text-sm font-medium text-gray-700 mb-1 cursor-pointer'
                        >
                            Cover Photo
                            <input type='file' accept='image/*' id='cover_photo' 
                            className='w-full p-3 border border-gray-200 rounded-lg'
                            onChange={(e)=>setEditForm({...editForm, cover_photo: e.target.files[0]})}
                            hidden
                            />
                            <div className='group/cover relative'>
                                <img src={editForm.cover_photo instanceof File ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} 
                                className='w-80 h-40 rounded-lg  object-cover bg-gradient-to-r  from-indigo-200 via-purple-200 to-pink-200 mt-2'
                                />
                                
                                <div className='absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-lg items-center justify-center'>
                                    <Pencil className='w-5 h-5 text-white'/>
                                </div>
                            </div>
                        </label>

                    </div>
                    <div className='flex flex-col items-start gap-3'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Name
                            <input type='text'
                            value={editForm.full_name}
                            onChange={(e)=>setEditForm({...editForm, full_name: e.target.value})}
                            className='w-full p-3 border border-gray-200 rounded-lg'
                            placeholder='Enter your full name'
                            />
                        </label>
                    </div>
                    <div className='flex flex-col items-start gap-3'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Username
                            <input type='text'
                            value={editForm.username}
                            onChange={(e)=>setEditForm({...editForm, username: e.target.value})}
                            className='w-full p-3 border border-gray-200 rounded-lg'
                            placeholder='Enter your username'
                            />
                        </label>
                    </div>
                    {/* bio */}
                    <div className='flex flex-col items-start gap-3'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Bio
                        </label>
                        <textarea 
                            value={editForm.bio}
                            onChange={(e)=>setEditForm({...editForm, bio: e.target.value})}
                            className='w-full p-3 border border-gray-200 rounded-lg'
                            placeholder='Tell us about yourself'
                            rows={3}
                        />
                    </div>
                    {/* location */}
                    <div className='flex flex-col items-start gap-3'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Location
                        </label>
                        <input type='text'
                            value={editForm.location}
                            onChange={(e)=>setEditForm({...editForm, location: e.target.value})}
                            className='w-full p-3 border border-gray-200 rounded-lg'
                            placeholder='Where are you located?'
                        />
                    </div>
                    {/* buttons */}
                    <div className='flex justify-end space-x-3 pt-6'>
                        <button
                        onClick={()=> setShowEdit(false)}
                        type='button'
                        className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50
                        transition cursor-pointer'
                        >Cancel</button>
                        <button
                        type='submit'
                        className=' p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer '
                        >Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default ProfileModal