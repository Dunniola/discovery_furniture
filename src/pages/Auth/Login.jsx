import React, { useState, useEffect } from "react";
import Button from "../../components/General/Button";
import { useDataContext } from "../../context/DataContext";
import { useAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
const navigate = useNavigate();
const { postRequest } = useDataContext();
const { handleChange, user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '', 
    password: '', 
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await postRequest(`login`, form);

    if (result.status === 'success') {
      handleChange(result.user, result.token);
      toast.success("Login Success!");
    }
    else{
      toast.error("Invalid email or Password")
    }
    setLoading(false);
  }

  useEffect(() => {
  if (user) {
    if (user.role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/moodboard');
    }
  }
}, [user, navigate]);
  
  return (
    <>
      <div className="h-[100vh] flex justify-center items-center relative max-md:px-3">
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-80"></div>
        <img
          src="/house.jpg"
          alt=""
          className="absolute top-0 left-0 right-0 bottom-0 h-full w-full z-[-1] object-cover"
        />

        <div className=" bg-gray-200 rounded-lg py-10 z-50 min-w-full  lg:min-w-[500px]">
          <div className="h-[40px] bg-black flex justify-between  items-center px-5 mb-8">
            <h1 className="text-xl font-bold text-white">Elegant Homes and Properties</h1>

            <img src="mtn-nobg.png" className="w-[110px]" alt="" />
          </div>

          <form className="px-5" onSubmit={handleSubmit}>
            <h1 className="mb-6 text-xl font-bold text-gray-700">
              Admin Login
            </h1>

            <div className="mb-5">
              <input
                type="email"
                className="border border-[#8F8B80] placeholder:text-[#8F8B80] rounded-lg w-full py-3 px-2 bg-alt1"
                placeholder="email"
                name="email"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-5">
              <input
                type="password"
                className="border border-[#8F8B80] placeholder:text-[#8F8B80] rounded-lg w-full py-3 px-2 bg-alt1"
                placeholder="password"
                name="password"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-[100px]">
            <Button text={"Sign in"} isLoading={loading}/>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
