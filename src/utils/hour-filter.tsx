import { EventI } from '../helpers/interfaces';

export const hourFilter = (events: EventI[], start: number, end: number) => {
    return events.filter((event: EventI) => {
        if ( event.startDate.getHours() >= start && event.startDate.getHours() <= end ) {
            return event;
        }
    });
};

export const hourFilterDayChange = (events: EventI[], start: number, end: number) => {
    const x = events.filter((event: EventI) => event.startDate.getHours() >= start);
    const y = events.filter((event: EventI) => event.startDate.getHours() <= end);
    return x.concat(y);
};