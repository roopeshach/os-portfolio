export type CalendarType = 'AD' | 'BS';

export interface CalendarEvent {
  id: string;
  calendar: CalendarType;
  month: number;
  date: number;
  title: string;
  description?: string;
  kind?: 'holiday' | 'festival' | 'observance';
}

export interface CalendarFetchResult {
  events: CalendarEvent[];
  source: 'api' | 'unsupported' | 'error';
}

export const bsApiSupportedYearRange = {
  min: 1970,
  max: 2074,
};

export const englishCalendarEvents: CalendarEvent[] = [
  {
    id: 'ad-new-year',
    calendar: 'AD',
    month: 1,
    date: 1,
    title: 'New Year’s Day',
    description: 'Start of the Gregorian year.',
    kind: 'holiday',
  },
  {
    id: 'ad-labor-day',
    calendar: 'AD',
    month: 5,
    date: 1,
    title: 'International Workers’ Day',
    description: 'Recognizes labor rights and worker contributions.',
    kind: 'observance',
  },
  {
    id: 'ad-environment-day',
    calendar: 'AD',
    month: 6,
    date: 5,
    title: 'World Environment Day',
    description: 'Global awareness day for environmental action.',
    kind: 'observance',
  },
  {
    id: 'ad-independence-day-india',
    calendar: 'AD',
    month: 8,
    date: 15,
    title: 'Independence Day (India)',
    description: 'Regional reference event often tracked in South Asia.',
    kind: 'observance',
  },
  {
    id: 'ad-un-day',
    calendar: 'AD',
    month: 10,
    date: 24,
    title: 'United Nations Day',
    description: 'Marks the anniversary of the UN Charter in force.',
    kind: 'observance',
  },
  {
    id: 'ad-human-rights-day',
    calendar: 'AD',
    month: 12,
    date: 10,
    title: 'Human Rights Day',
    description: 'Commemorates the Universal Declaration of Human Rights.',
    kind: 'observance',
  },
  {
    id: 'ad-christmas',
    calendar: 'AD',
    month: 12,
    date: 25,
    title: 'Christmas Day',
    description: 'Major global festival and holiday.',
    kind: 'festival',
  },
];

export const nepaliCalendarEvents: CalendarEvent[] = [
  {
    id: 'bs-new-year',
    calendar: 'BS',
    month: 1,
    date: 1,
    title: 'Nepali New Year',
    description: 'First day of Bikram Sambat year (Baisakh 1).',
    kind: 'festival',
  },
  {
    id: 'bs-republic-day',
    calendar: 'BS',
    month: 2,
    date: 15,
    title: 'Republic Day (Ganatantra Diwas)',
    description: 'Marks Nepal becoming a federal democratic republic.',
    kind: 'observance',
  },
  {
    id: 'bs-paddy-day',
    calendar: 'BS',
    month: 3,
    date: 15,
    title: 'National Paddy Day (Ropain Diwas)',
    description: 'Celebrates rice plantation season in Nepal.',
    kind: 'festival',
  },
  {
    id: 'bs-constitution-day',
    calendar: 'BS',
    month: 6,
    date: 3,
    title: 'Constitution Day',
    description: 'Commemorates the promulgation of Nepal’s constitution.',
    kind: 'holiday',
  },
  {
    id: 'bs-martyrs-day',
    calendar: 'BS',
    month: 10,
    date: 16,
    title: 'Martyrs’ Day',
    description: 'Remembers national martyrs of Nepal.',
    kind: 'observance',
  },
  {
    id: 'bs-democracy-day',
    calendar: 'BS',
    month: 11,
    date: 7,
    title: 'Democracy Day',
    description: 'Marks restoration of democracy in Nepal.',
    kind: 'observance',
  },
];

export const getEventsForMonthDay = (
  calendar: CalendarType,
  month: number,
  date: number,
): CalendarEvent[] => {
  const source = calendar === 'AD' ? englishCalendarEvents : nepaliCalendarEvents;
  return source.filter((event) => event.month === month && event.date === date);
};

