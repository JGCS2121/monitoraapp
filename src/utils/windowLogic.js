import { differenceInMinutes, addHours, formatDistanceStrict } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Calculates the WhatsApp 24-hour window status
 * @param {string|number|Date} lastMessageTimestamp 
 * @returns {object} { status, label, color, minutesRemaining }
 */
export const calculateWindowStatus = (lastMessageTimestamp) => {
  if (!lastMessageTimestamp) return { status: 'closed', label: 'Cerrada', color: '#6B7280', minutesRemaining: 0 };

  const lastDate = new Date(lastMessageTimestamp);
  const expirationDate = addHours(lastDate, 24);
  const now = new Date();

  const minutesRemaining = differenceInMinutes(expirationDate, now);

  if (minutesRemaining <= 0) {
    return { status: 'closed', label: 'Cerrada', color: '#6B7280', minutesRemaining: 0 };
  }

  // Formatting remaining time
  const hours = Math.floor(minutesRemaining / 60);
  const mins = minutesRemaining % 60;
  const timeLabel = `${hours}h ${mins}min`;

  if (minutesRemaining > 360) { // > 6 hours
    return { status: 'green', label: timeLabel, color: '#4ADE80', minutesRemaining };
  } else if (minutesRemaining > 60) { // 1 to 6 hours
    return { status: 'yellow', label: timeLabel, color: '#FACC15', minutesRemaining };
  } else { // < 1 hour
    return { status: 'red', label: `¡URGENTE! ${timeLabel}`, color: '#EF4444', minutesRemaining };
  }
};
