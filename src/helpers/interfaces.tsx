export interface AllEventsStateI {
    events: EventI[],
    formattedEvents: DayEventsI[],
    cities: CityI[],
    event?: EventI,
    open: boolean
}
  
export interface DicDayEventsI {
    [key: string]: DayEventsI
}

export interface DayEventsI {
    id: string;
    date_formatted: string;
    full_date: Date,
    events: EventI[];
}

export interface EventI {
    readonly id: number;
    readonly isFree: boolean;
    readonly name: string,
    city: any,
    startDate: Date;
    readonly endDate: Date;
    duration: string
}

export interface CityI {
    readonly id: number;
    readonly name: string;
}