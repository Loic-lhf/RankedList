// Loaded in <head>: picks css/light.css or css/dark.css before the page is painted.
(function(){
    let th=null;try{th=localStorage.getItem("theme")}catch(e){}
    if(th!=="light"&&th!=="dark")th=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
    const l=document.createElement("link");l.rel="stylesheet";l.id="theme";l.href="css/"+th+".css";
    document.head.appendChild(l);
    window.currentTheme=th;
})();

function toggleTheme(){
    const th=window.currentTheme==="dark"?"light":"dark";
    window.currentTheme=th;
    document.getElementById("theme").href="css/"+th+".css";
    try{localStorage.setItem("theme",th)}catch(e){}
}
