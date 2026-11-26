import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="footer-container"
      className="bottom-0 bg-[var(--color-primary)] p-4 text-[var(--color-on-primary)]"
    >
      <Link
        href="#"
        className="logo text-[var(--color-on-primary)]"
      >
        Cine<span>Book</span>
      </Link>

      <div
        id="social-media-container"
        className="my-6 mb-3 flex flex-row flex-nowrap gap-2.5"
      >
        <button
          id="instagram-button"
          className="social-media-button border-none bg-transparent text-xl text-[var(--color-accent)] transition-colors hover:text-[var(--color-on-primary)]"
          type="button"
        >
          <i className="fa-brands fa-instagram"></i>
        </button>

        <button
          id="tiktok-button"
          className="social-media-button border-none bg-transparent text-xl text-[var(--color-accent)] transition-colors hover:text-[var(--color-on-primary)]"
          type="button"
        >
          <i className="fa-brands fa-tiktok"></i>
        </button>

        <button
          id="youtube-button"
          className="social-media-button border-none bg-transparent text-xl text-[var(--color-accent)] transition-colors hover:text-[var(--color-on-primary)]"
          type="button"
        >
          <i className="fa-brands fa-youtube"></i>
        </button>

        <button
          id="twitter-button"
          className="social-media-button border-none bg-transparent text-xl text-[var(--color-accent)] transition-colors hover:text-[var(--color-on-primary)]"
          type="button"
        >
          <i className="fa-brands fa-x-twitter"></i>
        </button>

        <button
          id="facebook-button"
          className="social-media-button border-none bg-transparent text-xl text-[var(--color-accent)] transition-colors hover:text-[var(--color-on-primary)]"
          type="button"
        >
          <i className="fa-brands fa-facebook"></i>
        </button>
      </div>

      <div
        id="footer-menu-container"
        className="flex flex-col flex-nowrap gap-3 border-b border-[var(--color-accent)] pb-4"
      >
        <Link
          href="#"
          className="text-[var(--color-on-primary)] no-underline transition-colors hover:text-[var(--color-accent)]"
        >
          About Us
        </Link>

        <Link
          href="#"
          className="text-[var(--color-on-primary)] no-underline transition-colors hover:text-[var(--color-accent)]"
        >
          FAQ
        </Link>

        <Link
          href="#"
          className="text-[var(--color-on-primary)] no-underline transition-colors hover:text-[var(--color-accent)]"
        >
          Privacy Management
        </Link>

        <Link
          href="#"
          className="text-[var(--color-on-primary)] no-underline transition-colors hover:text-[var(--color-accent)]"
        >
          Contact Us
        </Link>
      </div>

      <p
        id="copyright"
        className="mt-5 text-[var(--color-primary-soft)]"
      >
        &copy; 2026 Cinebook
      </p>
    </footer>
  );
}