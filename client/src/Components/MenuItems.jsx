import React from 'react'
import { dummyUserData, menuItemsData } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { CirclePlus } from 'lucide-react'
import { UserButton, useClerk } from '@clerk/clerk-react'

const MenuItems = ({setSidebarOpen}) => {

  return (
    <div className='px-6 text-gray-600 space-y-1 font-medium '>
            {
                menuItemsData?.map(({to, label, Icon }, index)=>(
                    <NavLink key={index} to={to} end={to === '/'} className={({isActive}) =>`px-3.5 py-2 flex itmes-center gap-3 rounded-xl ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`} onClick={()=> setSidebarOpen(false)}>
                        <Icon className='w-5 h-5' />
                        <span className='text-sm'>{label}</span>
                    </NavLink>
                ))
            }
    </div>
    
  )
}

export default MenuItems