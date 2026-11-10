
import Link from "next/link";

export default function Navbar() {
  return (
    <header id="header-container">
      <nav id="navbar-container">

        <Link href="#" className="">
          Cine<span className="">Book</span>
        </Link>

        <div id="hamburger-menu-container" className="">

          <div id="close-button-container">
            <p className="">
              Cine<span className="">Book</span>
            </p>

            <button id="close-button" type="button">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div id="menu-container">
            <Link href="#now-playing-title" className="">
              NOW PLAYING
            </Link>

            <Link href="#coming-soon-title" className="">
              COMING SOON
            </Link>

            <Link href="/movies/transaction-history" className="">
              HISTORY
            </Link>
          </div>

          <div id="search-container">
            <button id="search-button" type="button">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            <input
              type="text"
              placeholder="Search"
              id="input-box"
            />
          </div>

          <div id="auth-container">
            <Link href="/login">LOGIN</Link>
            <Link href="/register">REGISTER</Link>
          </div>

        </div>

        <button id="hamburger-button" type="button">
          <i className="fa-solid fa-bars"></i>
        </button>

      </nav>
    </header>
  );
}
