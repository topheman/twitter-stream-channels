yuidoc-theme-topheman
=====================

My yuidoc theme, inspired by [royriojas/yuidoc-theme-blue](https://github.com/royriojas/yuidoc-theme-blue)

Usage
=====

###Install yuidoc

Globally

`````
npm install -g yuidocjs
`````

Or locally

`````
npm install yuidocjs --save-dev
`````

###Create yuidoc.json

`yuidoc.json` example:

```
{
  "name": "twitter-stream-channels",
  "description": "Manage multiple channel search on the same Twitter Stream",
  "url": "http://labs.topheman.com/",
  "options": {
    "linkNatives": "true",
    "attributesEmit": "false",
    "selleck": "false",
    "paths": [
      "./lib",
      "./mocks"
    ],
    "outdir": "./yuidoc",
    "themedir" : "./extras/yuidoc-theme-topheman"
  }
}
```

###Command

From global yuidoc

```
yuidoc -c yuidoc.json --project-version 0.2.4
```

From local yuidoc

```
node_modules/.bin/yuidoc -c yuidoc.json --project-version 0.2.4
```
