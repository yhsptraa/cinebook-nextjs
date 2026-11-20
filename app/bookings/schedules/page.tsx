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
            <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6">
                <div className="text-center max-w-md">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 text-[#302326]">
                        Movie not found
                    </h2>
                    <p className="text-sm sm:text-base text-[#77666a] mb-6">
                        The movie you are looking for is unavailable.
                    </p>
                    <Link
                        href="/"
                        className="inline-block w-full sm:w-auto px-6 py-3 rounded-lg bg-[#8b1e3f] text-[#ffffff] hover:bg-[#701730] transition">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <section className="max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[#302326]">
                Select schedule
            </h2>
            {/* Movie Summary Card */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl mb-8 sm:mb-10 bg-[#ffffff] border border-[#e4d6d3] shadow-[0_0.35em_1.25em_rgba(75,37,46,0.14)]">
                <img
                    id="movie-poster"
                    src={`/${selectedMovie.poster.replace(/^assets\//, "").replace(/^\/+/, "")}`}
                    alt={selectedMovie.title}
                    className="w-24 h-36 sm:w-28 sm:h-40 object-cover rounded-lg shrink-0"
                />
                <div className="min-w-0">
                    <h3
                        id="movie-title"
                        className="text-lg sm:text-xl font-bold mb-2 text-[#302326]">
                        {selectedMovie.title}
                    </h3>
                    <p
                        id="movie-genre"
                        className="text-xs sm:text-sm mb-3 text-[#77666a]">
                        {selectedMovie.rating || "R13+"}
                        {" • "}
                        {selectedMovie.duration || "120 min"}
                    </p>
                    <p className="text-xs sm:text-sm text-[#302326]">
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
            <div className="mb-7 sm:mb-8">
                <p className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-[#302326]">
                    Select date
                </p>
                <div
                    id="date-list"
                    className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3">
                    {dates.map((date) => (
                        <button
                            key={date}
                            type="button"
                            className={`px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border transition ${
                                selectedDate === date
                                    ? "bg-[#8b1e3f] text-[#ffffff] border-[#8b1e3f]"
                                    : "bg-[#ffffff] text-[#302326] border-[#e4d6d3] hover:border-[#c5afab]"
                            }`}
                            onClick={() => setSelectedDate(date)}>
                            {date}
                        </button>
                    ))}
                </div>
            </div>
            {/* Select Showtime */}
            <div className="mb-8 sm:mb-10">
                <p className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-[#302326]">
                    Select showtime
                </p>
                <div
                    id="time-list"
                    className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3">
                    {showtimes.map((item) => (
                        <button
                            key={item.time}
                            type="button"
                            className={`sm:min-w-24 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border transition text-left ${
                                selectedTime?.time === item.time
                                    ? "bg-[#8b1e3f] text-[#ffffff] border-[#8b1e3f]"
                                    : "bg-[#ffffff] text-[#302326] border-[#e4d6d3] hover:border-[#c5afab]"
                            }`}
                            onClick={() => setSelectedTime(item)}>
                            <span className="block text-sm sm:text-base font-semibold">
                                {item.time}
                            </span>
                            <small
                                className={`text-xs ${
                                    selectedTime?.time === item.time
                                        ? "text-[#f5dde5]"
                                        : "text-[#77666a]"
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
                className="w-full py-3.5 sm:py-4 text-sm sm:text-base rounded-lg font-semibold transition bg-[#8b1e3f] text-[#ffffff] hover:bg-[#701730] disabled:bg-[#f5eee6] disabled:text-[#a99b9e] disabled:cursor-not-allowed">
                Proceed to select seats
            </button>
        </section>
    );
}

export default function SchedulesPage() {
    return (
        <Suspense fallback={ 
            <div className="min-h-screen flex items-center justify-center text-[#77666a]">Loading...</div>
        }>
            <ScheduleContent />
        </Suspense>
    );
}