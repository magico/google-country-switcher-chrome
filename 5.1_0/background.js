localStorage["isDamUserSigned"] = false;

chrome.extension.onRequest.addListener(requestHandler=function(request, sender, sendResponse){
	if (request.action == "buildContextMenu"){
		buildContextMenu();
	} else if (request.action == "navigateToGoogle"){
		alert("Please navigate to a Google Search results page before using this extension!");
	} else if (request.action == "openAll"){
		var searches = localStorage["gglobal.searches"].split(".NEXT.");
		for (var i = 0; i < searches.length; i++){
			var pieces = searches[i].split(".ITEM.");
			var name = pieces[0];

			//we found a name, bow build the search
			if (name != "") {
				openTab(buildUrl(pieces, request.gs), true);
			}
		}
	} else if (request.action == "openOne"){
		var searches = localStorage["gglobal.searches"].split(".NEXT.");
		
		for (var i = 0; i < searches.length; i++){
			var pieces = searches[i].split(".ITEM.");
			
			//we found the name
			if (pieces[0] == request.searchName){
				var url = buildUrl(pieces, request.gs);
				var pref_opnewtab = (localStorage["gglobal.openNewTab"] == "true");
				
				if(pref_opnewtab){
					openTab(url, true);
				} else {
					chrome.tabs.getSelected(null, function (tab){
						chrome.tabs.update(tab.id, { url: url, selected: false }, null);
					});
				}
				
				break;
			}
		}
	}
});

// Saves options to localStorage.
function onLoad(){
	if(localStorage["notFirstRun"] == null){
		openTab("http://www.google.com/", true);

		localStorage["gglobal.searches"] = "USA.ITEM..com.ITEM..ITEM.US.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.UK.ITEM..co.uk.ITEM..ITEM.UK.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.Australia.ITEM..com.au.ITEM..ITEM.AU.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.Austria.ITEM..at.ITEM..ITEM.AT.ITEM..ITEM..ITEM..ITEM.&hl=de.NEXT.Belgium (Dutch).ITEM..be.ITEM..ITEM.BE.ITEM..ITEM..ITEM..ITEM.&hl=nl.NEXT.Belgium (French).ITEM..be.ITEM..ITEM.BE.ITEM..ITEM..ITEM..ITEM.&hl=fr.NEXT.Brazil.ITEM..com.br.ITEM..ITEM.BR.ITEM..ITEM..ITEM..ITEM.&hl=pt-BR.NEXT.Canada (English).ITEM..ca.ITEM..ITEM.CA.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.Canada (French).ITEM..ca.ITEM..ITEM.CA.ITEM..ITEM..ITEM..ITEM.&hl=fr.NEXT.Czech Republic.ITEM..cz.ITEM..ITEM.CZ.ITEM..ITEM..ITEM..ITEM.&hl=cs.NEXT.Denmark.ITEM..dk.ITEM..ITEM.DK.ITEM..ITEM..ITEM..ITEM.&hl=da.NEXT.Finland.ITEM..fi.ITEM..ITEM.FI.ITEM..ITEM..ITEM..ITEM.&hl=fi.NEXT.France.ITEM..fr.ITEM..ITEM.FR.ITEM..ITEM..ITEM..ITEM.&hl=fr.NEXT.Germany.ITEM..de.ITEM..ITEM.DE.ITEM..ITEM..ITEM..ITEM.&hl=de.NEXT.Hong Kong (English).ITEM..com.hk.ITEM..ITEM.HK.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.Hong Kong (Chinese).ITEM..com.hk.ITEM..ITEM.HK.ITEM..ITEM..ITEM..ITEM.&hl=zh-TW.NEXT.Hungary.ITEM..hu.ITEM..ITEM.HU.ITEM..ITEM..ITEM..ITEM.&hl=hu.NEXT.India.ITEM..co.in.ITEM..ITEM.IN.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.Ireland.ITEM..ie.ITEM..ITEM.IE.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.Italy.ITEM..it.ITEM..ITEM.IT.ITEM..ITEM..ITEM..ITEM.&hl=it.NEXT.Japan.ITEM..co.jp.ITEM..ITEM.JA.ITEM..ITEM..ITEM..ITEM.&hl=ja.NEXT.Luxembourg.ITEM..lu.ITEM..ITEM.LU.ITEM..ITEM..ITEM..ITEM.&hl=fr.NEXT.Malaysia.ITEM..com.my.ITEM..ITEM.MY.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.Mexico.ITEM..mx.ITEM..ITEM.MX.ITEM..ITEM..ITEM..ITEM.&hl=es-419.NEXT.Netherlands.ITEM..nl.ITEM..ITEM.NL.ITEM..ITEM..ITEM..ITEM.&hl=nl.NEXT.New Zealand.ITEM..co.nz.ITEM..ITEM.NZ.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.Norway.ITEM..no.ITEM..ITEM.NO.ITEM..ITEM..ITEM..ITEM.&hl=no.NEXT.Philippines.ITEM..com.ph.ITEM..ITEM.PH.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.Poland.ITEM..pl.ITEM..ITEM.PL.ITEM..ITEM..ITEM..ITEM.&hl=pl.NEXT.Portugal.ITEM..pt.ITEM..ITEM.PT.ITEM..ITEM..ITEM..ITEM.&hl=pt.NEXT.Russia.ITEM..ru.ITEM..ITEM.RU.ITEM..ITEM..ITEM..ITEM.&hl=ru.NEXT.Singapore.ITEM..com.sg.ITEM..ITEM.SG.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.South Korea.ITEM..co.kr.ITEM..ITEM.KR.ITEM..ITEM..ITEM..ITEM.&hl=kr.NEXT.Spain.ITEM..es.ITEM..ITEM.ES.ITEM..ITEM..ITEM..ITEM.&hl=es.NEXT.Sweden.ITEM..se.ITEM..ITEM.SE.ITEM..ITEM..ITEM..ITEM.&hl=sv.NEXT.Switzerland (French).ITEM..ch.ITEM..ITEM.CH.ITEM..ITEM..ITEM..ITEM.&hl=fr.NEXT.Switzerland (German).ITEM..ch.ITEM..ITEM.CH.ITEM..ITEM..ITEM..ITEM.&hl=de.NEXT.Taiwan.ITEM..com.tw.ITEM..ITEM.TW.ITEM..ITEM..ITEM..ITEM.&hl=zh-TW.NEXT.Thailand (English).ITEM..co.th.ITEM..ITEM.TH.ITEM..ITEM..ITEM..ITEM.&hl=en.NEXT.Thailand (Thai).ITEM..co.th.ITEM..ITEM.TH.ITEM..ITEM..ITEM..ITEM.&hl=th.NEXT.Turkey.ITEM..com.tr.ITEM..ITEM.TR.ITEM..ITEM..ITEM..ITEM.&hl=tr.NEXT.UAE (Arabic).ITEM..ae.ITEM..ITEM.AE.ITEM..ITEM..ITEM..ITEM.&hl=ar.NEXT.UAE (English).ITEM..ae.ITEM..ITEM.AE.ITEM..ITEM..ITEM..ITEM.&hl=en.";
		localStorage["gglobal.languageCode"] = "en";
		localStorage["gglobal.tbZipCode"] = "";
		localStorage["notFirstRun"] = true;
	}
	
	buildContextMenu();
}

