import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const DateCell = styled.div<{ $isToday?: boolean; $isOtherMonth?: boolean }>`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  font-weight: 700;
  color: #000;
  border: ${props => props.$isToday ? '3px solid #000' : '2px solid transparent'};
  background: ${props => props.$isToday ? (props.theme.colors.brutalistPink || '#ff6b9d') : 'transparent'};
  box-shadow: ${props => props.$isToday ? '2px 2px 0 #000' : 'none'};
  opacity: ${props => props.$isOtherMonth ? 0.4 : 1};
  
  &:hover {
    background: ${props => props.theme.colors.brutalistGreen || '#6bcb77'};
    border: 2px solid #000;
  }
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

const CalendarPopup: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      cells.push(<DateCell key={`empty-${i}`} $isOtherMonth />);
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
      cells.push(
        <DateCell key={i} $isToday={isToday}>
          {i}
        </DateCell>
      );
    }

    return cells;
  };

  return (
    <PopupContainer>
      <TimeDisplay>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        <DateSub>{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</DateSub>
      </TimeDisplay>
      
      <Header>
        <MonthLabel>{date.toLocaleDateString([], { month: 'long', year: 'numeric' })}</MonthLabel>
        <div style={{ display: 'flex', gap: 5 }}>
          <NavButton onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}>
            <ChevronLeft size={16} />
          </NavButton>
          <NavButton onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}>
            <ChevronRight size={16} />
          </NavButton>
        </div>
      </Header>

      <Grid>
        {days.map(d => <DayLabel key={d}>{d}</DayLabel>)}
        {renderCalendar()}
      </Grid>
    </PopupContainer>
  );
};

export default CalendarPopup;
