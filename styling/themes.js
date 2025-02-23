function refreshPage()
{
    if(localStorage.getItem("headcol") == null) return;

    let styles = document.documentElement.style;
    styles.setProperty("--theme-header", localStorage.getItem("headcol"));
    styles.setProperty("--theme-bg", localStorage.getItem("bgcol"));
    styles.setProperty("--theme-body", localStorage.getItem("pagecol"));
    styles.setProperty("--theme-text", localStorage.getItem("textcol"));
    styles.setProperty("--theme-link", localStorage.getItem("linkcol"));
    styles.setProperty("--theme-highlight", localStorage.getItem("highcol"));
    styles.setProperty("--theme-header-var", localStorage.getItem("headmix") + "%");
    styles.setProperty("--theme-bg-var", localStorage.getItem("bgmix") + "%");
    styles.setProperty("--theme-body-var", localStorage.getItem("pagemix") + "%");
}

refreshPage();