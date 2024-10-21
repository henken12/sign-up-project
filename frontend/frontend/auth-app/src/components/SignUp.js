import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from react-router-dom
import axios from 'axios';
import './FormatStyle.css'; // Shared CSS file

function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); // Use useNavigate for redirecting

  const onSubmit = async (data) => {
    try {
      // Convert image to Base64
      const file = data.profileImage[0]; // Access the file object
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1]; // Extract the Base64 part

        // Create the payload with Base64 image
        const requestBody = {
          name: data.name,
          email: data.email,
          password: data.password,
          filename: file.name, // Include the filename
          contentType: file.type, // Include the content type of the image
          profileImageBase64: base64Image, // Base64 encoded image
        };

        // Make API request to the backend for signing up the user
        const response = await axios.post(
          'https://n50nxslkt8.execute-api.us-east-1.amazonaws.com/devo/signup',
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json', // Required for sending JSON data
            },
          }
        );
        alert('Registration successful');
        console.log(response.data);
        
        // Redirect to the sign-in page after successful registration
        navigate('/signin');
      };
      reader.onerror = (error) => {
        console.error('Error converting image to Base64', error);
        alert('Error converting image to Base64');
      };
    } catch (error) {
      alert('Error registering user');
      console.error(error);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="col-md-4">
        <h2 className="text-center mb-4 h3">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Name */}
          <div className="form-group mb-3">
            <input
              id="name"
              className="form-control form-control-sm"
              {...register('name', { required: 'Name is required' })}
              placeholder="Name"
            />
            {errors.name && <p className="text-danger">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="form-group mb-3">
            <input
              id="email"
              type="email"
              className="form-control form-control-sm"
              {...register('email', { required: 'Email is required' })}
              placeholder="Email"
            />
            {errors.email && <p className="text-danger">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-group mb-3">
            <input
              id="password"
              type="password"
              className="form-control form-control-sm"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              placeholder="Password"
            />
            {errors.password && <p className="text-danger">{errors.password.message}</p>}
          </div>

          {/* Profile Image */}
          <div className="form-group mb-3">
            <input
              id="profileImage"
              type="file"
              className="form-control form-control-sm"
              {...register('profileImage', { required: 'Profile image is required' })}
            />
            {errors.profileImage && <p className="text-danger">{errors.profileImage.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary w-100 btn-sm">Sign Up</button>

          {/* Sign In Link */}
          <div className="text-center mt-3">
            <p className="mb-0">Already have an account? <Link to="/signin">Sign In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
