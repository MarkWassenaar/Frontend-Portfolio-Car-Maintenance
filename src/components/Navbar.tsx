import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [getToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
  }, []);

  return (
    <nav className="navigation">
      <Link href={`/`}>
        <strong>The Auction House</strong>
      </Link>
      <ul className="link">
        <Link className="link-items" href="/">
          Home
        </Link>
        {getToken === null ? null : (
          <Link className="link-items" href="/my-items">
            My Items
          </Link>
        )}
        {getToken === null ? (
          <Link className="link-items" href="/register">
            Register
          </Link>
        ) : null}
        {getToken === null ? (
          <Link className="link-items" href="/login">
            Login
          </Link>
        ) : (
          <button
            onClick={() => {
              setToken(null);
              localStorage.removeItem("token");
              location.reload();
            }}
          >
            Log out
          </button>
        )}
      </ul>
    </nav>
  );
};
export default Navbar;
