import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { format } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { getProductSchedule } from 'apis/product';
import ScheduleDialog from 'components/product/register/ScheduleDialog';
import { PRODUCT } from 'constants/@queryKeys';

const FullCalendarPage = () => {
  const [period, setPeriod] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpenScheduleDialog, setIsOpenScheduleDialog] = useState(false);

  const { data: scheduleList } = useQuery(
    [PRODUCT.SCHEDULE, period.startDate],
    () =>
      getProductSchedule({
        startDate: period.startDate,
        endDate: period.endDate,
      }),
    {
      enabled: !!period.startDate,
    }
  );

  const events = scheduleList?.map((schedule) => {
    const openDate = new Date(schedule.openDate);

    return {
      title: schedule.isAllDay ? '종일' : format(openDate, 'HH:mm'),
      start: openDate,
      allDay: schedule.isAllDay,
    };
  });

  const onDateClick = ({ date }) => {
    onOpenScheduleDialog(date);
  };

  const onChangeDate = ({ startStr, endStr }) => {
    setPeriod({ startDate: new Date(startStr), endDate: new Date(endStr) });
  };

  const onOpenScheduleDialog = (selected) => {
    setSelectedDate(selected);
    setIsOpenScheduleDialog(true);
  };

  const eventContent = (eventInfo) => {
    const isAllDay = eventInfo.event.allDay;

    return (
      <Box
        sx={{
          width: '100%',
          backgroundColor: isAllDay ? '#5A90FF' : '#FF8652',
          borderRadius: '3px',
          p: 0.5,
          color: '#fff',
          fontWeight: 600,
        }}
      >
        {eventInfo.event.title}
      </Box>
    );
  };

  return (
    <>
      <ScheduleDialog
        open={isOpenScheduleDialog}
        setOpen={setIsOpenScheduleDialog}
        date={selectedDate}
      />
      <FullCalendar
        locale="kr"
        plugins={[dayGridPlugin, interactionPlugin]}
        events={events}
        datesSet={onChangeDate}
        dateClick={onDateClick}
        eventContent={eventContent}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
        }}
      />
    </>
  );
};

export default FullCalendarPage;
