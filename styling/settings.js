function applyTheme()
{
    let form = document.getElementById("theme-form");
    localStorage.setItem("headcol", form.elements.namedItem("header-colour").value);
    localStorage.setItem("pagecol", form.elements.namedItem("page-colour").value);
    localStorage.setItem("bgcol", form.elements.namedItem("bg-colour").value);
    localStorage.setItem("textcol", form.elements.namedItem("text-colour").value);
    localStorage.setItem("linkcol", form.elements.namedItem("link-colour").value);

    localStorage.setItem("headmix", form.elements.namedItem("header-mix").value);
    localStorage.setItem("pagemix", form.elements.namedItem("page-mix").value);
    localStorage.setItem("bgmix", form.elements.namedItem("bg-mix").value);
    refreshPage();
}

async function delayedApply()
{
    window.setTimeout(applyTheme, 1);
}

function applyCustom()
{
    let form = document.getElementById("theme-form");
    let string = form.elements.namedItem("theme-string").value;

    if(string.length != 36) return;

    localStorage.setItem("headcol", "#" + string.substring(0, 6));
    localStorage.setItem("pagecol", "#" + string.substring(8, 14));
    localStorage.setItem("bgcol", "#" + string.substring(16, 22));
    localStorage.setItem("textcol", "#" + string.substring(24, 30));
    localStorage.setItem("linkcol", "#" + string.substring(30, 36));

    localStorage.setItem("headmix", string.substring(6, 8));
    localStorage.setItem("pagemix", string.substring(14, 16));
    localStorage.setItem("bgmix", string.substring(22, 24));
    refreshPage();
    fillForm();
}

function copyCustom()
{
    let form = document.getElementById("theme-form");
    string = "";

    string += toHex(form.elements.namedItem("header-colour").value);
    string += toNumeric(form.elements.namedItem("header-mix").value);
    string += toHex(form.elements.namedItem("page-colour").value);
    string += toNumeric(form.elements.namedItem("page-mix").value);
    string += toHex(form.elements.namedItem("bg-colour").value);
    string += toNumeric(form.elements.namedItem("bg-mix").value);
    string += toHex(form.elements.namedItem("text-colour").value);
    string += toHex(form.elements.namedItem("link-colour").value);
    navigator.clipboard.writeText(string);
}

function fillForm()
{
    if(localStorage.getItem("headcol") == null) return;

    let form = document.getElementById("theme-form");
    form.elements.namedItem("header-colour").value = localStorage.getItem("headcol");
    form.elements.namedItem("page-colour").value = localStorage.getItem("pagecol");
    form.elements.namedItem("bg-colour").value = localStorage.getItem("bgcol");
    form.elements.namedItem("text-colour").value = localStorage.getItem("textcol");
    form.elements.namedItem("link-colour").value = localStorage.getItem("linkcol");

    form.elements.namedItem("header-mix").value = localStorage.getItem("headmix");
    form.elements.namedItem("header-mix").nextElementSibling.value = toPercentage(localStorage.getItem("headmix"));
    form.elements.namedItem("page-mix").value = localStorage.getItem("pagemix");
    form.elements.namedItem("page-mix").nextElementSibling.value = toPercentage(localStorage.getItem("pagemix"));
    form.elements.namedItem("bg-mix").value = localStorage.getItem("bgmix");
    form.elements.namedItem("bg-mix").nextElementSibling.value = toPercentage(localStorage.getItem("bgmix"));
}

function toPercentage(num)
{
    if(num[0] == "0") num = num.substring(1);
    return num + "%";
}

function toNumeric(percentage)
{
    if(percentage < 10) return "0" + percentage;
    return percentage;
}

function toHex(hex)
{
    return hex.replace("#", "");
}

fillForm();