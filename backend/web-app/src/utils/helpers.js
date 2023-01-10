import moment from "moment";


export const snapTime = (time, forward) => {
    const start = moment(time);
    if (forward) {
        const remainder = 30 - (start.minute() % 30);

        return start.add(remainder, "minutes")
    }else{
        const remainder = start.minute() % 30

        return start.subtract(remainder, "minutes")
    }
}

export const getTimeSlot = (time) => {
    return [
        snapTime(time, false),
        snapTime(time, true)
    ]
}