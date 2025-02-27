async function importFile(filename)
{
    const resp = await fetch(filename);
    const html = await resp.text();
    document.body.insertAdjacentHTML("beforeBegin", html);
}

async function importMultiple(files)
{
    for(let filename of files)
    {
        await importFile(filename);
    }
}