async function getAnnotations(story)
{
    const url = new URL("https://api.hypothes.is/api/search");
    url.searchParams.append("uri", "higherenglish.pages.dev/stories/" + story);
    url.searchParams.append("user", "acct:PeterLaing@hypothes.is");
    url.searchParams.append("limit", 200);
    url.searchParams.append("sort", "created");
    url.searchParams.append("order", "asc");

    const response = await fetch(url, { headers: { "Authorization": "Bearer 6879-9NtKuCOedDjL2WaLxmIQb2-U28DPZEh57dcMU7Cvs74" }});
    if(!response.ok) throw new Error("Failed to fetch annotations");
    return await response.json();
}

function getQuote(annotation)
{
    if(!annotation.target || !annotation.target[0].selector) return null;
    for(const selector of annotation.target[0].selector)
        if(selector.type === "TextQuoteSelector") return selector.exact;

    return null;
}

function loadAnnotations(story)
{
    getAnnotations(story).then(data =>
    {
        if(!data.rows) return;

        const identifier = story[0];
        let i = 1;
        data.rows.forEach(annotation =>
        {
            const quote = getQuote(annotation);
            const analysis = annotation.text;
            console.log(`
    {
        "id":"${identifier + i.toString().padStart(3, "0")}",
        "quote":"${quote}",
        "author":"Peter Laing",
        "analysis":"${analysis.replace(/\"/g, "\\\"")}",
        "tags":[]
    },`);
            i += 1;
        });
    });
}