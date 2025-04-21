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
        const success = await addAnnotation(annotation);
        if(!success) console.log(`Failed to add ${annotation.id}`);
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

            paragraph.innerHTML = `${before}<span id="${annotation.id}" class="annotation clickable"
            href="?id=${annotation.id}" onclick="linkSilently('${annotation.id}', event); findTarget();"
            >${annotation.quote}</span>${after}`;

            return true;
        }
    };
    return false;
}

function linkSilently(annotationID, event)
{
    event.preventDefault();
    history.replaceState(null, "", `?id=${annotationID}`);
}

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