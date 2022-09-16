## Translator

A translator add on for Firefox for my personal use, although you can use it too. Only supports some websites and some elements on those sites.

## Supported websites

Currently Bilibili and Dodo.

## How to Install

On the github page, click "Code" and then "Download ZIP", extract the ZIP somewhere and then in Firefox go to "about:debugging" then click "This 
Firefox" and then "Load Temporary Add-on..." and find the files you just extracted and load the "manifest.json" file.

## How to Use

Move your mouse over an element and press F1 to translate it, press F1 again to untranslate it. You can also press F2 to update the extension.

## Server

This requires an API that it can ping for translations. By default this pings my personal translation server. If you wish to host the server yourself on 
your personal computer (in case mine goes down or you want faster speeds), you can, but there are various things that must be done to set it up, but all 
the required files are located in the Server folder. First, you have to modify the Firefox add on by adding the local IP of your computer to the 
"permissions" section in "manifest.json". You then want to edit the "APIServer" variable at the top of "translator.js" to also point to this local IP. 
Finally, you need to setup a MariaDB/MySQL cache. This requires a table as shown below, and you will need to modify the connection information in 
"Server/translate.php". Of course, also make sure php as well as translate-shell is installed.

```
API.GenericCache
+---------+----------+------+-----+---------+----------------+
| Field   | Type     | Null | Key | Default | Extra          |
+---------+----------+------+-----+---------+----------------+
| RowID   | int(11)  | NO   | PRI | NULL    | auto_increment |
| Service | longtext | YES  |     | NULL    |                |
| Input   | longtext | YES  |     | NULL    |                |
| Output  | longtext | YES  |     | NULL    |                |
+---------+----------+------+-----+---------+----------------+
```
