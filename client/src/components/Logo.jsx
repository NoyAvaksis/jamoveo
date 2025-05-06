import logo from "../assets/JaMoveoLogo.png";

function Logo({ size = "w-64 h-64", className = "" }) {
  return (
    <img
      src={logo}
      alt="JaMoveo Logo"
      className={`${size} ${className} drop-shadow-2xl`}
    />
  );
}

export default Logo;
