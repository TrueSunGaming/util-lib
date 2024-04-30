export class TimeSpan {
    private value: number;

    constructor(ms: number) {
        this.value = ms;
    }

    static fromMilliseconds(ms: number): TimeSpan {
        return new TimeSpan(ms);
    }

    static fromSeconds(secs: number): TimeSpan {
        return new TimeSpan(secs * 1000);
    }

    static fromMinutes(mins: number): TimeSpan {
        return TimeSpan.fromSeconds(mins * 60);
    }

    static fromHours(hrs: number): TimeSpan {
        return TimeSpan.fromMinutes(hrs * 60);
    }

    static fromDays(days: number): TimeSpan {
        return TimeSpan.fromHours(days * 24);
    }

    static fromDate(date: Date): TimeSpan {
        return new TimeSpan(date.getTime());
    }

    static fromMixed(days = 0, hrs = 0, mins = 0, secs = 0, ms = 0): TimeSpan {
        return new TimeSpan(ms + (secs + (mins + (hrs + days * 24) * 60) * 60) * 1000);
    }

    get milliseconds(): number {
        return this.value;
    }

    get millisecondsMod(): number {
        return this.value % 1000;
    }

    set milliseconds(ms: number) {
        this.value = ms;
    }

    set seconds(secs: number) {
        this.value = secs * 1000;
    }

    get seconds(): number {
        return this.value / 1000;
    }

    get secondsMod(): number {
        return this.seconds % 60;
    }

    set minutes(mins: number) {
        this.seconds = mins * 60;
    }

    get minutes(): number {
        return this.seconds / 60;
    }

    get minutesMod(): number {
        return this.minutes % 60;
    }

    set hours(hrs: number) {
        this.minutes = hrs * 60;
    }

    get hours(): number {
        return this.minutes / 60;
    }

    get hoursMod(): number {
        return this.hours % 24;
    }

    set days(days: number) {
        this.hours = days * 24;
    }

    get days(): number {
        return this.hours 
    }

    setTime(days = 0, hrs = 0, mins = 0, secs = 0, ms = 0): void {
        this.value = ms + (secs + (mins + (hrs + days * 24) * 60) * 60) * 1000;
    }
}