import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/JaMoveoLogo.png';

function SignupHeader() {
  return (
    <header className="w-full flex justify-start items-center px-6 mb-8">
      <Link to="/">
        <img
          src={logo}
          alt="JaMoveo"
          className="w-32 h-32 object-contain hover:scale-105 transition-transform duration-300"
        />
      </Link>
    </header>
  );
}

export default SignupHeader;
