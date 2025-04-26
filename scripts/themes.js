function toggleDarkmode(element)
{
    const isOn = element.checked;

    document.documentElement.classList.add("switching");
    document.documentElement.classList.toggle("dark", isOn);
    localStorage.setItem("siteTheme", isOn ? "dark" : "light");
    setTimeout(() => document.documentElement.classList.remove("switching"), 400);
}

let dark = false;
let theme = localStorage.getItem("siteTheme");
if(theme === "dark") 
{
    document.documentElement.classList.add("dark");
    dark = true;
}
else if(theme !== "light")
{
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle("dark", theme);
    dark = theme;
}

const toggle = document.getElementById("theme-toggle");
if(toggle !== null) toggle.checked = dark;

addEventListener("load", () => document.documentElement.classList.add('transitions-enabled'));