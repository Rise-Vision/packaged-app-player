// Copyright © 2010 - May 2015 Rise Vision Incorporated.
// Use of this software is governed by the GPLv3 license
// (reproduced in the LICENSE file).

var $rv = $rv || {};

rvSegment = function() {

	this.SEGMENT_URL = "https://api.segment.io/v1/track";
        this.HTTP_METHOD = "POST";
        this.B64SEGMENT_KEY = "QUZ0WTN0TjEwQlFqNlJibmZwRERwOUh4OE4xbW9kS04=";
        this.HEADERS = new Headers();
        this.HEADERS.append("Content-Type", "application/json");
        this.HEADERS.append("Authorization", "Basic " + this.B64SEGMENT_KEY);
        this.DATA = {
          "userId": "",
          "event": "",
          "type": "track",
          "context": {
            "app": {
              "name": "CAP",
              "version": ""
            },
            "os": {
              "name": ""
            },
          },
          "integrations": {
            "All": true
          },
          "timestamp": ""
        };

	this.log = function(eventName) {
          this.DATA.userId = $rv.config.displayId;
          if (!this.DATA.userId) {this.DATA.userId = "anonymous";}
          this.DATA.event = eventName;
          this.DATA.context.app.version = $rv.config.appVersion;
          this.DATA.context.os.name = $rv.config.osName;
          this.DATA.timestamp = new Date();

          fetch(this.SEGMENT_URL, {
            method: this.HTTP_METHOD,
            body: JSON.stringify(this.DATA),
            headers: this.HEADERS
          })
        };
};

