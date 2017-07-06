module.exports.getAnchorList = function(selector) {
  var list = document.querySelectorAll(selector);
  var anchors = [];
  for(var i = 0; i < list.length; i++) {
    var anchor = {
      text: list[i].text,
      href: list[i].href
    };
    anchors.push(anchor);
  }
  return anchors;
};

module.exports.distinct = function(list, key) {
  var filteredList = [];
  var uniqueList = {};
  for(var i = 0; i < list.length; i++) {
    if(!uniqueList[list[i][key]]) {
      uniqueList[list[i][key]] = list[i];
      filteredList.push(list[i]);
    }
  }
  return filteredList;
};
