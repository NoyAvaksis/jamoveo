// src/components/PrimaryButton.jsx
import { Link } from "react-router-dom";

function PrimaryButton({ children, to, color = "pink" }) {
  return (
    <Link to={to}>
      <button
        className={`border-2 border-white text-white font-semibold py-2 px-5 rounded-full hover:bg-white hover:text-${color}-700 transition duration-300`}
      >
        {children}
      </button>
    </Link>
  );
}

export default PrimaryButton;
