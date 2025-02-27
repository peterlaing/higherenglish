function getRemainingTime()
{
    let now = Date.now();
    let exam = new Date(2025, 4, 7, 9, 0, 0, 0);
    return exam - now;
}

function formatTimeString(time)
{
    if(time < 0) return "The exam is over!";

    let days = Math.floor(time / (1000 * 3600 * 24));
    let hours = Math.ceil(time / (1000 * 3600) % 24);

    if(days == 0) return "The exam is in " + hours.toString() + " hours!";
    return "The exam is in " + days.toString() + " days and " + hours.toString() + " hours";
}

document.getElementById("countdown").innerText = formatTimeString(getRemainingTime());
