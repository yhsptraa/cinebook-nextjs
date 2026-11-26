"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      id="header-container"
      className="sticky top-0 z-[9]"
    >
      <nav
        id="navbar-container"
        className="
          flex flex-row flex-nowrap items-center justify-between
          bg-[var(--color-surface)]
          px-6 py-4
          border-b-2 border-[var(--color-border)]
        "
      >
        <Link
          href="/"
          className="
            logo no-underline
            text-[var(--color-primary)]
            text-2xl font-light
            font-[var(--font-lora)]
            md:text-[1.65em]
            lg:text-[1.8em]
          "
        >
          Cine<span className="logo-span font-semibold text-[var(--color-accent)]">
            Book
          </span>
        </Link>

        <div
          id="hamburger-menu-container"
          className={`
            fixed top-0 left-0 z-10
            flex h-screen w-screen flex-col gap-4
            bg-[var(--color-surface)]
            p-4
            transition-[transform,opacity,visibility]
            duration-300
            ${
              isMenuOpen
                ? "translate-x-0 opacity-100 visible pointer-events-auto delay-0"
                : "translate-x-full opacity-0 invisible pointer-events-none delay-300"
            }

            md:static md:h-auto md:w-auto
            md:translate-x-0 md:visible md:opacity-100
            md:pointer-events-auto md:delay-0
            md:flex-row md:items-center
            md:transition-none md:p-0
            lg:pr-4
          `}
        >
          <div
            id="close-button-container"
            className="
              mb-5 flex w-full items-center justify-between
              pr-2
              md:hidden
            "
          >
            <p className="font-[var(--font-lora)] text-xl font-light text-[var(--color-primary)]">
              Cine<span className="font-semibold text-[var(--color-accent)]">
                Book
              </span>
            </p>

            <button
              id="close-button"
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="
                border-none bg-[var(--color-surface)]
                text-2xl text-[var(--color-primary)]
              "
              aria-label="Close menu"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div
            id="menu-container"
            className="
              flex flex-col gap-4 text-xl
              md:flex-row md:items-center md:justify-center
              md:text-[0.8em]
            "
          >
            <Link
              href="/#now-playing-title"
              onClick={() => setIsMenuOpen(false)}
              className="
                border-b border-[var(--color-border)] pb-2
                text-[var(--color-text-primary)] no-underline
                hover:text-[var(--color-primary)]
                md:border-none md:p-0
                md:text-[var(--color-primary)]
                md:text-[1.1em]
                lg:text-[1.3em]
              "
            >
              NOW PLAYING
            </Link>

            <Link
              href="/#coming-soon-title"
              onClick={() => setIsMenuOpen(false)}
              className="
                border-b border-[var(--color-border)] pb-2
                text-[var(--color-text-primary)] no-underline
                hover:text-[var(--color-primary)]
                md:border-none md:p-0
                md:text-[var(--color-primary)]
                md:text-[1.1em]
                lg:text-[1.3em]
              "
            >
              COMING SOON
            </Link>

            <Link
              href="/movies/transaction-history"
              onClick={() => setIsMenuOpen(false)}
              className="
                border-b border-[var(--color-border)] pb-2
                text-[var(--color-text-primary)] no-underline
                hover:text-[var(--color-primary)]
                md:border-none md:p-0
                md:text-[var(--color-primary)]
                md:text-[1.1em]
                lg:text-[1.3em]
              "
            >
              HISTORY
            </Link>

            <Link
              href="/foods"
              onClick={() => setIsMenuOpen(false)}
              className="
                border-b border-[var(--color-border)] pb-2
                text-[var(--color-text-primary)] no-underline
                hover:text-[var(--color-primary)]
                md:border-none md:p-0
                md:text-[var(--color-primary)]
                md:text-[1.1em]
                lg:text-[1.3em]
              "
            >
              FOODS & BEVERAGE
            </Link>

            <Link
              href="/cinemas"
              onClick={() => setIsMenuOpen(false)}
              className="
                border-b border-[var(--color-border)] pb-2
                text-[var(--color-text-primary)] no-underline
                hover:text-[var(--color-primary)]
                md:border-none md:p-0
                md:text-[var(--color-primary)]
                md:text-[1.1em]
                lg:text-[1.3em]
              "
            >
              CINEMAS
            </Link>
          </div>

          <div
            id="search-container"
            className="
              hidden
              md:flex md:flex-row md:items-center md:justify-center
              md:gap-2
              md:rounded-full md:border md:border-black
              md:px-2 md:py-1.5
            "
          >
            <button
              id="search-button"
              type="button"
              className="md:[all:unset]"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            <input
              type="text"
              placeholder="Search"
              id="input-box"
              className="
                md:w-24 md:border-none md:outline-none
                lg:text-xl
              "
            />
          </div>

          <div
            id="auth-container"
            className="
              flex flex-col gap-4 text-xl
              md:flex-row md:items-center md:justify-center
              md:text-[0.8em]
            "
          >
            <Link
              href="/login"
              className="
                border-b border-[var(--color-border)] pb-2
                text-[var(--color-text-primary)] no-underline
                hover:text-[var(--color-primary)]
                md:border-none md:p-0
                md:text-[var(--color-primary)]
                md:text-[1.1em]
                lg:text-[1.3em]
              "
            >
              LOGIN
            </Link>

            <Link
              href="/register"
              className="
                border-b border-[var(--color-border)] pb-2
                text-[var(--color-text-primary)] no-underline
                hover:text-[var(--color-primary)]
                md:border-none md:p-0
                md:text-[var(--color-primary)]
                md:text-[1.1em]
                lg:text-[1.3em]
              "
            >
              REGISTER
            </Link>
          </div>
        </div>

        <button
          id="hamburger-button"
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="
            border-none bg-transparent
            text-2xl text-[var(--color-primary)]
            md:hidden
          "
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </nav>
    </header>
  );
}