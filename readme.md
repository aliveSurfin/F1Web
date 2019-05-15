# F1 Web Viewer
Javascript file to grab vods & live races from the f1tv api

## Getting Started
Main function of the js file is 
```
function search(year, event, session, stream, f1) 

```
### Parameters
year    : the year of the season eg : 2018
event   : the name of the event eg: Spanish Grand Prix
session : the name of the session eg: F1 Race
stream  : the name of the stream eg: Sebastian Vettel(any driver name) / data / pit lane / driver / Main Feed
f1      : t/f to skip non f1 events | f2 f3 supercup etc will be skipped if f1 is true
### If a parameter is not given it will be set to the defaults 
year    : latest year found 
event   : latest event found
session : latest session found
stream  : main feed of stream
f1      : true 

## Acknowledgments
Basically a js implentation of : https://github.com/SoMuchForSubtlety/F1viewer
