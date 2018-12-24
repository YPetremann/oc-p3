function ajaxGET(url, data=null) {
	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		req.open("GET", url);
		req.addEventListener("load", function() {
			if (req.status >= 200 && req.status < 400) {
				resolve(req.responseText);
			} else {
				reject(req.status + " " + req.statusText + " " + url)
			}
		});
		req.addEventListener("error", function() {
			reject("Erreur réseau avec l'URL " + url)
		});
		req.send(data);
	});
}
function ajaxPOST(url, data=null, isJson=false) {
	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		req.open("POST", url);
		req.addEventListener("load", function() {
			if (req.status >= 200 && req.status < 400) {
				resolve(req.responseText);
			} else {
				reject(req.status + " " + req.statusText + " " + url)
			}
		});
		req.addEventListener("error", function() {
			reject("Erreur réseau avec l'URL " + url)
		});
		if (isJson) {
			req.setRequestHeader("Content-Type", "application/json");
			var object = {};
			data.forEach(function(value, key){ object[key] = value; });
			data = JSON.stringify(object);
		}
		req.send(data);
	});
}
