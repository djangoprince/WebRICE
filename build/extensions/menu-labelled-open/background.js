
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

// Show WebRICE panel to the right .
var RightF = "WebRICE panel to the right";
var RightF = chrome.contextMenus.create({"title": RightF, "onclick": genericOnClick});
//leftF it was title before
// Show WebRICE panel to the left .
var LeftF = "WebRICE panel to the left";
var id = chrome.contextMenus.create({"title": LeftF, "onclick": genericOnClick});


// Create a parent item and two children.
//add icons
var parent = chrome.contextMenus.create({"title": "Configuration"});
var child1 = chrome.contextMenus.create(
  {"title": "Play", "parentId": parent, "onclick": genericOnClick});
var child2 = chrome.contextMenus.create(
  {"title": "Stop", "parentId": parent, "onclick": genericOnClick});
  var child3 = chrome.contextMenus.create(
    {"title": "Change speed", "parentId": parent, "onclick": genericOnClick});


// Create some radio items.
/*
function radioOnClick(info, tab) {
  console.log("radio item " + info.menuItemId +
              " was clicked (previous checked state was "  +
              info.wasChecked + ")");
}
var radio1 = chrome.contextMenus.create({"title": "Radio 1", "type": "radio",
                                         "onclick":radioOnClick});
var radio2 = chrome.contextMenus.create({"title": "Radio 2", "type": "radio",
                                         "onclick":radioOnClick});
console.log("radio1:" + radio1 + " radio2:" + radio2);
*/

// Create some checkbox items.
function checkboxOnClick(info, tab) {
  console.log(JSON.stringify(info));
  console.log("checkbox item " + info.menuItemId +
              " was clicked, state is now: " + info.checked +
              "(previous state was " + info.wasChecked + ")");

}
var parentFeatures = chrome.contextMenus.create({"title": "Features"});
var checkbox1 = chrome.contextMenus.create(
  {"title": "Select to listen", "parentId": parentFeatures, "type": "checkbox", "onclick":checkboxOnClick});
var checkbox2 = chrome.contextMenus.create(
  {"title": "Show statistics", "parentId": parentFeatures, "type": "checkbox", "onclick":checkboxOnClick});
  var checkbox3 = chrome.contextMenus.create(
    {"title": "Download recent mp3", "parentId": parentFeatures, "type": "checkbox", "onclick":checkboxOnClick});

var UninstallF = "Uninstall WebRICE";
var UninstallF = chrome.contextMenus.create({"title": UninstallF, "onclick": genericOnClick});

// Intentionally create an invalid item, to show off error checking in the
// create callback.
console.log("About to try creating an invalid item - an error about " +
            "item 999 should show up");
chrome.contextMenus.create({"title": "Oops", "parentId":999}, function() {
  if (chrome.extension.lastError) {
    console.log("Got expected error: " + chrome.extension.lastError.message);
  }
});
