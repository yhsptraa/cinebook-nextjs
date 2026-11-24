
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type TransactionRecord = {
  id: string;
  userId: string;
  movieId: number | null;
  movieTitle: string;
  moviePoster?: string;
  cinema: string;
  studio: string;
  date: string;
  time: string;
  seats: string[];
  ticketPrice: number;
  subtotal: number;
  serviceFee: number;
  paymentMethod: string;
  grandTotal: number;
  status: string;
  createdAt: string;
  paidAt: string;
};

function TransactionDetailsContent() {
  const searchParams = useSearchParams();
  const queryTrxId = searchParams.get("id");

  const [checkedStorage, setCheckedStorage] = useState(false);
  const [transaction, setTransaction] = useState<TransactionRecord | null>(
    null
  );
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem("cinebook_transactions");
        const list: TransactionRecord[] = raw ? JSON.parse(raw) : [];
        if (Array.isArray(list) && list.length > 0) {
          if (queryTrxId) {
            const matched = list.find((item) => item.id === queryTrxId);
            setTransaction(matched || null);
          } else {
            setTransaction(list[list.length - 1]);
          }
        } else {
          setTransaction(null);
        }
      } catch {
        setTransaction(null);
      } finally {
        setCheckedStorage(true);
      }
    });
  }, [queryTrxId]);

  const showPopup = (message: string) => {
    setPopupMessage(message);
    window.setTimeout(() => {
      setPopupMessage((prev) => (prev === message ? null : prev));
    }, 2500);
  };

  const handleCopyCode = async () => {
    if (!transaction) return;
    try {
      await navigator.clipboard.writeText(transaction.id);
      showPopup(`Transaction code ${transaction.id} copied`);
    } catch {
      showPopup(`Transaction code: ${transaction.id}`);
    }
  };

  if (!checkedStorage) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-[#77666a]">
        Loading...
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-md p-6 rounded-xl bg-[#ffffff] border border-[#e4d6d3] shadow-[0_0.35em_1.25em_rgba(75,37,46,0.14)]">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-[#302326]">
            Transaction not found
          </h2>
          <p className="text-sm sm:text-base text-[#77666a] mb-6">
            No completed booking transaction was found yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/movies/transaction-history"
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold bg-[#8b1e3f] text-[#ffffff] hover:bg-[#701730] transition"
            >
              Transaction history
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold border border-[#e4d6d3] text-[#302326] hover:border-[#c5afab] transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const posterSrc = transaction.moviePoster
    ? `/${transaction.moviePoster.replace(/^assets\//, "").replace(/^\/+/, "")}`
    : "";

  const formattedDateTime = transaction.paidAt
    ? new Date(transaction.paidAt).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

  return (
    <section className="max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="mb-4 sm:mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#77666a] hover:text-[#8b1e3f] transition"
        >
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="p-5 sm:p-6 lg:p-8 rounded-xl bg-[#ffffff] border border-[#e4d6d3] shadow-[0_0.35em_1.25em_rgba(75,37,46,0.14)]">
        {/* Top Status & Transaction ID */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-[#e4d6d3]">
          <div>
            <p className="text-xs text-[#77666a] mb-1">Transaction details</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#302326]">
              Booking confirmed
            </h2>
          </div>
          <span className="w-fit px-3 py-1 rounded-full text-xs font-semibold bg-[#f5dde5] text-[#8b1e3f]">
            {transaction.status || "PAID"}
          </span>
        </div>

        {/* Transaction Code Box */}
        <div className="mt-5 p-3.5 sm:p-4 rounded-lg bg-[#f5eee6] border border-[#e4d6d3] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-[#77666a]">Booking Code</p>
            <p className="text-sm sm:text-base font-bold text-[#302326] break-all">
              {transaction.id}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#ffffff] text-[#8b1e3f] border border-[#e4d6d3] hover:border-[#8b1e3f] transition shrink-0"
          >
            Copy code
          </button>
        </div>

        {/* Movie & Schedule Summary */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
          {posterSrc ? (
            <img
              src={posterSrc}
              alt={transaction.movieTitle}
              className="w-24 h-36 sm:w-28 sm:h-40 object-cover rounded-lg shrink-0"
            />
          ) : (
            <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-lg bg-[#f5eee6] border border-[#e4d6d3] flex items-center justify-center text-xs text-[#77666a] shrink-0">
              No Poster
            </div>
          )}

          <div className="min-w-0 space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-[#302326]">
              {transaction.movieTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#77666a]">
              {`${transaction.cinema || "CineBook Central"} • ${transaction.studio}`}
            </p>
            <p className="text-xs sm:text-sm text-[#77666a]">
              {`${transaction.date} • ${transaction.time}`}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-[#302326]">
              {`Seats: ${Array.isArray(transaction.seats) ? transaction.seats.join(", ") : "-"}`}
            </p>
          </div>
        </div>

        <hr className="my-6 border-[#e4d6d3]" />

        {/* Payment & Price Breakdown */}
        <div className="space-y-3 text-sm sm:text-base mb-7">
          <div className="flex items-center justify-between text-[#77666a]">
            <span>Payment method</span>
            <span className="font-medium text-[#302326]">
              {transaction.paymentMethod || "QRIS"}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#77666a]">
            <span>Paid at</span>
            <span className="font-medium text-[#302326]">
              {formattedDateTime}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#77666a]">
            <span>
              Ticket price ({Array.isArray(transaction.seats) ? transaction.seats.length : 0}x)
            </span>
            <span className="font-medium text-[#302326]">
              Rp {(transaction.ticketPrice || 0).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#77666a]">
            <span>Service fee</span>
            <span className="font-medium text-[#302326]">
              Rp {(transaction.serviceFee || 0).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[#e4d6d3] text-base sm:text-lg font-bold text-[#302326]">
            <span>Total paid</span>
            <span className="text-[#8b1e3f]">
              Rp {(transaction.grandTotal || 0).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/movies/transaction-history"
            className="w-full sm:flex-1 py-3.5 sm:py-4 text-center text-sm sm:text-base rounded-lg font-semibold transition bg-[#8b1e3f] text-[#ffffff] hover:bg-[#701730]"
          >
            View transaction history
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 sm:py-4 text-center text-sm sm:text-base rounded-lg font-semibold transition bg-[#ffffff] text-[#302326] border border-[#e4d6d3] hover:border-[#c5afab]"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Pop-up Notification */}
      {popupMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-xs sm:max-w-sm px-4 py-3 rounded-xl bg-[#302326] text-[#ffffff] text-xs sm:text-sm font-medium shadow-[0_0.35em_1.25em_rgba(75,37,46,0.25)] border border-[#c49338]/40"
        >
          {popupMessage}
        </div>
      )}
    </section>
  );
}

export default function TransactionDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-[#77666a]">
          Loading...
        </div>
      }
    >
      <TransactionDetailsContent />
    </Suspense>
  );
}
