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

    static mixedToMilliseconds(days = 0, hrs = 0, mins = 0, secs = 0, ms = 0): number {
        return ms + (secs + (mins + (hrs + days * 24) * 60) * 60) * 1000
    }

    static fromMixed(days = 0, hrs = 0, mins = 0, secs = 0, ms = 0): TimeSpan {
        return new TimeSpan(TimeSpan.mixedToMilliseconds(days, hrs, mins, secs, ms));
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

    set millisecondsMod(ms: number) {
        this.value = Math.floor(this.seconds) * 1000 + ms;
    }

    get seconds(): number {
        return this.value / 1000;
    }

    get secondsMod(): number {
        return this.seconds % 60;
    }

    set seconds(secs: number) {
        this.value = secs * 1000;
    }

    set secondsMod(secs: number) {
        this.seconds = Math.floor(this.minutes) * 60 + secs + this.millisecondsMod / 1000;
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

    set minutesMod(mins: number) {
        this.minutes = Math.floor(this.hours) * 60 + mins + this.secondsMod / 60;
    }

    get hours(): number {
        return this.minutes / 60;
    }

    get hoursMod(): number {
        return this.hours % 24;
    }

    set hours(hrs: number) {
        this.minutes = hrs * 60;
    }

    set hoursMod(hrs: number) {
        this.hours = Math.floor(this.days) * 24 + hrs + this.minutesMod / 60;
    }

    set days(days: number) {
        this.hours = days * 24;
    }

    get days(): number {
        return this.hours / 24;
    }

    set daysMod(days: number) {
        this.days = days + this.hoursMod / 24;
    }

    setTime(days = 0, hrs = 0, mins = 0, secs = 0, ms = 0): void {
        this.value = TimeSpan.mixedToMilliseconds(days, hrs, mins, secs, ms);
    }

    add(other: TimeSpan): TimeSpan {
        return new TimeSpan(this.value + other.value);
    }

    addAssign(other: TimeSpan): TimeSpan {
        this.value += other.value;
        return this;
    }

    sub(other: TimeSpan): TimeSpan {
        return new TimeSpan(this.value - other.value);
    }

    subAssign(other: TimeSpan): TimeSpan {
        this.value -= other.value;
        return this;
    }

    mul(factor: number): TimeSpan {
        return new TimeSpan(this.value * factor);
    }

    mulAssign(factor: number): TimeSpan {
        this.value *= factor;
        return this;
    }

    div(factor: number): TimeSpan {
        return new TimeSpan(this.value / factor);
    }

    divAssign(factor: number): TimeSpan {
        this.value /= factor;
        return this;
    }

    get string(): string {
        return `${Math.floor(this.days).toString().padStart(1, "0")}:${Math.floor(this.hoursMod).toString().padStart(2, "0")}:${Math.floor(this.minutesMod).toString().padStart(2, "0")}:${Math.floor(this.secondsMod).toString().padStart(2, "0")}.${Math.floor(this.millisecondsMod).toString().padStart(4, "0")}`;
    }

    toString(): string {
        return this.string;
    }
}