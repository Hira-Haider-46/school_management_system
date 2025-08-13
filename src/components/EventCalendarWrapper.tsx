import EventCalendarContainer from "./EventCalendarContainer";
import EventList from "./EventList";

const EventCalendarWrapper = async ({
  searchParams,
}: {
  searchParams: Promise<{ [keys: string]: string | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const { date } = resolvedSearchParams;

  return (
    <div className="flex flex-col gap-4">
      <EventCalendarContainer />
      <EventList dateParam={date} />
    </div>
  );
};

export default EventCalendarWrapper;