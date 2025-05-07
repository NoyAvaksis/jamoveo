import logo from "../assets/JaMoveoLogo.png";

// Logo component used across the app for branding
// Accepts optional className for size and styling customization
function Logo({ className = "" }) {
  return (
    <img
      src={logo}                            // Source of the logo image
      alt="JaMoveo Logo"                   // Accessible alt text for screen readers
      className={`w-auto ${className} drop-shadow-2xl`} // Allow external styling and apply shadow
    />
  );
}

export default Logo;
