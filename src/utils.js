export function secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
        h: hours.toString(),
        m: minutes.toString(),
        s: seconds.toString(),
    };
    return obj;
};

export function secondsToDayTime(secs) {
    let days = Math.floor(secs / (3600 * 24))
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
        d: days.toString(),
        h: hours.toString(),
        m: minutes.toString(),
        s: seconds.toString(),
    };
    return obj;
};