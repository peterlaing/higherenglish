async function importFile(filename)
{
    const resp = await fetch(filename);
    const html = await resp.text();
    document.body.insertAdjacentHTML("beforeBegin", html);
}

async function importMultiple(filenames)
{
    for(let i = 0; i < filenames.length; i++)
    {
        let filename = filenames[i];
        await importFile(filename);
    }
}