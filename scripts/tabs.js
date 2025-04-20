tabGroup = document.getElementById("tab-group");
tabChildren = [...tabGroup.querySelectorAll("nav")];
descriptionGroup = document.getElementById("description-content");
descriptionChildren = [...descriptionGroup.querySelectorAll("nav")];

function setTab(index)
{
    tabChildren.forEach(child => child.classList.remove("selected"));
    tabChildren[index].classList.add("selected");

    descriptionChildren.forEach(child => child.classList.add("invisible"));
    descriptionChildren[index].classList.remove("invisible");
}

setTab(0);