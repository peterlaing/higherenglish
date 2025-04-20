//Update everyone to the new website
if(localStorage.getItem("bgcol") !== null)
    localStorage.clear();

setTimeout(() =>
{
    //Check version and show changelogs
    const CURRENT_VERSION = "2.0";
    const storedVersion = localStorage.getItem("version")

    if(storedVersion !== CURRENT_VERSION)
    {
        localStorage.setItem("version", CURRENT_VERSION);
        if(storedVersion !== null && confirm(`The Website has been updated to V${CURRENT_VERSION}\nWould you like to view the changes?`))
            window.location.href = window.location.origin + "/about";
    }
}, 500);