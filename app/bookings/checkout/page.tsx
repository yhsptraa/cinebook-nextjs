"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type BookingData = {
  movieId?: number | null;
  movieTitle: string;
  moviePrice: number;
  moviePoster?: string;
  cinema?: string;
  date: string;
  studio: string;
  time: string;
  seats: string[];
  totalPrice?: number;
};
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
  status: "PAID";
  createdAt: string;
  paidAt: string;
};
const SERVICE_FEE = 5000;

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryMovieId = searchParams.get("id");
    const [checkedStorage, setCheckedStorage] = useState(false);
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "Transfer Bank">("QRIS");
    const [transactionSaved, setTransactionSaved] = useState(false);
    useEffect(() => {
        queueMicrotask(() => {
            try {
                const userId = sessionStorage.getItem("currentUserId");
                const rawBooking = localStorage.getItem("cinebook_booking");
                const parsedBooking: BookingData | null = rawBooking
                ? JSON.parse(rawBooking)
                : null;
                setCurrentUserId(userId);
                setBookingData(parsedBooking);
            } catch {
                setCurrentUserId(null);
                setBookingData(null);
            } finally {
                setCheckedStorage(true);
            }
        });
    }, []);
    if (!checkedStorage) {
        return (
        <div className="min-h-[70vh] flex items-center justify-center text-[#77666a]">
            Loading...
        </div>
        );
    }
    if (
        !bookingData ||
        !Array.isArray(bookingData.seats) ||
        bookingData.seats.length === 0
    ) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6">
                <div className="text-center max-w-md p-6 rounded-xl bg-[#ffffff] border border-[#e4d6d3] shadow-[0_0.35em_1.25em_rgba(75,37,46,0.14)]">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 text-[#302326]">
                        Booking data not found
                    </h2>
                    <p className="text-sm sm:text-base text-[#77666a] mb-6">
                        Booking data not found. Please select the movie and seats again
                    </p>
                    <Link
                        href="/"
                        className="inline-block w-full sm:w-auto px-6 py-3 rounded-lg font-semibold bg-[#8b1e3f] text-[#ffffff] hover:bg-[#701730] transition">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const backToSeatsHref = bookingData?.movieId
        ? `/bookings/seats?id=${bookingData.movieId}`
        : queryMovieId
        ? `/bookings/seats?id=${queryMovieId}`
        : "/bookings/seats";
    const ticketCount = bookingData?.seats?.length || 0;
    const ticketPrice = bookingData?.moviePrice || 50000;
    const subtotal = bookingData?.totalPrice || ticketCount * ticketPrice;
    const grandTotal = subtotal + SERVICE_FEE;
    const posterSrc = bookingData?.moviePoster
        ? `/${bookingData.moviePoster.replace(/^assets\//, "").replace(/^\/+/, "")}`
        : "";
    const handleConfirmPayment = () => {
        if (transactionSaved || !bookingData) return;
        // TODO: Navigasi ke halaman login jika user belum login
        const transactionTime = new Date().toISOString();
        const transaction: TransactionRecord = {
            id: `TRX-CB-${Date.now()}`,
            userId: currentUserId || "guest", // TODO: Mengganti guest jika login sudah terimplementasi 
            movieId: bookingData.movieId ?? null,
            movieTitle: bookingData.movieTitle,
            moviePoster: bookingData.moviePoster,
            cinema: bookingData.cinema || "CineBook Central",
            studio: bookingData.studio,
            date: bookingData.date,
            time: bookingData.time,
            seats: bookingData.seats,
            ticketPrice,
            subtotal,
            serviceFee: SERVICE_FEE,
            paymentMethod,
            grandTotal,
            status: "PAID",
            createdAt: transactionTime,
            paidAt: transactionTime,
        };
        let transactions: TransactionRecord[] = [];
        try {
            const storedTransactions = JSON.parse(
                localStorage.getItem("cinebook_transactions") || "[]"
            );
            transactions = Array.isArray(storedTransactions) ? storedTransactions : [];
        } catch {
            transactions = [];
        }

        transactions.push(transaction);
        localStorage.setItem("cinebook_transactions", JSON.stringify(transactions));
        localStorage.removeItem("cinebook_booking");
        setTransactionSaved(true);
        router.push("/bookings/transaction_details");
    };
    return (
        <section className="max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            <div className="mb-4 sm:mb-6">
                <Link
                    href={backToSeatsHref}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#77666a] hover:text-[#8b1e3f] transition">
                    <span>Back to seats</span>
                </Link>
            </div>
            <div className="p-5 sm:p-6 lg:p-8 rounded-xl bg-[#ffffff] border border-[#e4d6d3] shadow-[0_0.35em_1.25em_rgba(75,37,46,0.14)]">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#302326]">
                        Checkout booking
                    </h2>
                </div>
                {/* Movie Summary */}
                {bookingData && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                    {posterSrc ? (
                        <img
                            id="checkout-poster"
                            src={posterSrc}
                            alt={bookingData.movieTitle || "Poster"}
                            className="w-24 h-36 sm:w-28 sm:h-40 object-cover rounded-lg shrink-0"
                        />
                    ) : (
                        <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-lg bg-[#f5eee6] border border-[#e4d6d3] flex items-center justify-center text-xs text-[#77666a] shrink-0">
                            No Poster
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3
                            id="checkout-title"
                            className="text-lg sm:text-xl font-bold mb-1.5 text-[#302326]">
                            {bookingData.movieTitle}
                        </h3>
                        <p
                            id="checkout-schedule"
                            className="text-xs sm:text-sm mb-1.5 text-[#77666a]">
                            {`${bookingData.studio}   ${bookingData.date}   ${bookingData.time}`}
                        </p>
                        <p
                            id="checkout-seats"
                            className="text-xs sm:text-sm font-medium text-[#302326]">
                            {`Seats: ${bookingData.seats.join(", ")}`}
                        </p>
                    </div>
                </div>
                )}
                <hr className="my-6 border-[#e4d6d3]" />
                {/* Price Details */}
                <div className="space-y-3 text-sm sm:text-base mb-6">
                    <div className="flex items-center justify-between text-[#77666a]">
                        <span>
                            Ticket price (<span id="ticket-count">{ticketCount}</span>x)
                        </span>
                        <span id="subtotal-price" className="font-medium text-[#302326]">
                            Rp {subtotal.toLocaleString("id-ID")}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-[#77666a]">
                        <span>Service fee</span>
                        <span id="service-fee" className="font-medium text-[#302326]">
                            Rp {SERVICE_FEE.toLocaleString("id-ID")}
                        </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#e4d6d3] text-base sm:text-lg font-bold text-[#302326]">
                        <span>Total payment</span>
                        <span id="grand-total" className="text-[#8b1e3f]">
                            Rp {grandTotal.toLocaleString("id-ID")}
                        </span>
                    </div>
                </div>
                {/* Payment Method */}
                <div className="mb-7 sm:mb-8">
                    <h4 className="text-sm sm:text-base font-semibold mb-3 text-[#302326]">
                        Payment method
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(["QRIS", "Transfer Bank"] as const).map((method) => {
                            const active = paymentMethod === method;
                            return (
                                <label
                                key={method}
                                className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition ${
                                    active
                                    ? "bg-[#f5dde5]/40 border-[#8b1e3f] text-[#302326]"
                                    : "bg-[#ffffff] border-[#e4d6d3] text-[#302326] hover:border-[#c5afab]"
                                }`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method}
                                    checked={active}
                                    onChange={() => setPaymentMethod(method)}
                                    className="accent-[#8b1e3f]"
                                />
                                <span className="text-sm sm:text-base font-medium">
                                    {method}
                                </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
                {/* Pay Button */}
                <button
                    id="pay-button"
                    type="button"
                    disabled={transactionSaved}
                    onClick={handleConfirmPayment}
                    className="w-full py-3.5 sm:py-4 text-sm sm:text-base rounded-lg font-semibold transition bg-[#8b1e3f] text-[#ffffff] hover:bg-[#701730] disabled:bg-[#f5eee6] disabled:text-[#a99b9e] disabled:cursor-not-allowed">
                    {transactionSaved ? "Payment successful" : "Payment confirmation"}
                </button>
            </div>
        </section>
    );
}

export default function CheckoutPage() {
  return (
    <Suspense
        fallback={
            <div className="min-h-[70vh] flex items-center justify-center text-[#77666a]">
                Loading...
            </div>
        }>
        <CheckoutContent />
    </Suspense>
  );
}