let json = [];
let paragraphs = [];
const annotations = {};

async function loadAnnotations(story)
{
    paragraphs = document.getElementById("story").getElementsByTagName("p");

    const url = "/annotations/" + story + ".json";
    const response = await fetch(url);

    json = await response.json();
    json.forEach(async annotation =>
    {
        annotations[annotation.id] = annotation;
        await addAnnotation(annotation);
    });

    findTarget();
}

async function addAnnotation(annotation)
{
    for(const paragraph of paragraphs)
    {
        const text = paragraph.innerHTML;
        const index = text.indexOf(annotation.quote);

        if(index !== -1)
        {
            const before = text.slice(0, index);
            const after = text.slice(index + annotation.quote.length);
            paragraph.innerHTML =`${before}<span id="${annotation.id}" class="annotation clickable" onclick="viewAnnotation('${annotation.id}', this);">${annotation.quote}</span>${after}`;

            return;
        }
    };
}

//`${before}<a id="${annotation.id}" class="annotation clickable" onclick="viewAnnotation('${annotation.id}', this);">${annotation.quote}</span>${after}`;
/*
`${before}
<span id="${annotation.id}" class="annotation clickable"
href="?id=${annotation.id}" onclick="event.preventDefault(); history.pushState(null, '', '?id=${annotation.id}'); findTarget();"
>${annotation.quote}</span>${after}`;
*/

function findTarget()
{
    const query = new URLSearchParams(window.location.search);
    if(query.has("id"))
    {
        const desiredID = query.get("id");
        const desiredElement = document.getElementById(desiredID);
        viewAnnotation(desiredID, desiredElement);
    }
}