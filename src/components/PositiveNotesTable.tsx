import React from 'react';
    import { Activity } from '../types/activity';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { DAYS } from '../constants/days';
    import { getDateOfWeek, getCurrentWeekDates } from '../utils/dateUtils';

    interface PositiveNotesTableProps {
      activities: Activity[];
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function PositiveNotesTable({ activities, weekSelection }: PositiveNotesTableProps) {
      const weekStartDate = getDateOfWeek(weekSelection.weekNumber, weekSelection.year);
      const weekDates = getCurrentWeekDates(weekStartDate);

      const currentWeekActivities = activities.filter(activity =>
        activity.weekNumber === weekSelection.weekNumber &&
        activity.year === weekSelection.year
      );

      const getPositiveNotesForDay = (dayIndex: number) => {
        const notes = currentWeekActivities.reduce((acc, activity) => {
          if (activity.selectedDays?.includes(dayIndex) && activity.positiveNotes) {
            acc.push(...activity.positiveNotes);
          }
          return acc;
        }, [] as string[]);
        return notes;
      };

      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {DAYS.map((day, index) => (
                  <th key={day} className="p-3 text-white border border-white/20">
                    <div className="flex flex-col items-center">
                      <span>{day}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {DAYS.map((day, index) => (
                  <td key={day} className="p-3 border border-white/20 align-top">
                    <ul className="list-disc list-inside text-white/70 text-sm" dir="rtl">
                      {getPositiveNotesForDay(index).map((note, noteIndex) => (
                        <li key={noteIndex}>{note}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
