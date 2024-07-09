import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <Link to="/">
        <h1 className="text-2xl font-bold">Listo</h1>
      </Link>
    </div>
  );
}

export default Header;
