const files = ["/annotations/telegram.json", "/annotations/home.json", "/annotations/red-door.json", "/annotations/mother-son.json"];
let annotationList = [];
const annotationDict = {};

async function loadAnnotations(onComplete)
{
    for(let file of files)
    {
        const response = await fetch(file);
        const json = await response.json();
        annotationList = annotationList.concat(json);
    }
    annotationList.forEach(annotation => annotationDict[annotation.id] = annotation);

    onComplete();
}