function buildContextMenu(){
	chrome.contextMenus.removeAll();
	
	chrome.contextMenus.create({
		type: "normal", id: "rgat-menu-item", title: "SEO Global", contexts: ["all"]
	});
	
	var node = null;
	var prefString = localStorage["gglobal.searches"];
	var searches = prefString.split(".NEXT.");
	var separator = document.getElementById("separator");
	
	for (var i = 0; i<searches.length; i++){
		var pieces = searches[i].split(".ITEM.");
		
		chrome.contextMenus.create({
			parentId: "rgat-menu-item", type: "normal", title: pieces[0], contexts: ["all"],
			id: pieces[0], onclick: function(info, tab){ onContextMenuItemCommand(info.menuItemId); }
		});
	}
}

function onContextMenuItemCommand(searchName){
	chrome.tabs.getSelected(null, function(tab) {
		var googleRegex = ':\/\/www\.google\.([a-zA-Z\.]{2,6})\/.*?q=(.*?)(&|$)';
		
		var m = new RegExp(googleRegex).exec(tab.url);
		if(m == null){
			alert("Please navigate to a Google Search results page before using this extension!"); return;
		}
		
		requestHandler({ action: "openOne", gs: m[2], searchName: searchName });
	});
}

function openTab(url, selected) {
	chrome.tabs.create({ "url" : url, "active": selected });
}

function buildUrl(pieces, qs) {
	var pref_personal = localStorage["gglobal.personalized"] == "true";
	
	var pref_turnOnAdTest = localStorage["gglobal.turnOnAdTest"] == "true";
	var pref_defaultLanguage = localStorage["gglobal.defaultLanguage"] == "true";
	var pref_enableLocalSearch = localStorage["gglobal.enableLocalSearch"] == "true";

	var ext = pieces[1];
	var reg = pieces[2];
	var country = pieces[3];
	var city = pieces[4];
	var zip = pieces[5];
	var ip = pieces[6];
	var adv = pieces[7];

	var url = "http://www.google";
	if (ext == "") {
		url += ".com/";
	} else {
		url += ext + "/";
	}

	url += 'search?q=' + qs;
	if (pref_personal) {
		url += '&pws=0';
	}

	// Turn On AdTest (Does not generate AdWords impressions or clicks)
	if (pref_turnOnAdTest) {
		url += '&adtest=on';
	}

	if (pref_defaultLanguage) {
		var lang = localStorage["gglobal.languageCode"];

		if (lang != null && lang != "") {
			url += '&hl=' + lang;
		}
	}

	if (pref_enableLocalSearch) {
		var zipCode = localStorage["gglobal.tbZipCode"];

		if (zipCode != null && zipCode != "") {
			url += '&ct=location-input-top&near=' + zipCode;
		}
	}

	//add region
	if (reg != "") {
		url += "&gr=" + reg;
	}

	//add country
	if (country != "") {
		url += "&gl=" + country;
	}

	//add city
	if (city != "") {
		url += "&gc=" + city;
	}

	//add zip
	if (zip != "") {
		url += "&gpc=" + zip;
	}

	//add IP
	if (ip != "") {
		url += "&ip=" + ip;
	}

	//add advanced options
	if (adv != "") {
		url += adv;
	}

	return url;
}

onLoad();