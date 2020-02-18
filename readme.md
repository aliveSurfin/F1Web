```diff
- NO LONGER WORKING AS PLAYBACK URL REQUIRES AUTH
```

# F1 Web Viewer
Javascript file to grab vods & live races from the f1tv api <br/>
https://alivesurfin.github.io/F1Web/ <br/>
https://alivesurfin.github.io/F1Web/data.html <br/>
https://alivesurfin.github.io/F1Web/pitlane.html <br/>
https://alivesurfin.github.io/F1Web/selector.html <br/>
https://alivesurfin.github.io/F1Web/f2.html <br/>


## Getting Started
Main function of the js file is 
```
function search(year, event, session, stream, f1, file) 


```
### Parameters
year    : the year of the season eg : 2018 <br/>
event   : the name of the event eg: Spanish Grand Prix <br/>
session : the name of the session eg: F1 Race <br/>
stream  : the name of the stream eg: Sebastian Vettel(any driver name) / data / pit lane / driver / Main Feed <br/>
f1      : t/f to skip non f1 events | f2 f3 supercup etc will be skipped if f1 is true <br/>
file    : t/f return the m3u8 file as a blob url rather than a direct link <br/>


### If a parameter is not given it will be set to the defaults 
year    : latest year found <br/>
event   : latest event found <br/>
session : latest session found <br/>
stream  : main feed of stream <br/>
f1      : true <br/>
file    : false <br/>


### Returns
If file is selected it will return a blob url of the created m3u8 file <br/>
Because there is no extension on the file you **must** specify the mimeType in your hls player of choice, an example is given in index.html <br/>
```
mimeType: 'application/x-mpegURL',
```

If file is not selected it will return a direct link to the stream on the Formula 1 CDN <br/>

## Get Live
```
function getLive(stream)
```
### Parameters
If the stream parameter is given it will search for a stream that contains it <br/>
if not it will select the main feed<br/>
### Returns 
If a live stream is found it will return the direct url for that stream <br/>
if not it will return null <br/>


## Acknowledgments
Basically a js implementation of : https://github.com/SoMuchForSubtlety/F1viewer <br/>




# Coming Soon
Seasons before 2018 <br/>
Radio Selector: m3u8 file with all team radio streams for session <br/>

