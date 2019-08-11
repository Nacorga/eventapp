export interface DicDayEventI {
    [key: string]: DayEventI
}

export interface DayEventI {
    id: string;
    date_formatted: string;
    full_date: Date,
    events: EventI[];
}

export interface EventI {
    readonly id: number;
    meid?: number;
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