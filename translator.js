var APIServer = "http://r3-13.com";
var nodesToTranslate;

function getNodes(n)
{
    var tmp = "";
    for (var i = 0; i < nodesToTranslate.length; i++)
    {
        if (i > 0) tmp += ",";
        tmp += nodesToTranslate[i] + ":not([" + n + "=" + n + "])";
    }
    return tmp;
}

var processingTranslation = false;
var doTranslate = function(txt, cb)
{
    //Get rid of translation cache

    /*var cache = localStorage.getItem("TranslationCache");
    cache = cache == null ? {} : JSON.parse(cache);
    var tid = btoa(escape(txt));
    if (cache[tid] != undefined)
    {
        cb(cache[tid]);
        return;
    }*/

    var http = new XMLHttpRequest();
    var url = APIServer + '/translate.php';
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'text/html');

    http.onreadystatechange = function()
    {
        if (http.readyState == 4)
        {
            if (http.status == 200)
            {
                /*cache[tid] = http.responseText;
                localStorage.setItem("TranslationCache", JSON.stringify(cache));*/
                cb(http.responseText);
            }
            else
            {
                cb(null);
            }
        }
    }
    http.send(txt);

}


var transEvent = function(elem)
{
    elem.setAttribute("translated", "translated");
    elem.setAttribute("originalText", btoa(escape(elem.innerHTML)));
    doTranslate(elem.innerHTML, x => elem.innerHTML = x);
};
var untransEvent = function(elem)
{
    elem.innerHTML = unescape(atob(elem.getAttribute("originalText")));
    elem.removeAttribute("translated");
};
var figureEvent = function()
{
    var elems = document.elementsFromPoint(mouse[0], mouse[1]);
    for (var i = 0; i < elems.length; i++)
    {
        if (elems[i].getAttribute("translatable") == "translatable")
        {
            if (elems[i].getAttribute("translated") == "translated")
            {
                untransEvent(elems[i]);
            }
            else
            {
                transEvent(elems[i]);
            }

        }
    }
}


var mouse = [-1, -1];
var translatorStarted = false;
var website = window.location.hostname.split(".");
website.shift();
website = website.join(".");
var nodeData = localStorage.getItem("TranslationWebsiteData");
if (nodeData == null || nodeData == "")
{
    var http = new XMLHttpRequest();
    var url = APIServer + '/website.php';
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'text/html');
    http.onreadystatechange = function()
    {
        if (http.readyState == 4)
        {
            if (http.status == 200)
            {
                nodeData = http.responseText.trim();
                localStorage.setItem("TranslationWebsiteData", nodeData);
                console.log(nodeData);
                nodesToTranslate = nodeData.split("\n");
                translatorStarted = true;
            }
        }
    }
    http.send(website);
}
else
{
    nodesToTranslate = nodeData.split("\n");
    translatorStarted = true;
}


setInterval(function()
{
    if (translatorStarted)
    {
        var nodes = document.querySelectorAll(getNodes());
        for (var i = 0; i < nodes.length; i++)
        {
            nodes[i].setAttribute("translatable", "translatable");
        }
    }
}, 1);

document.body.onmousemove = function(e)
{
    if (translatorStarted)
    {
        mouse = [e.clientX, e.clientY];
    }
};

document.body.onkeydown = function(e)
{
    if (translatorStarted)
    {
        if (e.key == "F1")
        {
            figureEvent();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (e.key == "F2")
        {
            localStorage.removeItem("TranslationWebsiteData");
            window.location.href = window.location.href;
        }
    }
};

