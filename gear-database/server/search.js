SearchSource.defineSource('gear', (searchText, options) => {
  options = options || {sort: {updated: -1}, limit: 20};

  if(searchText) {
    const terms = splitByComma(searchText);
    const matchByOrder = fuzzyMatch(terms);
    const matchBySequence = exactMatch(terms);
    const selector = {$or: [
      {code: matchByOrder},
      {name: matchBySequence}
    ]};
    return GearList.find(selector , options).fetch();
  } else {
    return GearList.find({}, options).fetch();
  }
});

SearchSource.defineSource('members', (searchText, options) => {
  options = {sort: {"profile.lastName": -1}, limit: 10};

  if(searchText) {
    const terms = splitByComma(searchText);
    const matchByOrder = fuzzyMatch(terms);
    const matchBySequence = exactMatch(terms);
    const selector = {$or: [
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
// For instance, the term "BIg" will match with "Bigelow" AND "binge" AND "Building"
function fuzzyMatch(terms) {
  let query = [];
  _.each(terms, part => {
    const letters = part.trim().split("");
    query.push("(" + letters.join('.*') + ")");
  });
  queryString = query.join('|');
  return new RegExp(queryString, "i");
}

// Match the exact letter sequence of any term. Case insensitive.
// For instance, the term "BIg" will match with "Bigelow" NOT "Building"
function exactMatch(terms) {
  var query = [];
  _.each(terms, part => {
    query.push("(" + part.trim() + ")");
  });
  var queryString = query.join('|');
  return new RegExp(queryString, "i");
}
