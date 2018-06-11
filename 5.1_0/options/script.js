function closeOptions(){
    chrome.windows.getCurrent(function(win) {
        chrome.tabs.getSelected(win.id, function(tab) {
            chrome.tabs.remove(tab.id);
        });
    });
}

function saveOptions(){
    localStorage["gglobal.openNewTab"] = document.getElementById("gglobal.openNewTab").checked;
    localStorage["gglobal.personalized"] = document.getElementById("gglobal.personalized").checked;

    localStorage["gglobal.languageCode"] = document.getElementById("gglobal.languageCode").value;
    localStorage["gglobal.defaultLanguage"] = document.getElementById("gglobal.defaultLanguage").checked;

    localStorage["gglobal.tbZipCode"] = document.getElementById("gglobal.tbZipCode").value;
    localStorage["gglobal.enableLocalSearch"] = document.getElementById("gglobal.enableLocalSearch").checked;

    localStorage["gglobal.turnOnAdTest"] = document.getElementById("gglobal.turnOnAdTest").checked;

    saveSearchesList();
	
	chrome.extension.sendRequest({ action: "buildContextMenu" })
}

/*
 * Save the Searches List to the "extensions.gglobal.searches" preference.
 * This is called by the pref's system when the GUI element is altered.
 */
function saveSearchesList() {
    var searchesTable = document.getElementById("searches-table");

    var prefString = "";
    for (var i = 1; i < searchesTable.rows.length; i++) {
        var columns = searchesTable.rows[i].cells;

        var str = columns[0].innerHTML + ".ITEM."
                + columns[1].innerHTML + ".ITEM."
                + columns[2].innerHTML + ".ITEM."
                + columns[3].innerHTML + ".ITEM."
                + columns[4].innerHTML + ".ITEM."
                + columns[5].innerHTML + ".ITEM."
                + columns[6].innerHTML + ".ITEM."
                + columns[7].innerText;

        if (prefString == "") {
            prefString = str;
        } else {
            prefString += ".NEXT." + str;
        }
    }

    localStorage["gglobal.searches"] = prefString;
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    document.getElementById("gglobal.openNewTab").checked = localStorage["gglobal.openNewTab"] == "true";
    document.getElementById("gglobal.personalized").checked = localStorage["gglobal.personalized"] == "true";

    var languageCode = localStorage["gglobal.languageCode"];

    if (languageCode != null) {
        document.getElementById("gglobal.languageCode").value = languageCode;
    }

    document.getElementById("gglobal.defaultLanguage").checked = localStorage["gglobal.defaultLanguage"] == "true";

    var tbZipCode = localStorage["gglobal.tbZipCode"];
    if (tbZipCode != null) {
        document.getElementById("gglobal.tbZipCode").value = tbZipCode;
    }

    document.getElementById("gglobal.enableLocalSearch").checked = localStorage["gglobal.enableLocalSearch"] == "true";
    document.getElementById("gglobal.turnOnAdTest").checked = localStorage["gglobal.turnOnAdTest"] == "true";

    var disabled = localStorage["gglobal.defaultLanguage"] != "true";
    document.getElementById("gglobal.languageCode").disabled = disabled;

    disabled = localStorage["gglobal.enableLocalSearch"] != "true";
    document.getElementById("gglobal.tbZipCode").disabled = disabled;

    populateSearchesList();
}


function updateLanguageControls(e) {
    var disabled = !e.target.checked;

    document.getElementById("gglobal.languageCode").disabled = disabled;
}

function updateLocalSearchControls(e) {
    var disabled = !e.target.checked;

    document.getElementById("gglobal.tbZipCode").disabled = disabled;
}

function populateSearchesList() {
    var prefString = localStorage["gglobal.searches"];
    if (prefString == "") {
        return;
    }

    var searches = prefString.split(".NEXT.");
    var searchesTable = document.getElementById("searches-table");

    for (var i = 0; i < searches.length; i++) {
        var pieces = searches[i].split(".ITEM.");

        var newRow = searchesTable.insertRow(-1);
        newRow.setAttribute("class", "normal-row");
        newRow.onclick = function(event){ selectTableRow(event.target.parentNode); };

        for (var k = 0; k < 8; k++) {
            var itm = newRow.insertCell(k);
            if (typeof(pieces[k]) == "undefined" || pieces[k] == null) {
                pieces[k] = "";
            }
            itm.innerHTML = pieces[k];
        }
    }
}

function selectTableRow(tr) {
    tr.setAttribute("class", "selected-row");

    document.getElementById("searches-table").selectedRow = tr;

    var row = tr.parentNode.firstChild;
    while (row != null) {
        if (row.tagName == "TR" && row != tr) {
            row.setAttribute("class", "normal-row");
        }

        row = row.nextSibling;
    }

    rowSelected(tr);
}

function rowSelected(row) {

    document.getElementById("editButton").disabled = false;
    document.getElementById("deleteButton").disabled = false;

    if (!row) {
        document.getElementById("upButton").disabled = true;
        document.getElementById("downButton").disabled = true;
        return;
    }

    document.getElementById("upButton").disabled = row.rowIndex == 1;
    document.getElementById("downButton").disabled = (row.nextSibling == null);
}

function getPrevRow(row) {
    while (row != null) {
        if (row.previousSibling == null) {
            return null;
        }

        if (row.previousSibling.tagName == "TR") {
            return row;
        }
        row = row.previousSibling;
    }

    return null;
}

