// A reusable navigation button styled with Tailwind CSS and wrapped in a React Router <Link>

import { Link } from "react-router-dom";

function PrimaryButton({ children, to, color = "pink" }) {
  return (
    // Link component for client-side navigation
    <Link to={to}>
      {/* Button with dynamic hover color based on 'color' prop */}
      <button
        className={`border-2 border-white text-white font-semibold py-2 px-5 rounded-full hover:bg-white hover:text-${color}-700 transition duration-300`}
      >
        {children} {/* Text or element inside the button */}
      </button>
    </Link>
  );
}

export default PrimaryButton;
