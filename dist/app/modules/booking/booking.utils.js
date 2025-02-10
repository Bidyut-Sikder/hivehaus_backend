"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeDifference = exports.convertTo24HourFormat = void 0;
function convertTo24HourFormat(time) {
    const [hourMinute, meridian] = time.split(" ");
    let [hours, minutes] = hourMinute.split(":").map(Number);
    if (meridian === "PM" && hours !== 12) {
        hours += 12;
    }
    else if (meridian === "AM" && hours === 12) {
        hours = 0;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
exports.convertTo24HourFormat = convertTo24HourFormat;
//   const convertedTime = convertTo24HourFormat(startTime);
// console.log(convertedTime)
function getTimeDifference(startTime, endTime) {
    // Helper function to convert time to 24-hour format
    function parseTime(timeStr) {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }
        return hours + minutes / 60;
    }
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const difference = end - start;
    return difference < 0 ? difference + 24 : difference; // Handle overnight cases
}
exports.getTimeDifference = getTimeDifference;
