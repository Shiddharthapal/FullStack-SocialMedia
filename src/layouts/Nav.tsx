import { useAppSelector } from "../redux/hooks";
import { useEffect, useMemo, useState } from "react";

interface UserDetails {
  _id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
}

export default function Navbar() {
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const id = user?._id;

  useEffect(() => {
    if (!id) {
      setUserData(null);
      return;
    }

    const fetchData = async () => {
      const response = await fetch(`/api/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return;
      }

      const result = await response.json();
      setUserData(result.userdetails);
    };

    fetchData();
  }, [id]);

  const initials = useMemo(() => {
    if (!userData?.name) {
      return "U";
    }

    return userData.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [userData?.name]);

  return (
    <div className="h-14 w-full bg-[#f8f8f8]">
      <div className="mx-auto flex h-full w-full items-center justify-between gap-2 px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9">
            <svg
              viewBox="0 0 40 40"
              width="40"
              height="40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke="#2a9d6e"
                strokeWidth="3"
                fill="white"
              />
              <circle
                cx="20"
                cy="20"
                r="11"
                stroke="#2a9d6e"
                strokeWidth="3"
                fill="white"
              />
              <path
                d="M20 26 C20 26 13 21 13 16.5 C13 14 15 12 17.5 12 C18.8 12 20 13 20 13 C20 13 21.2 12 22.5 12 C25 12 27 14 27 16.5 C27 21 20 26 20 26Z"
                fill="#2a9d6e"
              />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-800 sm:text-2xl">
            Donezo
          </span>
        </div>

        <div className="hidden w-52 items-center gap-2 rounded-full border border-gray-100 bg-white px-3 py-2 shadow-sm md:flex lg:w-64">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="flex-1 text-sm text-gray-400">Search task</span>
          <span className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-400">
            Ctrl+F
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm md:hidden">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm sm:flex">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect
                x="2"
                y="4"
                width="20"
                height="16"
                rx="3"
                strokeWidth="1.8"
              />
              <path d="m2 7 10 7 10-7" strokeWidth="1.8" />
            </svg>
          </button>

          <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm sm:flex">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M13.73 21a2 2 0 0 1-3.46 0"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="ml-1 flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-semibold text-[#4b311b] sm:h-10 sm:w-10">
              {initials}
            </div>
            <div className="min-w-0">
              <span className="block truncate text-xs font-semibold leading-tight text-gray-800 sm:text-sm">
                {userData ? userData.name : "Loading..."}
              </span>
              <span className="hidden truncate text-xs text-gray-400 sm:block">
                {userData ? userData.email : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
