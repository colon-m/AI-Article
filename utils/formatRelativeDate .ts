import { format, isToday, isYesterday } from 'date-fns';

const formatRelativeDate = (dateStr: string): string => {
  const visitDate = new Date(dateStr);
  if (isToday(visitDate)) return "今天";
  if (isYesterday(visitDate)) return "昨天";
  return format(visitDate, "M月d日");
};

export default formatRelativeDate;
