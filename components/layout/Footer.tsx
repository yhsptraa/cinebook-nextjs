
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="footer-container">

      <Link href="#" className="">
        Cine<span className="">Book</span>
      </Link>

      <div id="social-media-container">
        <button
          id="instagram-button"
          className=""
          type="button"
        >
          <i className="fa-brands fa-instagram"></i>
        </button>

        <button
          id="tiktok-button"
          className=""
          type="button"
        >
          <i className="fa-brands fa-tiktok"></i>
        </button>

        <button
          id="youtube-button"
          className=""
          type="button"
        >
          <i className="fa-brands fa-youtube"></i>
        </button>

        <button
          id="twitter-button"
          className=""
          type="button"
        >
          <i className="fa-brands fa-x-twitter"></i>
        </button>

        <button
          id="facebook-button"
          className=""
          type="button"
        >
          <i className="fa-brands fa-facebook"></i>
        </button>
      </div>

      <div id="footer-menu-container">
        <Link href="#">About Us</Link>
        <Link href="#">FAQ</Link>
        <Link href="#">Privacy Management</Link>
        <Link href="#">Contact Us</Link>
      </div>

      <p id="copyright">
        &copy; 2026 Cinebook
      </p>

    </footer>
  );
}