export const mergeEvents = (...eventSets: CalendarEvent[][]): CalendarEvent[] => {
  const seen = new Set<string>();
  const merged: CalendarEvent[] = [];

  eventSets.flat().forEach((event) => {
    const key = `${event.calendar}-${event.month}-${event.date}-${event.title}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    merged.push(event);
  });

  return merged;
};

const trimValue = (value: string): string => {
  return value
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\u00A0/g, ' ')
    .trim();
};

const bsMonthAliases = [
  ['Baisakh', 'Baishakh'],
  ['Jestha'],
  ['Asar', 'Ashadh'],
  ['Shrawan', 'Shravan'],
  ['Bhadra'],
  ['Ashwin', 'Aswin'],
  ['Kartik'],
  ['Mangsir', 'Mansir'],
  ['Poush', 'Pous'],
  ['Magh'],
  ['Falgun', 'Phalgun'],
  ['Chaitra', 'Chait'],
];

interface BsApiDay {
  np?: string;
  tithi?: string;
  event?: string;
  day?: string;
  specialday?: boolean;
  holiday?: boolean;
}

type BsApiResponse = Record<string, BsApiDay[]>;

const findMonthEntries = (payload: BsApiResponse, monthIndex: number): BsApiDay[] => {
  const aliases = bsMonthAliases[monthIndex] ?? [];
  for (const key of aliases) {
    const entries = payload[key];
    if (Array.isArray(entries)) {
      return entries;
    }
  }
  return [];
};

export const fetchBsCalendarEventsForYear = async (year: number): Promise<CalendarFetchResult> => {
  if (year < bsApiSupportedYearRange.min || year > bsApiSupportedYearRange.max) {
    return { events: [], source: 'unsupported' };
  }

  try {
    const response = await fetch(`https://bibhuticoder.github.io/nepali-calendar-api/api/${year}.json`);
    if (!response.ok) {
      return { events: [], source: 'error' };
    }

    const payload = (await response.json()) as BsApiResponse;
    const events: CalendarEvent[] = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      const entries = findMonthEntries(payload, monthIndex);
      entries.forEach((item, index) => {
        const day = Number(item.np);
        if (!Number.isFinite(day) || day < 1 || day > 32) {
          return;
        }

        const eventName = trimValue(item.event ?? '');
        const tithi = trimValue(item.tithi ?? '');
        const isImportant = Boolean(item.holiday || item.specialday || eventName);
        if (!isImportant) {
          return;
        }

        const title = eventName || tithi || 'Important Day';
        const detailParts = [
          tithi ? `Tithi: ${tithi}` : '',
          item.day ? `Weekday: ${item.day.toUpperCase()}` : '',
          item.holiday ? 'National Holiday' : '',
          item.specialday ? 'Special Day' : '',
        ].filter(Boolean);

        events.push({
          id: `bs-api-${year}-${monthIndex + 1}-${day}-${index}`,
          calendar: 'BS',
          month: monthIndex + 1,
          date: day,
          title,
          description: detailParts.join(' · '),
          kind: item.holiday ? 'holiday' : item.specialday ? 'observance' : 'festival',
        });
      });
    }

    return { events, source: 'api' };
  } catch {
    return { events: [], source: 'error' };
  }
};

const adHolidayFeedUrl = 'https://r.jina.ai/http://www.officeholidays.com/ics/nepal';

const parseIcsEventsForYear = (content: string, year: number): CalendarEvent[] => {
  const startIndex = content.indexOf('BEGIN:VCALENDAR');
  const usable = startIndex >= 0 ? content.slice(startIndex) : content;
  const blocks = usable.split('BEGIN:VEVENT').slice(1);

  return blocks.flatMap((block, index) => {
    const dateMatch = block.match(/DTSTART(?:;[^:]+)?:([0-9]{8})/);
    const summaryMatch = block.match(/SUMMARY(?:;[^:]+)?:([^\n\r]+)/);
    if (!dateMatch || !summaryMatch) {
      return [];
    }

    const raw = dateMatch[1];
    const eventYear = Number(raw.slice(0, 4));
    const month = Number(raw.slice(4, 6));
    const date = Number(raw.slice(6, 8));
    if (eventYear !== year || !month || !date) {
      return [];
    }

    const title = trimValue(summaryMatch[1]);
    if (!title) {
      return [];
    }

    return [{
      id: `ad-api-${year}-${month}-${date}-${index}`,
      calendar: 'AD' as const,
      month,
      date,
      title,
      description: 'Nepal holiday (Gregorian feed)',
      kind: 'holiday' as const,
    }];
  });
};

export const fetchAdCalendarEventsForYear = async (year: number): Promise<CalendarFetchResult> => {
  try {
    const response = await fetch(adHolidayFeedUrl);
    if (!response.ok) {
      return { events: [], source: 'error' };
    }

    const content = await response.text();
    const events = parseIcsEventsForYear(content, year);
    return { events, source: 'api' };
  } catch {
    return { events: [], source: 'error' };
  }
};
