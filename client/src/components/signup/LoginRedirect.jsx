import React from 'react';
import { Link } from 'react-router-dom';

function LoginRedirect() {
  return (
    <p className="text-white text-sm mt-4 text-center">
      Already have an account?{' '}
      <Link to="/login" className="underline hover:text-purple-200">
        Log In
      </Link>
    </p>
  );
}

export default LoginRedirect;
