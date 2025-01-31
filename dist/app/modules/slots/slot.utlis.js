"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minutesToTime = exports.timeMinutes = void 0;
const timeMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinute = hours * 60 + minutes;
    return totalMinute;
};
exports.timeMinutes = timeMinutes;
const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    const time = `${hours}:${mins}`;
    return time;
};
exports.minutesToTime = minutesToTime;
