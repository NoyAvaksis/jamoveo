import logo from "../assets/JaMoveoLogo.png";

function Logo({ className = "" }) {
  return (
    <img
      src={logo}
      alt="JaMoveo Logo"
      className={`w-auto ${className} drop-shadow-2xl`}
    />
  );
}

export default Logo;