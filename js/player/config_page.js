// use http://www.htmlescape.net/javaescape_tool.html or http://www.snible.org/java2/uni2java.html 
// to convert html (i.e. config_page.html) to string
//var rvConfigPageHtml = 
//"<html>\n<head>\n<title>Rise Player Configuration</title>\n<script type=\"text/javascript\">\n\nfunction save() {\nresetStatus();\nvar server = \"production\";\nif (document.getElementById(\"rbProduction\").checked) {\nserver = \"production\";\n} else if (document.getElementById(\"rbTest\").checked) {\nserver = \"test\";\n}\nvar displayId = document.getElementById(\"displayId\").value;\nvar claimId = document.getElementById(\"claimId\").value;\n\nvar playerUrl = \"http://localhost:9449/save_property?restart_viewer=true&display_id=\" + displayId + \"&claim_id=\" + claimId + \"&server=\" + server;\nvar xhr = new XMLHttpRequest();\nxhr.onload = onSuccess;\nxhr.onerror = onFailure;\nxhr.onError = onSuccess;\nxhr.open(\"GET\", playerUrl, false); //IMPORTANT! synchronous request\nxhr.send();\n}\n\nfunction reset() {\nresetStatus();\n\nvar playerUrl = \"http://localhost:9449/clear\";\nvar xhr = new XMLHttpRequest();\nxhr.onload = onSuccess;\nxhr.onerror = onFailure;\nxhr.onError = onSuccess;\nxhr.open(\"GET\", playerUrl, false); //IMPORTANT! synchronous request\nxhr.send();\n}\n\nfunction load() {\nresetStatus();\nvar server = \"[SERVER]\";\nif (server == \"test\") {\ndocument.getElementById(\"rbTest\").checked = true;\n} else {\ndocument.getElementById(\"rbProduction\").checked = true;\n}\n}\n\nfunction onSuccess(xhrProgressEvent) {\nvar xhr = xhrProgressEvent.target;\nif (xhr.readyState === 4) {\nif (xhr.status === 200) {\ndocument.getElementById(\"statusOK\").style.display = \"block\";\n} else {\ndocument.getElementById(\"statusError\").style.display = \"block\";\n}\n}\n}\n\nfunction onFailure() {\ndocument.getElementById(\"statusError\").style.display = \"block\";\n}\n\nfunction resetStatus() {\ndocument.getElementById(\"statusOK\").style.display = \"none\";\ndocument.getElementById(\"statusError\").style.display = \"none\";\n}\n\n</script>\n</head>\n<body style=\"margin: 0px;\" onload=\"load()\">\n<h1>\nRise Player Configuration</h1>\n<div id=\"statusOK\" style=\"background-color:#0CFF0C; width:200px; text-align:center; display:none;\">Success</div>\n<div id=\"statusError\" style=\"background-color:Red; width:200px; text-align:center; display:none;\">Failure</div>\n<table cellpadding=\"5\" cellspacing=\"0\" >\n<tr>\n<td>\nDisplay ID:\n</td>\n<td>\n<input id=\"displayId\" type=\"text\" value=\"[DISPLAY_ID]\" />\n</td>\n</tr>\n<tr>\n<td>\nClaim ID:\n</td>\n<td>\n<input id=\"claimId\" type=\"text\" value=\"[CLAIM_ID]\" />\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\nServer:\n</td>\n<td>\n<input id=\"rbProduction\" type=\"radio\" name=\"server\" value=\"Production\" checked=\"checked\" />Production<br />\n<input id=\"rbTest\" type=\"radio\" name=\"server\" value=\"Test\" />Test<br />\n</td>\n</tr>\n<tr>\n<td>\n</td>\n<td style=\"padding-top:10px\">\n<button onclick=\"save()\">Apply</button>\n<button onclick=\"reset()\">Reset</button>\n</td>\n</tr>\n</table>\n</body>\n</html>\n"
//;
//
//function rvGetConfigPageHtml(displayId, claimId, server) {
//	var res = rvConfigPageHtml.replace("[DISPLAY_ID]", displayId);
//	res = res.replace("[CLAIM_ID]", claimId);
//	res = res.replace("[SERVER]", server);
//	return res;
//}

function rvPlayerConfigPage() {

	var pageHTML = "";
	
	this.get = function(displayId, claimId, server, serverUrl) {
		var res = pageHTML.replace("[DISPLAY_ID]", displayId);
		res = res.replace("[CLAIM_ID]", claimId);
		res = res.replace("[SERVER]", server);
		res = res.replace("[SERVER_URL]", serverUrl);
		return res;
	}
	
	this.init = function() {
		download(chrome.runtime.getURL("config_page.html"));
	}
	
	var download = function(fileUrl) {
	    var xhr = new XMLHttpRequest();
	    xhr.responseType = "text";
	    //xhr.onerror = ???;
	    xhr.onload = function(xhrProgressEvent) {
	    	pageHTML = xhrProgressEvent.target.responseText;
	        //console.log(pageHTML);
	    }
	    xhr.open('GET', fileUrl, true); //async=true
	    xhr.send();
	};


	
}