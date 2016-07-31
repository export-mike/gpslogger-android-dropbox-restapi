# gpslogger-android-dropbox-restapi
This api authenticates with dropbox and returns gpx file data mapped to a nice readable json format for client frontends to communicate with

[More Info](https://github.com/mendhak/gpslogger/issues/452)

## Authentication 
is via dropbox oauth2. users can visit /auth/dropbox and allow the application

## GPX files
Code locates gpx files and converts them to json and returns the data on ```logs/:path``` ensure path is encodeURIComponent

###Setup your own server
feel free to deploy it on heroku on something and set the following ENV variables.
```
COOKIE_SECRET=<secret> for extra security on token once its been given to api
DROPBOX_KEY=<key>
DROPBOX_SECRET=<secret>
DEBUG='travelbug:*'
```

I'll be forking this basic setup for something else soon.
