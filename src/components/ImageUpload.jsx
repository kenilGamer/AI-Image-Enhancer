import React from 'react'

function ImageUpload( props) {
  const showimgHandler= (e) => {
    const file = e.target.files[0];
    if (file) {
      props.uploadHandler(file);
    } 
  }
  return (
    <div className='bg-white shadow-xl rounded-2xl  p-5 w-full'>
      <label htmlFor="fileinput" className='block w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-indigo-400'>
        <input type="file" id="fileinput" className='hidden' accept="image/*" onChange={showimgHandler} />
        <samp className='text-sm font-medium text-gray-600 '>click and drag to upload</samp>
      </label>
    </div>
  )
}

export default ImageUpload