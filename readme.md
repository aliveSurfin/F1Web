# F1 Web Viewer
Javascript file to grab vods & live races from the f1tv api

## Getting Started
Main function of the js file is 
```
function search(year, event, session, stream, f1) 

```
### Parameters
year    : the year of the season eg : 2018 <br/>
event   : the name of the event eg: Spanish Grand Prix <br/>
session : the name of the session eg: F1 Race <br/>
stream  : the name of the stream eg: Sebastian Vettel(any driver name) / data / pit lane / driver / Main Feed <br/>
f1      : t/f to skip non f1 events | f2 f3 supercup etc will be skipped if f1 is true <br/>


### If a parameter is not given it will be set to the defaults 
year    : latest year found <br/>
event   : latest event found <br/>
session : latest session found <br/>
stream  : main feed of stream <br/>
f1      : true 


### Returns
```
window.URL.createObjectURL(data);
```
data : the created m3u8 file returned as a blob url <br/>

Because there is no extension on the file you **must** specify the mimeType in your hls player of choice, an example is given in index.html <br/>


```
mimeType: 'application/x-mpegURL',
```
## Acknowledgments
Basically a js implentation of : https://github.com/SoMuchForSubtlety/F1viewer




# Coming Soon
Seasons before 2018 <br/>
Radio Selector: m3u8 file with all team radio streams for session <br/>

