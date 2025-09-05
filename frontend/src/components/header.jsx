import React from 'react'

function Header() {
  return (
    <div className='flex justify-between items-center p-4'>
        <span>
            BRANCH.IT
        </span>
        <div>
            <nav className='bg-slate-800'>
                <ul>
                    <li>Home</li>
                    <li>Projects</li>
                    <li>Teams</li>
                </ul>
            </nav>
        </div>
        <div>
            <button className="border-2 border-solid border-black bg-white text-black bg-white">
                New Project
            </button>
            <button className="bg-black border rounded-full"> 
            </button>

        </div>
    </div>
  )
}

export default Header;