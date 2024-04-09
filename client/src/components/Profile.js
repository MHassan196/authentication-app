import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/Usename.module.css'
import extend from '../styles/Profile.module.css'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import { profileValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import { updateUser } from '../helper/helper'

function Profile() {

  const [file, setFile] = useState()
  const [{ isLoading, apiData, serverError }] = useFetch()
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: "Updaing...",
        success: <b>Update Successfully</b>,
        error: <b>Could Not Update</b>
      })
    }
  })

  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  // logout function
  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }

  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={`${styles.glass} ${extend.glass}`} style={{ padding: "28px" }}>
          <div className="title flex flex-col items-center">
            <h4 className='text-4xl font-bold'>
              Profile
            </h4>
            <span className='py-3 text-sm w-2/3 text-center text-gray-500'>You Can Update The Details</span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-3">
              <label htmlFor="profile">
                <img className={`${styles.profile_img} ${extend.profile_img}`} src={apiData?.profile || file || avatar} alt="avatar" style={{ width: "120px" }} />
              </label>
              <input type="file" id='profile' name='profile' onChange={onUpload} />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('firstName')} className={`${styles.textbox} ${extend.textbox}`} style={{ marginTop: "3px", padding: "13px 20px" }} type="text" placeholder='First Name' />
                <input {...formik.getFieldProps('lastName')} className={`${styles.textbox} ${extend.textbox}`} style={{ marginTop: "3px", padding: "13px 20px" }} type="text" placeholder='Last Name' />
              </div>
              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} style={{ marginTop: "3px", padding: "13px 20px" }} type="text" placeholder='Mobile No.' />
                <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} style={{ marginTop: "3px", padding: "13px 20px" }} type="email" placeholder='Email' />
              </div>
              <input {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox}`} style={{ marginTop: "3px", padding: "13px 20px" }} type="text" placeholder='Address' />
              <button className={styles.btn} style={{ padding: "13px 20px" }} type='submit'>Update</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">Come Back Later? <button className='text-red-500 hover:underline' onClick={userLogout} >Logout</button> </span>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
