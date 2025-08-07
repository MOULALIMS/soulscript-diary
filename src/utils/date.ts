import {
  format,
  isToday,
  isYesterday,
  isSameWeek,
  isSameMonth,
  differenceInDays,
} from "date-fns";

export const formatEntryDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today, ${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, "h:mm a")}`;
  } else if (isSameWeek(date, new Date())) {
    return format(date, "EEEE, h:mm a");
  } else if (isSameMonth(date, new Date())) {
    return format(date, "MMM d, h:mm a");
  } else {
    return format(date, "MMM d, yyyy");
  }
};

export const getRelativeDate = (date: Date): string => {
  const days = differenceInDays(new Date(), date);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;

  return `${Math.floor(days / 365)} years ago`;
};

export const groupEntriesByDate = (entries: any[]): Record<string, any[]> => {
  return entries.reduce((groups, entry) => {
    const date = format(entry.createdAt, "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {});
};
