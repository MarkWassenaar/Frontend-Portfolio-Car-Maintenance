import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [getToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
  }, []);

  return (
    <nav className="flex bg-white fixed top-0 max-h-18 shadow-xl items-center justify-between text-stone-500 w-full p-4 list-none">
      <div className="flex gap-6 items-center font-bold text-blue-400 text-2xl">
        <Link href="/">
          <img className="w-20 h-18" src="/logo.png" />
        </Link>
        <Link href="/">
          <h1>Pit Stop Pal</h1>
        </Link>
      </div>
      <ul className="flex gap-8 font-bold">
        <Link href="/">Home</Link>
        {getToken === null ? null : <Link href="/dashboard">Dashboard</Link>}
        {getToken === null ? <Link href="/register">Register</Link> : null}
        {getToken === null ? (
          <Link href="/login">Login</Link>
        ) : (
          <button
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
