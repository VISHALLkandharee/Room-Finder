import { Link } from "react-router-dom";
import { useAuthContext } from "../context/auth";
const Navbar = () => {
  const { signOut } = useAuthContext();

  return (
    <div className="bg-white shadow-emerald-200 mb-1">
      <nav className="mx-auto px-4 py-3 flex justify-between items-center gap-2.5">
        <Link to={'/'} className="text-purple-600 font-bold ">Room Finder</Link>
        <div> 
          <Link to="/add-room" className="mx-2">
            AddRoom
          </Link>
          <Link to="/my-rooms" className="mx-2">
            My Rooms
          </Link>
          <button
            onClick={signOut}
            className="text-gray-700 hover:text-red-600 transition-colors bg-red-300 rounded-md px-3 py-1 ml-4"
          >Sign Out</button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
