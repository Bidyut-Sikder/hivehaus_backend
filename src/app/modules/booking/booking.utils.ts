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
