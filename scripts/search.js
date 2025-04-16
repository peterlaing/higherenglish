function searchForQuery(query)
{
    quoteList = document.getElementById("search-results");
    searchBar = document.getElementById("search-bar");
    searchBar.value = query;

    let count = 0;
    const term = query.toLowerCase();

    for(let annotation of annotationList)
    {
        const quote = annotation.quote.toLowerCase();
        if(quote.includes(term))
        {
            count += 1;
            createQuote(annotation, query);
        }
    }

    updateCounter(count);
}

function updateCounter(count)
{
    let message = "";
    if(count === 0) message = "No Results";
    else if(count === 1) message = "1 Result";
    else message = count + " Results";

    const title = document.getElementById("result-count");
    title.textContent = message;
}

let quoteList = null;
function createQuote(annotation, query)
{
    const id = annotation.id[0];
    let colour = "";
    let story = "";

    if(id == "t")
    {
        colour = "green";
        story = "telegram";
    }
    else if(id == "h")
    {
        colour = "blue";
        story = "home";
    }
    else if(id == "r")
    {
        colour = "red";
        story = "red-door";
    }
    else if(id == "m")
    {
        colour = "yellow";
        story = "mother-son";
    }

    const regex = new RegExp(query, "gi");
    const replaced = isInvalid(query) ? annotation.quote : annotation.quote.replace(regex, `<b><u>${query}</u></b>`);
    const link = `/pages/stories/${story}.html?id=${annotation.id}`;

    const html = `
    <a href="${link}" class="found-quote">
        <nav class="story-mark ${colour}"></nav>
        <p>${replaced}</p>
    </a>`;

    quoteList.innerHTML += html;
}

function isInvalid(query)
{
    return query === ""
    || query === " ";
}

loadAnnotations(() =>
{
    const query = new URLSearchParams(window.location.search);
    searchForQuery(query.get("q"));
});