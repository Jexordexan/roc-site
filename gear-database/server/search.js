SearchSource.defineSource('gear', function(searchText, options) {
  var options = {sort: {updated: -1}, limit: 20};

  if(searchText) {
    var terms = splitByComma(searchText);
    var matchByOrder = fuzzyMatch(terms);
    var matchBySequence = exactMatch(terms);
    var selector = {$or: [
      {code: matchByOrder},
      {name: matchBySequence}
    ]};
    return GearList.find(selector , options).fetch();
  } else {
    return GearList.find({}, options).fetch();
  }
});

SearchSource.defineSource('members', function(searchText, options) {
  var options = {sort: {"profile.lastName": -1}, limit: 10};

  if(searchText) {
    var terms = splitByComma(searchText);
    var matchByOrder = fuzzyMatch(terms);
    var matchBySequence = exactMatch(terms);
    var selector = {$or: [
      // {username: matchByOrder},
      // {"emails.$": matchByOrder},
      {'profile.firstName': matchBySequence},
      {'profile.lastName': matchBySequence}
    ]};
    return Meteor.users.find(selector, options).fetch();
  } else {
    return Meteor.users.find({}, options).fetch();
  }
});

// RegEx Helpers

// Take a raw search string and split it by terms
function splitByComma(searchText) {
  return searchText.trim().match(/([^,]+)/g);
}

// Match the order the letters appear for any term. Case insensitive.
// For instance, the term "BIg" will match with "Bigelow" AND "Building"
function fuzzyMatch(terms) {
  var query = [];
  _.each(terms, function(part) {
    var letters = part.trim().split("");
    query.push("(" + letters.join('.*') + ")");
  });
  var queryString = query.join('|');
  return new RegExp(queryString, "i");
}

// Match the exact letter sequence of any term. Case insensitive.
// For instance, the term "BIg" will match with "Bigelow" NOT "Building"
function exactMatch(terms) {
  var query = [];
  _.each(terms, function(part) {
    query.push("(" + part.trim() + ")");
  });
  var queryString = query.join('|');
  return new RegExp(queryString, "i");
}
