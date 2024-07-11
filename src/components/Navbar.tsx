import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [getToken, setToken] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    const typeFromStorage = localStorage.getItem("type");
    setToken(tokenFromStorage);
    setType(typeFromStorage);
  }, []);

  return (
    <nav className="flex bg-white z-30 fixed top-0 max-h-18 shadow-lg items-center justify-between text-stone-500  w-full p-4 list-none">
      <div className="flex gap-6 items-center font-bold text-custom-blue text-2xl">
        <Link href="/">
          <img className="w-20 h-18" src="/logo.png" />
        </Link>
        <Link href="/">
          <h1>Pit Stop Pal</h1>
        </Link>
      </div>
      <ul className="flex gap-8 font-bold">
        {/* <div className="font-thin text-sm">
          {getToken && type === "user" && <p>logged in as user </p>}
          {getToken && type === "garage" && <p>logged in as garage </p>}
        </div> */}
        <Link className="hover:text-custom-blue" href="/">
          Home
        </Link>

        {getToken !== null && type === "user" && (
          <Link className="hover:text-custom-blue" href="/dashboard">
            Dashboard
          </Link>
        )}
        {getToken !== null && type === "garage" && (
          <Link className="hover:text-custom-blue" href="/userjobs">
            Search jobs
          </Link>
        )}
        {getToken !== null && type === "garage" && (
          <Link className="hover:text-custom-blue" href="/garage">
            Bid overview
          </Link>
        )}
        {getToken === null ? (
          <Link className="hover:text-custom-blue" href="/register">
            Register
          </Link>
        ) : null}
        {getToken === null ? (
          <Link className="hover:text-custom-blue" href="/login">
            Login
          </Link>
        ) : (
          <button
            className="hover:text-custom-blue"
            onClick={() => {
              setToken(null);
              localStorage.removeItem("token");
              localStorage.removeItem("type");
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
