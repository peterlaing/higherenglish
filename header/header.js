async function importFile(filename, position)
{
    const resp = await fetch(filename);
    const html = await resp.text();
    document.body.insertAdjacentHTML(position, html);
}

importFile("/header/header.html", "beforeBegin");