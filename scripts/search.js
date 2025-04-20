//i have no idea what this wizardry is
function levenshteinDistance(a, b)
{
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for(let i = 0; i <= m; i++) dp[i][0] = i;
    for(let j = 0; j <= n; j++) dp[0][j] = j;

    for(let i = 1; i <= m; i++)
    {
        for(let j = 1; j <= n; j++)
        {
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }

    return 200 * dp[m][n] / (m + n);
}

function similarEnough(a, b)
{
    //Account for similar names
    const startA = a.substring(0, 3);
    const startB = b.substring(0, 3);

    //Mr and Mrs Jackson
    if(startA === "mr " && startB === "mrs"
    || startB === "mr " && startA === "mrs") return false;

    //Fat and Thin Women
    if(startA === "fat" && startB === "thi"
    || startB === "fat" && startA === "thi") return false;

    return levenshteinDistance(a, b) <= 50
    && Math.abs(a.length - b.length) <= 2;
}

function searchForQuery(query)
{
    quoteList = document.getElementById("search-results");
    searchBar = document.getElementById("search-bar");
    searchBar.value = query;

    let count = 0;
    if(query[0] === "!")
    {
        const search = query.substring(1, query.length);
        const input = search.split(",");

        let tags = [];
        for(let thing of input)
            tags.push(thing.trim().replace(/\s+/g, " ").toLowerCase());

        for(let annotation of annotationList)
        {
            let ok = true;
            for(let tag of tags)
            {
                if(!annotation.tags.some(t => similarEnough(t.toLowerCase(), tag)))
                {
                    ok = false;
                    break;
                }
            }
            if(ok)
            {
                count += 1;
                createQuote(annotation, query);
            }
        }
    }
    else
    {
        const quotesRegex = /[“”‘’]/g;
        const quotesReplacer = match => ({
            '“': '"',
            '”': '"',
            '‘': "'",
            '’': "'"
        }[match] || match);

        const term = query.toLowerCase().replace(quotesRegex, quotesReplacer);

        for(let annotation of annotationList)
        {
            const quote = annotation.quote.toLowerCase().replace(quotesRegex, quotesReplacer);
            if(quote.includes(term))
            {
                count += 1;
                createQuote(annotation, query);
            }
        }
    }

    updateCounter(count);
    if(count == 0 && query[0] == "!") displayMessage();
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

function displayMessage()
{
    document.getElementById("tag-message").classList.remove("hidden");
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
    const replaced = isInvalid(query) ? parseQuote(annotation.quote) : parseQuote(annotation.quote).replace(regex, `<b><u>${query}</u></b>`);
    const link = `/${story}/?id=${annotation.id}`;

    const html = `
    <span>
        <a href="${link}" class="found-quote">
            <nav class="story-mark ${colour}"></nav>
            <p>${replaced}</p>
        </a>
        <button class="quote-button ${isSaved(annotation.id) ? "saved-quote" : ""}" onclick="saveAnnotation(this, '${annotation.id}');">
            <i class="fa-solid ${isSaved(annotation.id) ? "fa-circle-minus" : "fa-circle-plus"} clickable"></i>
        </button>
    </span>`;

    quoteList.innerHTML += html;
}

function isInvalid(query)
{
    return query === ""
    || query === " ";
}

function saveAnnotation(element, id)
{
    element.classList.toggle("saved-quote");
    element.querySelector("i").classList.toggle("fa-circle-plus");
    element.querySelector("i").classList.toggle("fa-circle-minus");
    if(isSaved(id)) unsaveQuote(id);
    else saveQuote(id);
}

loadAnnotations(() =>
{
    const query = new URLSearchParams(window.location.search);
    searchForQuery(query.get("q"));
});