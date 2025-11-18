import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="p-4 flex justify-around items-center">
      <div>Tripvisito</div>
      <ul className="flex space-x-4">
        <li>
          <Link to="/home" className=" text-black hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/login" className="text-black hover:underline">
            Login
          </Link>
        </li>
        <li>
          <Link to="/register" className="text-black hover:underline">
            Register
          </Link>
        </li>
      </ul>
      <div>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
