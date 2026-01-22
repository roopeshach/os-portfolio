import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PopupContainer = styled.div`
  position: absolute;
  bottom: 60px;
  right: 10px;
  width: 340px;
  background: rgba(10, 15, 30, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 30px rgba(0, 216, 255, 0.15);
  z-index: 10000;
  color: ${props => props.theme.colors.text};
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

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
  font-weight: 700;
  letter-spacing: 1px;
  color: ${props => props.theme.colors.accent};
  text-transform: uppercase;
`;

const NavButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.text};
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 216, 255, 0.2);
    border-color: ${props => props.theme.colors.accent};
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
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  margin-bottom: 8px;
`;

const DateCell = styled.div<{ $isToday?: boolean; $isOtherMonth?: boolean }>`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  color: ${props => props.$isOtherMonth ? 'rgba(255, 255, 255, 0.2)' : props.theme.colors.text};
  background: ${props => props.$isToday ? props.theme.colors.accent : 'transparent'};
  box-shadow: ${props => props.$isToday ? `0 0 15px ${props.theme.colors.accent}` : 'none'};
  font-weight: ${props => props.$isToday ? 'bold' : 'normal'};
  
  &:hover {
    background: ${props => props.$isToday ? props.theme.colors.accent : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const TimeDisplay = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 32px;
  font-weight: 300;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const DateSub = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
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
