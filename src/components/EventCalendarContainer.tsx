"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const ClientCalendar = dynamic(() => import("./EventCalendar"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
  ),
});

const EventCalendarContainer = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <ClientCalendar />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
    </div>
  );
};

export default EventCalendarContainer;