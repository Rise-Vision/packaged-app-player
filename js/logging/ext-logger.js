// Copyright © 2010 - May 2015 Rise Vision Incorporated.
// Use of this software is governed by the GPLv3 license
// (reproduced in the LICENSE file).

var $rv = $rv || {};

rvExtLogger = function() {
        this.PROJECT_ID = "client-side-events";
        this.DATASET_ID = "CAP_Events";
	this.EXT_SERVICE_URL = "https://www.googleapis.com/bigquery/v2/projects/PROJECT_ID/datasets/DATASET_ID/tables/TABLE_ID/insertAll";
        this.EXT_SERVICE_URL = this.EXT_SERVICE_URL.replace("PROJECT_ID", this.PROJECT_ID);
        this.EXT_SERVICE_URL = this.EXT_SERVICE_URL.replace("DATASET_ID", this.DATASET_ID);
        this.REFRESH_URL = "https://www.googleapis.com/oauth2/v3/token?client_id=1088527147109-6q1o2vtihn34292pjt4ckhmhck0rk0o7.apps.googleusercontent.com&client_secret=nlZyrcPLg6oEwO9f9Wfn29Wh&refresh_token=1/xzt4kwzE1H7W9VnKB8cAaCx6zb4Es4nKEoqaYHdTD15IgOrJDtdun6zK6XiATCKT&grant_type=refresh_token";
        this.HTTP_METHOD = "POST";
        this.HEADERS = new Headers();
        this.HEADERS.append("Content-Type", "application/json");
        this.INSERT = {
            "kind": "bigquery#tableDataInsertAllRequest",
            "skipInvalidRows": false,
            "ignoreUnknownValues": false,
            "rows": [
              {
                "insertId": "",
                "json": {
                  "event": "",
                  "display_id": "",
                  "ip": "",
                  "os": $rv.config.osName,
                  "chrome_version": /Chrome\/([0-9.]+)/.exec(navigator.appVersion)[1],
                  "cap_version": $rv.config.appVersion,
                  "time_millis": 0
                }
              }
            ]
        };
        this.REFRESH_DATE = 0;

	this.log = function(eventName) {
          var self = this;
          if (!eventName) {return;}

          return this.refresh()
          .then(function(refreshData) {
            var date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            insertData = self.INSERT,
            headers = self.HEADERS,
            serviceUrl;

            if (month < 10) {month = "0" + month;}
            if (day < 10) {day = "0" + day;}

            serviceUrl = self.EXT_SERVICE_URL.replace("TABLE_ID", "events" + year + month + day);

            self.REFRESH_DATE = refreshData.refreshedAt || self.REFRESH_DATE;
            self.TOKEN = refreshData.token || self.TOKEN;

            insertData.rows[0].insertId = Math.random().toString(36).substr(2).toUpperCase();
            insertData.rows[0].json.event = eventName;
            insertData.rows[0].json.display_id = $rv.config.displayId || "";
            insertData.rows[0].json.time_millis = new Date() - 0;
            headers.set("Authorization", "Bearer " + self.TOKEN);

            return fetch(serviceUrl.replace("TABLE_ID", "events" + year + month + day), {
              method: "POST",
              body: JSON.stringify(insertData),
              headers: headers
            });
          });
        };

        this.refresh = function() {
          var self = this;
          return new Promise(function(resolve, reject) {
            if (new Date() - self.REFRESH_DATE < 3580000) {
              return resolve({});
            }

            fetch(self.REFRESH_URL, {method: "POST"})
            .then(function(resp) {
              return resp.json();
            })
            .then(function(json) {
              resolve({token: json.access_token, refreshedAt: new Date()});
            });
          });
        };
};

