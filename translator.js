/*
Just draw a border round the document.body.
*/

var APIServer = "http://r3-13.com/translate.php";
var nodesToTranslate;



if (window.location.href.search("bilibili.com") >= 0)
    nodesToTranslate = 
    [
        ".v-popover-wrap span",
        ".right-entry-item span",
        ".entry-title span",
        "span.icon-title",
        "a.channel-link",
        ".sub-item .name",
        ".chat-item.danmaku-item span",
        ".chat-item.common-danmuku-msg div",
        "div.chat-item span",
        "div.small-title",
        ".brush-prompt span",
        ".nav-item span.label",
        "div.chat-item.convention-msg",
        "span.gift-info-title",
        "div.gift-info-desc",
        ".info p.label.live-skin-main-text",
        ".tab-candidate span",
        "div.room-introduction-content",
        ".original-card-content div.content-full",
        "span.suffix-text",
        "div.card.system-item",
        "span.menu-title",
        ".reply-wrap .con .text",
        ".reply-wrap .con .reply",
        ".reply-wrap .con .reply-time",
        "a.more-link",
        ".clearfix li",
        "div.bili-dyn-time",
        "div.bili-dyn-live-users__header",
        "div.bili-dyn-my-info__stat__item__label",
        "div.bili-dyn-list-tabs__item",
        "div.bili-dyn-list__notification",
        "div.bili-dyn-action",
        ".comment-emoji span.text",
        ".dynamic-repost label",
        ".bili-dyn-title span",
        ".bili-rich-text__content span",
        "div.bili-rich-text__action",
        "span.dyn-orig-author__action",
        "span.dyn-orig-author__name",
        "div.relevant-topic",
        "span.topic-panel__nav-title"
    ];
else if (window.location.href.search("imdodo.com") >= 0)
    nodesToTranslate = 
    [
        ".channel h1",
        ".group h1",
        ".name-info span",
        ".page-room .top h1",
        ".df-msg-item p",
        ".nick_wrap span",
        ".nickname-wrapper span",
        ".count-box .item .desc",
        ".user-list h5"
    ];


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

var nodesToEnable = ".channel h1:not([translated=translated]";
var processingTranslation = false;
var errorCounter = 0;

var doTranslate = function(txt, cb)
{
    var cache = localStorage.getItem("TranslationCache");
    cache = cache == null ? {} : JSON.parse(cache);
    var tid = btoa(escape(txt));
    if (cache[tid] != undefined)
    {
        cb(cache[tid]);
        return;
    }

    var http = new XMLHttpRequest();
    var url = 'http://r3-13.com/translate.php';
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'text/html');

    http.onreadystatechange = function()
    {
        if (http.readyState == 4)
        {
            if (http.status == 200)
            {
                cache[tid] = http.responseText;
                localStorage.setItem("TranslationCache", JSON.stringify(cache));
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
    var url = 'http://r3-13.com/website.php';
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

