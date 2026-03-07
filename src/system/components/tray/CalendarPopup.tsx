import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NepaliDate from 'nepali-date-converter';
import {
  bsCombinedSupportedYearRange,
  bsPrimaryApiSupportedYearRange,
  bsSecondaryApiSupportedYearRange,
  fetchAdCalendarEventsForYear,
  fetchBsCalendarEventsForYear,
  type CalendarEvent,
  type CalendarFetchResult,
  type CalendarType,
} from '../../constants/calendarEvents';

const PopupContainer = styled.div`
  position: absolute;
  bottom: 65px;
  right: 10px;
  width: 340px;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  border: 3px solid #000;
  padding: 20px;
  box-shadow: 6px 6px 0 #000;
  z-index: 10000;
  color: #000;
  animation: slideUp 0.15s ease-out;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MonthLabel = styled.div`
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #000;
  text-transform: uppercase;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ModeSwitch = styled.div`
  display: flex;
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  overflow: hidden;
`;

const ModeButton = styled.button<{ $active: boolean }>`
  border: none;
  background: ${props => props.$active
    ? (props.theme.colors.brutalistPink || '#ff6b9d')
    : (props.theme.colors.brutalistBlue || '#4d96ff')};
  color: #000;
  font-size: 11px;
  font-weight: 800;
  padding: 7px 12px;
  cursor: pointer;
  letter-spacing: 0.8px;
  min-width: 52px;
`;

const NavButton = styled.button`
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  border: 3px solid #000;
  color: #000;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0 #000;
  transition: all 0.1s;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 #000;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  text-align: center;
`;

const DayLabel = styled.div`
  font-size: 12px;
  color: #000;
  font-weight: 800;
  margin-bottom: 8px;
`;

const DateCell = styled.div<{ $isToday?: boolean; $isSelected?: boolean; $isOtherMonth?: boolean }>`
  position: relative;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  font-weight: 700;
  color: #000;
  border: ${props => props.$isToday ? '3px solid #000' : props.$isSelected ? '2px solid #000' : '2px solid transparent'};
  background: ${props => {
    if (props.$isToday) return props.theme.colors.brutalistOrange || '#ff9f43';
    if (props.$isSelected) return props.theme.colors.brutalistPink || '#ff6b9d';
    return 'transparent';
  }};
  box-shadow: ${props => props.$isToday || props.$isSelected ? '2px 2px 0 #000' : 'none'};
  opacity: ${props => props.$isOtherMonth ? 0.4 : 1};
  
  &:hover {
    background: ${props => props.theme.colors.brutalistGreen || '#6bcb77'};
    border: 2px solid #000;
  }
`;

const EventDot = styled.span<{ $mode: CalendarType }>`
  position: absolute;
  bottom: 3px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${props => props.$mode === 'AD'
    ? (props.theme.colors.brutalistBlue || '#4d96ff')
    : (props.theme.colors.brutalistPurple || '#a66cff')};
  border: 1px solid #000;
`;

const TimeDisplay = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 3px solid #000;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #000;
`;

const DateSub = styled.div`
  font-size: 14px;
  color: #000;
  font-weight: 700;
`;

const SelectedDateInfo = styled.div`
  margin-top: 16px;
  border-top: 3px solid #000;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectedLabel = styled.div`
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: #000;
  text-transform: uppercase;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 120px;
  overflow: auto;
`;

const EventItem = styled.div`
  background: #fff;
  border: 2px solid #000;
  box-shadow: 2px 2px 0 #000;
  padding: 8px;
  color: #000;
`;

const EventTitle = styled.div`
  font-size: 12px;
  font-weight: 800;
`;

const EventMeta = styled.div`
  font-size: 10px;
  font-weight: 700;
  margin-top: 3px;
`;

const EventDesc = styled.div`
  font-size: 10px;
  margin-top: 4px;
  font-weight: 600;
`;

const EmptyEvent = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #000;
  padding: 8px;
  border: 2px dashed #000;
`;