function moveRow(direction) {
    var searchesTable = document.getElementById("searches-table");

    var row = searchesTable.selectedRow;

    var index = row.rowIndex;

    searchesTable.deleteRow(index);

    var newRow = searchesTable.insertRow(direction == "up" ? index - 1 : index + 1);
	newRow.onclick = function(event){ selectTableRow(event.target.parentNode); };

    var ch = row.firstChild;
    var i = 0;
    while (ch != null) {
        var cell = newRow.insertCell(i);

        cell.innerHTML = ch.innerHTML;

        ch = ch.nextSibling;
        i++;
    }

    selectTableRow(newRow);
}

function addNewSearch() {
	document.getElementById("addButton").value = "Add";
	
    var searchesTable = document.getElementById("searches-table");

    showEditSearchPanel();

    var editPanel = document.getElementById("edit-search");
    editPanel.mode = "add";

    var editName = document.getElementById("editName");
    editName.value = "new search...";
    document.getElementById("editExtension").value = ".com";

    editName.focus();
}

function editSearch() {
    var searchesTable = document.getElementById("searches-table");

    var row = searchesTable.selectedRow;

    if (row) {
        showEditSearchPanel();
		
		document.getElementById("addButton").value = "Edit";

        var editPanel = document.getElementById("edit-search");
        editPanel.mode = "edit";

        var elements = editPanel.getElementsByTagName("input");

        var index = 0;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].getAttribute("type") == "text") {

                elements[i].value = row.cells[index].innerHTML;
                index++;
            }
        }
    }
}

function showEditSearchPanel() {
    hideDiv(document.getElementById("current-searches"));
    hideDiv(document.getElementById("optionsTable"));
    document.getElementById("close-button-container").style.visibility = "hidden";

    showDiv(document.getElementById("edit-search"));
}

function deleteSearch() {
    if(!confirm("Are you sure you want to delete this?")) return;

    var searchesTable = document.getElementById("searches-table");

    var row = searchesTable.selectedRow;

    if (row) {
        var index = row.rowIndex;
        searchesTable.deleteRow(index);

        if (index > 1) {
            selectTableRow(searchesTable.rows[index - 1]);
        } else {

            if (searchesTable.rows.length == 1) {
                document.getElementById("editButton").disabled = true;
                document.getElementById("deleteButton").disabled = true;
            } else {
                selectTableRow(searchesTable.rows[index]);
            }
        }
    }
}

function openTab(url) {
    chrome.tabs.create({
        "url" : url,
        "selected" : true
    });
}

function addSearch() {
    var searchesTable = document.getElementById("searches-table");

    var editPanel = document.getElementById("edit-search");
    var elements = editPanel.getElementsByTagName("input");

    if(document.getElementById("editName").value == ""){
        alert("You must supply a name!"); return;
    }

    var index = 0;

    if (editPanel.mode == "edit") {

        var row = searchesTable.selectedRow;

        if (row) {

            for (var i = 0; i < elements.length; i++) {
                if (elements[i].getAttribute("type") == "text") {

                    row.cells[index].innerHTML = elements[i].value;
                    index++;
                }
            }
        }
    } else if (editPanel.mode == "add") {
        var newRow = searchesTable.insertRow(-1);
        newRow.setAttribute("class", "normal-row");
		newRow.onclick = function(event){ selectTableRow(event.target.parentNode); };

        for (var i = 0; i < elements.length; i++) {
            if (elements[i].getAttribute("type") == "text") {

                var itm = newRow.insertCell(index);
                itm.innerHTML = elements[i].value;

                index++;
            }
        }
    }

    cancelEditing();
    saveSearchesList();
}

function cancelEditing() {
    hideDiv(document.getElementById("edit-search"));

    showDiv(document.getElementById("current-searches"));
    showDiv(document.getElementById("optionsTable"));

    document.getElementById("close-button-container").style.visibility = "visible";
}

function handleButtonClick(e) {

    var div;
    if (e.target.tagName != "DIV") {
        div = e.target.parentNode;
    } else {
        div = e.target;
    }

    var divOptions = document.getElementById("page-options");
    var divAbout = document.getElementById("page-about");

    if (div.id == "buttonOptions") {
        document.getElementById("buttonAbout").setAttribute("class", "tab-button-normal");

        hideDiv(divAbout);
        showDiv(divOptions);
    } else if (div.id == "buttonAbout") {
        document.getElementById("buttonOptions").setAttribute("class", "tab-button-normal");

        hideDiv(divOptions);
        showDiv(divAbout);
    }

    div.setAttribute("class", "tab-button-selected");
}

function hideDiv(div) {
    div.style.display = "none";
}

function showDiv(div) {
    div.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById("buttonAbout").onclick = handleButtonClick;
	document.getElementById("buttonOptions").onclick = handleButtonClick;
	
	document.getElementById("upButton").onclick = function(){ moveRow("up"); };
	document.getElementById("downButton").onclick = function(){ moveRow("down"); };
	
	document.getElementById("editButton").onclick = function(){ editSearch(); };
	document.getElementById("deleteButton").onclick = function(){ deleteSearch(); };
	
	document.getElementById("addNewSearch").onclick = function(){ addNewSearch(); };
	
	document.getElementById("addButton").onclick = function(){ addSearch(); };
	document.getElementById("cancelButton").onclick = function(){ cancelEditing(); };
	
	var s = document.getElementsByClassName("saveOptions");
	s[0].onclick = s[1].onclick = function(){ saveOptions(); };
	var c = document.getElementsByClassName("closeOptions");
	c[0].onclick = c[1].onclick = function(){ closeOptions(); };
	
	restore_options();
});