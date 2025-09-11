import React, { useState } from 'react'
import Login from './Login';
import Signup from './Signup';

const HomePage = () => {
  const [currentTab, setCurrentTab] = useState("login");
  return (
    <div className='w-full flex flex-col gap-4 items-center justify-center px-2'>
      <div className='w-full sm:w-[80%] md:w-[60%] lg:w-[37%] h-[80px] rounded-md bg-white mt-12 flex items-center justify-center'>
        <h1 className='talkative text-3xl sm:text-4xl'>Talk-A-Tive</h1>
      </div>
      <div className='bg-white w-full sm:w-[80%] md:w-[60%] lg:w-[37%] rounded-md'>
        <div className='bg-white mt-3 w-[95%] flex flex-row mx-auto'>
          <div
            onClick={() => setCurrentTab("login")}
            className={`transition duration-300 cursor-pointer w-[50%] flex items-center justify-center rounded-full ${currentTab === "login" ? "bg-blue-500" : "bg-white"} px-3 py-2`}
          >
            <p>Login</p>
          </div>
          <div
            onClick={() => setCurrentTab("signup")}
            className={`transition duration-300 cursor-pointer w-[50%] flex items-center justify-center rounded-full ${currentTab === "signup" ? "bg-blue-500" : "bg-white"} px-3 py-2`}
          >
            <p>Signup</p>
          </div>
        </div>
        <div className='w-[90%] mx-auto mt-4'>
          {currentTab === "login" ? (<Login />) : (<Signup />)}
        </div>
      </div>
    </div>
  )
}

export default HomePage
