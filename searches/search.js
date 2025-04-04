async function search(query)
{
    const url = new URL("https://api.hypothes.is/api/search");
    url.searchParams.append("uri", "higherenglish.pages.dev/stories/home");
    //url.searchParams.append("tags", query);
    url.searchParams.append("limit", 10);

    const response = await fetch(url, { headers: { "Authorization": "Bearer 6879-9NtKuCOedDjL2WaLxmIQb2-U28DPZEh57dcMU7Cvs74" }});
    if(!response.ok) throw new Error("Failed to fetch annotations");
    return await response.json();
}

function getQuote(annotation)
{
    if(!annotation.target || !annotation.target[0].selector) return null;

    for(const selector of annotation.target[0].selector)
    {
        if(selector.type === "TextQuoteSelector") return selector.exact;
    }
    return null;
}

const resultsCount = document.getElementById("result-count");
const listParent = document.getElementById("result-parent");

function displayResult(annotation)
{
    const quote = getQuote(annotation);
    const item = document.createElement("li");
    const link = document.createElement("a");

    link.textContent = quote;
    link.href = "/stories/home.html#text=" + quote.substring(0, 20);

    item.appendChild(link);
    listParent.appendChild(item);
}

search("test").then(data =>
{
    if(!data.rows) return;

    resultsCount.innerText = data.rows.length + " results";
    data.rows.forEach(annotation => displayResult(annotation));
});