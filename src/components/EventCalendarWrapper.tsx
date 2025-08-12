import EventCalendarContainer from "./EventCalendarContainer";
import EventList from "./EventList";

const EventCalendarWrapper = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;

  return (
    <div className="flex flex-col gap-4">
      <EventCalendarContainer />
      <EventList dateParam={date} />
    </div>
  );
};

export default EventCalendarWrapper;