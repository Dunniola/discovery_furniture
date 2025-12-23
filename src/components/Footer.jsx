import React from 'react'
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
const Footer = () => {
  return (
    <div className={`fat  py-2  justify-center text-red-900 grid mt-5`}>
        <div className="social-icons-div flex items-center gap-[30px] justify-center">
              <a href="#">
                <AiFillInstagram
                  className="text-primary hover:text-tetiary"
                  size={25}
                />
              </a>
              <a href="">
                <FaFacebookF
                  className="text-primary hover:text-tetiary"
                  size={25}
                />
              </a>
              <a href="">
                <AiOutlineTwitter
                  className="text-primary hover:text-tetiary"
                  size={25}
                />
              </a>
              <a href="">
                <FaLinkedinIn
                  className="text-primary hover:text-tetiary"
                  size={25}
                />
              </a>
            </div>
        <h3 className='text-center text-primary'><span className='text-black font-semibold'>© </span> Copyright Damx Studio. All rights reserved</h3>
    </div>
  )
}

export default Footer