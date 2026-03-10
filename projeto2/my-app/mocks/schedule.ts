export interface ScheduleItem {
    id: string;
    subject: string;
    time: string;
    room: string;
};

export const morningSchedule: ScheduleItem[] = [
  { id: '1', subject: 'Mobile Development', time: '08:00 - 09:40', room: 'Lab 1' },
  { id: '2', subject: 'Intervalo', time: '09:40 - 10:00', room: '-' },
  { id: '3', subject: 'Cloud Computing', time: '10:00 - 11:40', room: 'Lab 2' },
  { id: '4', subject: 'Intervalo', time: '11:40 - 12:00', room: '-' },
  { id: '5', subject: 'DevOps', time: '12:00 - 13:40', room: 'Sala 301' },
];

export const nightSchedule: ScheduleItem[] = [
  { id: '1', subject: 'Python', time: '19:00 - 20:40', room: 'Lab 3' },
  { id: '2', subject: 'Intervalo', time: '20:40 - 21:00', room: '-' },
  { id: '3', subject: 'Database', time: '21:00 - 22:40', room: 'Lab 4' },
  { id: '4', subject: 'Intervalo', time: '22:40 - 23:00', room: '-' },
  { id: '5', subject: 'Artificial Intelligence', time: '23:00 - 00:40', room: 'Sala 405' },
];