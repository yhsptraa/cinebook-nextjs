"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type BookingData = {
  movieId: number;
  movieTitle: string;
  moviePrice: number;
  moviePoster?: string;
  date: string;
  studio: string;
  time: string;
  seats?: string[];
  totalPrice?: number;
};

const ROWS = ["A", "B", "C", "D", "E"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const OCCUPIED_SEATS = ["B3", "B4", "D9", "D10"];

function SeatsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryMovieId = Number(searchParams.get("id"));
    const [bookingData] = useState<BookingData | null>(() => {
    try {
        const raw = localStorage.getItem("cinebook_booking");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
    });
    const [selectedSeats, setSelectedSeats] = useState<string[]>(
    () => bookingData?.seats || []
    );
    const handleToggleSeat = (seatId: string) => {
        if (OCCUPIED_SEATS.includes(seatId)) return;
        setSelectedSeats((prev) =>
        prev.includes(seatId)
            ? prev.filter((id) => id !== seatId)
            : [...prev, seatId]
        );
    };
    const totalPrice = bookingData? selectedSeats.length * (bookingData.moviePrice || 50000): 0;
    const handleNext = () => {
        if (!bookingData || selectedSeats.length === 0) return;
        const finalBooking: BookingData = {
            ...bookingData,
            seats: selectedSeats,
            totalPrice,
        };
        localStorage.setItem("cinebook_booking", JSON.stringify(finalBooking));
        const targetId = bookingData.movieId || queryMovieId || "";
        router.push(
            targetId ? `/bookings/checkout?id=${targetId}` : "/bookings/checkout"
        );
    };
    if (!bookingData) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-3 text-[#302326]">
                    Schedule not found
                </h2>
                <p className="text-[#77666a] mb-6">
                    Schedule data not found. Please select a movie and schedule again
                </p>
                <Link
                    href={queryMovieId ? `/bookings/schedules?id=${queryMovieId}` : "/"}
                    className="inline-block px-6 py-3 rounded-lg bg-[#8b1e3f] text-[#ffffff] hover:bg-[#701730] transition">
                    Back to schedule
                </Link>
                </div>
            </div>
        );
    }
    const backToScheduleHref = bookingData.movieId
        ? `/bookings/schedules?id=${bookingData.movieId}`
        : queryMovieId
        ? `/bookings/schedules?id=${queryMovieId}`
        : "/";
    return (
        <section className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-6">
                <Link
                    href={backToScheduleHref}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#77666a] hover:text-[#8b1e3f] transition">
                    <span>Back to schedule</span>
                </Link>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-[#302326]">
                Select an available seat
            </h2>
            {/* Booking Summary Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl mb-8 bg-[#ffffff] border border-[#e4d6d3] shadow-[0_0.35em_1.25em_rgba(75,37,46,0.14)]">
                <div>
                    <h3 id="summary-title" className="text-lg font-bold text-[#302326]">
                    {bookingData.movieTitle}
                    </h3>
                    <p id="summary-info" className="text-sm text-[#77666a]">
                    {`${bookingData.studio}   ${bookingData.date}   ${bookingData.time}`}
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-xs text-[#77666a] mb-1">Selected Seats</p>
                        <p id="summary-seats" className="font-semibold text-[#302326]">
                            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-[#77666a] mb-1">Total Price</p>
                        <p id="summary-total-price" className="font-bold text-base text-[#8b1e3f]">
                            Rp {totalPrice.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
            </div>
            {/* Screen */}
            <div className="mb-8 max-w-2xl mx-auto">
                <div className="w-full py-2 rounded-t-xl bg-[#f5eee6] border-b-4 border-[#c5afab] text-center text-xs font-semibold tracking-widest text-[#77666a]">
                SCREEN
                </div>
            </div>
            {/* Seats Grid */}
            <div className="overflow-x-auto pb-4 mb-6">
                <div
                    id="seats-grid"
                    className="w-fit mx-auto grid grid-cols-[repeat(6,2.25rem)_1.5rem_repeat(6,2.25rem)] gap-2 items-center">
                    {ROWS.map((row) =>
                        COLS.map((col, index) => {
                        const seatId = `${row}${col}`;
                        const isOccupied = OCCUPIED_SEATS.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        const seatButton = (
                            <button
                                key={seatId}
                                type="button"
                                disabled={isOccupied}
                                onClick={() => handleToggleSeat(seatId)}
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-md text-xs font-semibold border transition ${
                                    isOccupied
                                    ? "bg-[#f5eee6] text-[#a99b9e] border-[#e4d6d3] cursor-not-allowed"
                                    : isSelected
                                    ? "bg-[#8b1e3f] text-[#ffffff] border-[#8b1e3f]"
                                    : "bg-[#ffffff] text-[#302326] border-[#c5afab] hover:border-[#8b1e3f]"
                                }`}>
                                {seatId}
                            </button>
                        );
                        if (index === 6) {
                            return (
                                <div key={`aisle-and-${seatId}`} className="contents">
                                <div aria-hidden="true" className="w-6 h-9" />
                                {seatButton}
                                </div>
                            );
                        }
                        return seatButton;
                        })
                    )}
                </div>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#77666a] mb-8">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded border border-[#c5afab] bg-[#ffffff] inline-block" />
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#8b1e3f] inline-block" />
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded border border-[#e4d6d3] bg-[#f5eee6] inline-block" />
                    <span>Occupied</span>
                </div>
            </div>
            {/* Proceed Button */}
            <button
                id="next-checkout-btn"
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={handleNext}
                className="w-full py-4 rounded-lg font-semibold transition bg-[#8b1e3f] text-[#ffffff] hover:bg-[#701730] disabled:bg-[#f5eee6] disabled:text-[#a99b9e] disabled:cursor-not-allowed">
                Proceed to checkout
            </button>
        </section>
    );
}

export default function SeatsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[70vh] flex items-center justify-center text-[#77666a]">
                    Loading...
                </div>
            }>
            <SeatsContent />
        </Suspense>
    );
}