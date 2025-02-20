async function importFile()
{
    const resp = await fetch("/navigation/navbar.html");
    const html = await resp.text();
    document.body.insertAdjacentHTML("beforeBegin", html);
}

importFile();