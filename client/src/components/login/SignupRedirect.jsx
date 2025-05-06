import { Link } from 'react-router-dom';

function SignupRedirect() {
  return (
    <p className="text-white text-sm mt-4 text-center">
      Don't have an account?{' '}
      <Link to="/signup" className="underline hover:text-purple-200">
        Sign up
      </Link>
    </p>
  );
}

export default SignupRedirect;
