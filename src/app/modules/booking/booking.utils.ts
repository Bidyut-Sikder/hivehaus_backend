export function convertTo24HourFormat(time:any) {
    const [hourMinute, meridian] = time.split(" ");
    let [hours, minutes] = hourMinute.split(":").map(Number);
  
    if (meridian === "PM" && hours !== 12) {
      hours += 12;
    } else if (meridian === "AM" && hours === 12) {
      hours = 0;
    }
  
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }
  

//   const convertedTime = convertTo24HourFormat(startTime);

// console.log(convertedTime)
export function getTimeDifference(startTime:string, endTime:string) {
  // Helper function to convert time to 24-hour format
  function parseTime(timeStr:any) {
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
