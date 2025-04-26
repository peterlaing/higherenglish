function toggleDarkmode(element)
{
    const isOn = element.checked;

    document.body.classList.add("switching");
    document.body.classList.toggle("dark", isOn);
    localStorage.setItem("siteTheme", isOn ? "dark" : "light");
    setTimeout(() => document.body.classList.remove("switching"), 400);
}

let dark = false;
let theme = localStorage.getItem("siteTheme");
if(theme === "dark") 
{
    document.body.classList.add("dark");
    dark = true;
}
else if(theme !== "light")
{
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle("dark", theme);
    dark = theme;
}

const toggle = document.getElementById("theme-toggle");
if(toggle !== null) toggle.checked = dark;

addEventListener("load", () => document.body.classList.add('transitions-enabled'));