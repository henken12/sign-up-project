import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './FormatStyle.css'; // Use the shared CSS for consistent styling

function SignIn() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Make API request to the backend for signing in the user
      const response = await axios.post('https://n50nxslkt8.execute-api.us-east-1.amazonaws.com/devo/signin', data);
      alert('Login successful');
      console.log(response.data);
    } catch (error) {
      alert('Error logging in');
      console.error(error);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="col-md-4">
        <h2 className="text-center mb-4 h3">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>

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

          <button type="submit" className="btn btn-primary w-100 btn-sm">Sign In</button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-3">
          <p className="small">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
