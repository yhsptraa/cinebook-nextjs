"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { movieData } from "@/data/movies";

type Movie = {
  id: number;
  title: string;
  poster: string;
  format: string;
  rating: string;
  duration: string;
  synopsis: string;
  price?: number;
  studio?: string;
};

type Showtime = {
    time: string;
    studio: string;
};

function ScheduleContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const movieId = Number(searchParams.get("id"));

    const allMovies: Movie[] = [
        ...(movieData?.trending || []),
        ...(movieData?.nowPlaying || []),
        ...(movieData?.comingSoon || []),
    ];

    const selectedMovie = allMovies.find(
        (movie) => movie.id === movieId
    );

    const dates = ["10 Nov", "11 Nov", "12 Nov", "13 Nov"];

    const assignedStudio = selectedMovie
        ? selectedMovie.studio || `Studio ${((selectedMovie.id - 1) % 6) + 1}`
        : "Studio 1";
    const showtimes: Showtime[] = [
        { time: "09:00", studio: assignedStudio },
        { time: "13:00", studio: assignedStudio },
        { time: "16:00", studio: assignedStudio },
        { time: "19:00", studio: assignedStudio },
    ];

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] =
        useState<Showtime | null>(null);

    const price = selectedMovie?.price || 50000;
    const handleNext = () => {
        if (!selectedMovie || !selectedDate || !selectedTime) {
            return;
        }

        const bookingData = {
            movieId: selectedMovie.id,
            movieTitle: selectedMovie.title,
            moviePrice: price,
            moviePoster: selectedMovie.poster,
            date: selectedDate,
            studio: selectedTime.studio,
            time: selectedTime.time,
        };

        localStorage.setItem(
            "cinebook_booking",
            JSON.stringify(bookingData)
        );
        router.push(`/bookings/seats?id=${selectedMovie.id}`);
    };

    if (!selectedMovie) {
        return (
            <main className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-3">
                        Movie not found
                    </h2>
                    <p className="text-gray-500 mb-6">
                        The movie you are looking for is unavailable.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main
            id="main-container"
            className="min-h-screen w-full">
            {/* Header */}
            <header
                id="header-container"
                className="w-full">
                <nav
                    id="navbar-container"
                    className="max-w-5xl mx-auto px-6 py-5">
                    <Link
                        href="/"
                        className="logo inline-block font-semibold hover:opacity-70 transition">
                        Back
                    </Link>
                </nav>
            </header>
            {/* Schedule Section */}
            <section className="schedule-section max-w-3xl mx-auto px-6 py-8">
                {/* Title */}
                <h2 className="page-title text-3xl font-bold mb-8">
                    Select schedule
                </h2>
                {/* Movie Summary Card */}
                <div className="movie-summary-card flex items-center gap-5 p-5 rounded-xl mb-10">
                    <img
                        id="movie-poster"
                        src={`/${selectedMovie.poster.replace(/^assets\//, "").replace(/^\/+/, "")}`}
                        alt={selectedMovie.title}
                        className="w-28 h-40 object-cover rounded-lg"
                    />
                    <div className="movie-info">
                        <h3
                            id="movie-title"
                            className="text-xl font-bold mb-2">
                            {selectedMovie.title}
                        </h3>
                        <p
                            id="movie-genre"
                            className="movie-genre text-sm mb-3">
                            {selectedMovie.rating || "R13+"}
                            {" • "}
                            {selectedMovie.duration || "120 min"}
                        </p>
                        <p className="movie-price text-sm">
                            Price:{" "}
                            <span
                                id="movie-price"
                                className="font-semibold">
                                Rp {price.toLocaleString("id-ID")}
                            </span>
                            {" / ticket"}
                        </p>
                    </div>
                </div>
                {/* Select Date */}
                <div className="option-group mb-8">
                    <p className="option-title font-semibold mb-4">
                        <i className="fa-regular fa-calendar mr-2"></i>
                        Select date
                    </p>
                    <div
                        id="date-list"
                        className="button-list flex flex-wrap gap-3">
                        {dates.map((date) => (
                            <button
                                key={date}
                                type="button"
                                className={`opt-btn px-5 py-3 rounded-lg border transition ${
                                    selectedDate === date
                                        ? "selected bg-blue-600 text-white border-blue-600"
                                        : "border-gray-300 hover:border-blue-500"
                                }`}
                                onClick={() => setSelectedDate(date)}>
                                {date}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Select Showtime */}
                <div className="option-group mb-10">

                    <p className="option-title font-semibold mb-4">
                        <i className="fa-regular fa-clock mr-2"></i>
                        Select showtime
                    </p>
                    <div
                        id="time-list"
                        className="button-list flex flex-wrap gap-3">
                        {showtimes.map((item) => (
                            <button
                                key={item.time}
                                type="button"
                                className={`opt-btn min-w-24 px-5 py-3 rounded-lg border transition ${
                                    selectedTime?.time === item.time
                                        ? "selected bg-blue-600 text-white border-blue-600"
                                        : "border-gray-300 hover:border-blue-500"
                                }`}
                                onClick={() => setSelectedTime(item)}>
                                <span className="block font-semibold">
                                    {item.time}
                                </span>
                                <small
                                    className={`text-xs ${
                                        selectedTime?.time === item.time
                                            ? "text-blue-100"
                                            : "text-gray-400"
                                    }`}>
                                    {item.studio}
                                </small>
                            </button>
                        ))}
                    </div>
                </div>
                {/* Proceed Button */}
                <button
                    id="next-button"
                    type="button"
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleNext}
                    className="submit-btn w-full py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                    Proceed to select seats
                    {" "}
                    <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>

            </section>
        </main>
    );
}

export default function SchedulesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ScheduleContent />
        </Suspense>
    );
}