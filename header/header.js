async function importFile()
{
    const resp = await fetch("/header/header.html");
    const html = await resp.text();
    document.body.insertAdjacentHTML("beforeBegin", html);
}

importFile();