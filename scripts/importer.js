async function importFile(filename)
{
    const response = await fetch("/imports/" + filename);
    const html = await response.text();
    document.body.insertAdjacentHTML("beforeBegin", html);
}