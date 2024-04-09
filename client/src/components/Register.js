import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/Usename.module.css'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { registerValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import { registerUser } from '../helper/helper'

function Register() {

  const [file, setFile] = useState()
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, {profile : file || ''})
      console.log(values)
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: "Creating...",
        success: <b>Registered Successfully</b>,
        error: <b>Could Not Register</b>
      });

      registerPromise.then(function(){
        navigate('/')
      })
    }
  })

  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{padding: "28px"}}>
          <div className="title flex flex-col items-center">
            <h4 className='text-4xl font-bold'>
              Register
            </h4>
            <span className='py-3 text-sm w-2/3 text-center text-gray-500'>Happy To Join You</span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-3">
              <label htmlFor="profile">
                <img className={styles.profile_img} src={file || avatar} alt="avatar" style={{width: "120px"}} />
              </label>
              <input type="file" id='profile' name='profile' onChange={onUpload} />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('email')} className={styles.textbox} style={{marginTop: "3px", padding: "13px 20px"}} type="email" placeholder='Email' />
              <input {...formik.getFieldProps('username')} className={styles.textbox} style={{marginTop: "3px", padding: "13px 20px"}} type="text" placeholder='Username' />
              <input {...formik.getFieldProps('password')} className={styles.textbox} style={{marginTop: "3px", padding: "13px 20px"}} type="password" placeholder='Password' />
              <button className={styles.btn} style={{padding: "13px 20px"}} type='submit'>Register</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">Already Register? <Link to="/" className='text-red-500 hover:underline' >Login Now</Link> </span>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