const SourceNote = styled.div`
  margin-top: 8px;
  font-size: 10px;
  font-weight: 700;
  color: #000;
  border: 2px dashed #000;
  padding: 8px;
`;

interface CalendarCell {
  key: string;
  day: number;
  isToday: boolean;
  isOtherMonth: boolean;
  adDate: Date;
  hasEvents: boolean;
}

const bsMonthNames = [
  'Baisakh',
  'Jestha',
  'Asar',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
];

const CalendarPopup: React.FC = () => {
  const [calendarMode, setCalendarMode] = useState<CalendarType>('AD');
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [adEventsByYear, setAdEventsByYear] = useState<Record<number, CalendarEvent[]>>({});
  const [adSourceByYear, setAdSourceByYear] = useState<Record<number, CalendarFetchResult['source']>>({});
  const [bsEventsByYear, setBsEventsByYear] = useState<Record<number, CalendarEvent[]>>({});
  const [bsSourceByYear, setBsSourceByYear] = useState<Record<number, CalendarFetchResult['source']>>({});
  const [bsProviderByYear, setBsProviderByYear] = useState<Record<number, CalendarFetchResult['provider']>>({});
  const requestedADYearsRef = useRef<Set<number>>(new Set());
  const requestedBSYearsRef = useRef<Set<number>>(new Set());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  const adMonthLabel = useMemo(
    () => viewDate.toLocaleDateString([], { month: 'long', year: 'numeric' }),
    [viewDate],
  );

  const bsViewDate = useMemo(() => new NepaliDate(viewDate), [viewDate]);
  const adViewYear = viewDate.getFullYear();
  const bsViewYear = bsViewDate.getYear();

  const bsMonthLabel = useMemo(
    () => `${bsMonthNames[bsViewDate.getMonth()]} ${bsViewDate.getYear()}`,
    [bsViewDate],
  );

  const selectedBsDate = useMemo(() => new NepaliDate(selectedDate), [selectedDate]);

  useEffect(() => {
    let isMounted = true;
    if (!requestedADYearsRef.current.has(adViewYear)) {
      requestedADYearsRef.current.add(adViewYear);
      fetchAdCalendarEventsForYear(adViewYear).then((result) => {
        if (!isMounted) {
          return;
        }
        setAdEventsByYear((previous) => (previous[adViewYear] === undefined
          ? { ...previous, [adViewYear]: result.events }
          : previous));
        setAdSourceByYear((previous) => (previous[adViewYear] === undefined
          ? { ...previous, [adViewYear]: result.source }
          : previous));
      });
    }

    if (!requestedBSYearsRef.current.has(bsViewYear)) {
      requestedBSYearsRef.current.add(bsViewYear);
      fetchBsCalendarEventsForYear(bsViewYear).then((result) => {
        if (!isMounted) {
          return;
        }
        setBsEventsByYear((previous) => (previous[bsViewYear] === undefined
          ? { ...previous, [bsViewYear]: result.events }
          : previous));
        setBsSourceByYear((previous) => (previous[bsViewYear] === undefined
          ? { ...previous, [bsViewYear]: result.source }
          : previous));
        setBsProviderByYear((previous) => (previous[bsViewYear] === undefined
          ? { ...previous, [bsViewYear]: result.provider }
          : previous));
      });
    }

    return () => {
      isMounted = false;
    };
  }, [adViewYear, bsViewYear]);

  const isLoadingEvents = calendarMode === 'AD'
    ? adEventsByYear[adViewYear] === undefined
    : bsEventsByYear[bsViewYear] === undefined;

  const getDynamicEventsForMonthDay = (
    events: CalendarEvent[],
    month: number,
    date: number,
  ) => events.filter((event) => event.month === month && event.date === date);

  const getActiveADEventsForDay = (year: number, month: number, date: number): CalendarEvent[] => {
    const source = adSourceByYear[year];
    const dynamic = getDynamicEventsForMonthDay(adEventsByYear[year] ?? [], month, date);
    if (source === 'api') {
      return dynamic;
    }
    return [];
  };

  const getActiveBSEventsForDay = (year: number, month: number, date: number): CalendarEvent[] => {
    const source = bsSourceByYear[year];
    const dynamic = getDynamicEventsForMonthDay(bsEventsByYear[year] ?? [], month, date);
    if (source === 'api') {
      return dynamic;
    }
    return [];
  };

  const selectedADEvents = getActiveADEventsForDay(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    selectedDate.getDate(),
  );

  const selectedBSEvents = getActiveBSEventsForDay(
    selectedBsDate.getYear(),
    selectedBsDate.getMonth() + 1,
    selectedBsDate.getDate(),
  );

  const selectedEvents = calendarMode === 'AD' ? selectedADEvents : selectedBSEvents;

  const isSameDay = (left: Date, right: Date) => (
    left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate()
  );

  const getBSDaysInMonth = (year: number, month: number) => {
    let day = 1;
    while (true) {
      const probe = new NepaliDate(year, month, day);
      if (probe.getMonth() !== month || probe.getYear() !== year) {
        return day - 1;
      }
      day += 1;
      if (day > 35) {
        return 32;
      }
    }
  };

  const calendarCells: CalendarCell[] = (() => {
    const cells: CalendarCell[] = [];
    const today = new Date();

    if (calendarMode === 'AD') {
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();

      for (let i = 0; i < firstDay; i += 1) {
        cells.push({
          key: `ad-empty-${i}`,
          day: 0,
          isToday: false,
          isOtherMonth: true,
          adDate: new Date(year, month, 1),
          hasEvents: false,
        });
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const adDate = new Date(year, month, day);
        const hasEvents = getActiveADEventsForDay(year, month + 1, day).length > 0;
        cells.push({
          key: `ad-${year}-${month}-${day}`,
          day,
          adDate,
          isToday: isSameDay(adDate, today),
          isOtherMonth: false,
          hasEvents,
        });
      }

      return cells;
    }

    const bsYear = bsViewDate.getYear();
    const bsMonth = bsViewDate.getMonth();
    const firstDay = new NepaliDate(bsYear, bsMonth, 1).getDay();
    const daysInMonth = getBSDaysInMonth(bsYear, bsMonth);

    for (let i = 0; i < firstDay; i += 1) {
      cells.push({
        key: `bs-empty-${i}`,
        day: 0,
        isToday: false,
        isOtherMonth: true,
        adDate: viewDate,
        hasEvents: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const bsDate = new NepaliDate(bsYear, bsMonth, day);
      const adDate = bsDate.toJsDate();
      const hasEvents = getActiveBSEventsForDay(bsYear, bsMonth + 1, day).length > 0;
      cells.push({
        key: `bs-${bsYear}-${bsMonth}-${day}`,
        day,
        adDate,
        isToday: isSameDay(adDate, today),
        isOtherMonth: false,
        hasEvents,
      });
    }

    return cells;
  })();

  const dataSourceMessage = useMemo(() => {
    if (isLoadingEvents) {
      return 'Loading important events...';
    }

    if (calendarMode === 'BS') {
      const source = bsSourceByYear[bsViewYear];
      const provider = bsProviderByYear[bsViewYear];
      if (source === 'api') {
        if (provider === 'bs-secondary') {
          return `BS events source: secondary live provider (${bsSecondaryApiSupportedYearRange.min}–${bsSecondaryApiSupportedYearRange.max}).`;
        }
        return `BS events source: primary live provider (${bsPrimaryApiSupportedYearRange.min}–${bsPrimaryApiSupportedYearRange.max}).`;
      }
      if (source === 'unsupported') {
        return `BS live providers support ${bsCombinedSupportedYearRange.min}–${bsCombinedSupportedYearRange.max}; no live BS events for ${bsViewYear}.`;
      }
      if (source === 'error') {
        return 'BS API unavailable right now.';
      }
      return 'BS events are ready.';
    }

    const adSource = adSourceByYear[adViewYear];
    if (adSource === 'api') {
      return 'AD events source: API-based Gregorian holiday feed.';
    }
    if (adSource === 'error') {
      return 'AD events API unavailable right now.';
    }
    return 'AD events are ready.';
  }, [
    isLoadingEvents,
    calendarMode,
    adSourceByYear,
    bsSourceByYear,
    bsProviderByYear,
    adViewYear,
    bsViewYear,
  ]);

  const handleMonthChange = (direction: -1 | 1) => {
    if (calendarMode === 'AD') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + direction, 1));
      return;
    }

    const bsDate = new NepaliDate(viewDate);
    bsDate.setDate(1);
    bsDate.setMonth(bsDate.getMonth() + direction);
    setViewDate(bsDate.toJsDate());
  };

  const handleModeSwitch = (mode: CalendarType) => {
    setCalendarMode(mode);
    const selected = new Date(selectedDate);
    if (mode === 'AD') {
      setViewDate(new Date(selected.getFullYear(), selected.getMonth(), 1));
      return;
    }

    const bsDate = new NepaliDate(selected);
    setViewDate(new NepaliDate(bsDate.getYear(), bsDate.getMonth(), 1).toJsDate());
  };

  const renderEvent = (event: CalendarEvent) => (
    <EventItem key={event.id}>
      <EventTitle>{event.title}</EventTitle>
      <EventMeta>{event.calendar} · {event.kind ?? 'event'}</EventMeta>
      {event.description && <EventDesc>{event.description}</EventDesc>}
    </EventItem>
  );

  return (
    <PopupContainer>
      <TimeDisplay>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        <DateSub>
          {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </DateSub>
      </TimeDisplay>

      <TopRow>
        <ModeSwitch>
          <ModeButton $active={calendarMode === 'AD'} onClick={() => handleModeSwitch('AD')}>AD</ModeButton>
          <ModeButton $active={calendarMode === 'BS'} onClick={() => handleModeSwitch('BS')}>BS</ModeButton>
        </ModeSwitch>
        <SelectedLabel>{calendarMode === 'AD' ? 'English Calendar' : 'Nepali Calendar'}</SelectedLabel>
      </TopRow>
      
      <Header>
        <MonthLabel>{calendarMode === 'AD' ? adMonthLabel : bsMonthLabel}</MonthLabel>
        <div style={{ display: 'flex', gap: 5 }}>
          <NavButton onClick={() => handleMonthChange(-1)}>
            <ChevronLeft size={16} />
          </NavButton>
          <NavButton onClick={() => handleMonthChange(1)}>
            <ChevronRight size={16} />
          </NavButton>
        </div>
      </Header>

      <Grid>
        {days.map(d => <DayLabel key={d}>{d}</DayLabel>)}
        {calendarCells.map((cell) => {
          if (cell.day === 0 || cell.isOtherMonth) {
            return <DateCell key={cell.key} $isOtherMonth />;
          }

          const isSelected = isSameDay(cell.adDate, selectedDate);
          return (
            <DateCell
              key={cell.key}
              $isToday={cell.isToday}
              $isSelected={isSelected}
              onClick={() => setSelectedDate(cell.adDate)}
            >
              {cell.day}
              {cell.hasEvents && <EventDot $mode={calendarMode} />}
            </DateCell>
          );
        })}
      </Grid>

      <SelectedDateInfo>
        <SelectedLabel>
          {calendarMode === 'AD'
            ? selectedDate.toLocaleDateString([], { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
            : `${bsMonthNames[selectedBsDate.getMonth()]} ${selectedBsDate.getDate()}, ${selectedBsDate.getYear()}`}
        </SelectedLabel>
        <DateSub>
          AD: {selectedDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })} · BS: {selectedBsDate.format('YYYY MMMM DD')}
        </DateSub>
        <EventList>
          {selectedEvents.length > 0 ? selectedEvents.map(renderEvent) : <EmptyEvent>No important events for this date.</EmptyEvent>}
        </EventList>
      </SelectedDateInfo>

      <SourceNote>{dataSourceMessage}</SourceNote>
    </PopupContainer>
  );
};

export default CalendarPopup;
