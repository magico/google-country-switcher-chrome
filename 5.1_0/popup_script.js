function openAll() {
	chrome.tabs.getSelected(null, function(tab) {
		var googleRegex = ':\/\/www\.google\.([a-zA-Z\.]{2,6})\/.*?q=(.*?)(&|$)';

		var m = new RegExp(googleRegex).exec(tab.url);
		if (m == null) {
			chrome.extension.sendRequest({action: "navigateToGoogle"});
			window.close();
			return;
		}

		chrome.extension.sendRequest({action: "openAll", gs : m[2]});
		window.close();
	});
}

function openTab(url) {
	chrome.tabs.create({
		"url" : url,
		"selected" : true
	});
	window.close();
}

function onLoad(e) {
	var node = null;
	var prefString = localStorage["gglobal.searches"];
	var searches = prefString.split(".NEXT.");
	var separator = document.getElementById("separator");
	
	var pieces = [];
	
	for (var i = 0; i < searches.length; i++) {
		pieces = searches[i].split(".ITEM.");
		
		node = document.createElement("div");
		node.setAttribute("class", "item");
		node.setAttribute("id", pieces[0]);
		node.setAttribute("style", "background-image: url('flags/"+pieces[3].toLowerCase()+".png');");
		node.onclick = function(e){ onToolbarMenuItemCommand(e.target.id); };
		
		node.appendChild(document.createTextNode("  " + pieces[0] + "  "));

		document.body.insertBefore(node, separator);
	}
}

function onToolbarMenuItemCommand(searchName) {
	chrome.tabs.getSelected(null, function(tab) {
		var googleRegex = ':\/\/www\.google\.([a-zA-Z\.]{2,6})\/.*?q=(.*?)(&|$)';
		
		var m = new RegExp(googleRegex).exec(tab.url);
		if(m == null){
			chrome.extension.sendRequest({ action: "navigateToGoogle" });
			window.close(); return;
		}
		
		chrome.extension.sendRequest({ action: "openOne", gs: m[2], searchName: searchName });
		
		window.close();
	});
}

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById("openAll").onclick = function(){ openAll(); };
	document.getElementById("showOptions").onclick = function(){ openTab("options/options.html"); };
	
	onLoad();
});