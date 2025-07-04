import { Link } from "react-router";
import useAuth from "../hooks/authHook";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-slate-800 border-b border-slate-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-green-400 font-bold text-xl tracking-wide">
          QuickChat
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="text-white hover:text-green-400 transition"
            >
              {user.name}
            </Link>
            <button
              onClick={logout}
              className="text-slate-300 hover:text-red-400 text-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="text-slate-300 hover:text-green-400 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-slate-300 hover:text-green-400 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
