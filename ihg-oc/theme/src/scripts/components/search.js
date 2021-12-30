// Note: because of how Salesforce generates the search results, this is ... interesting.
// Be prepared to lose lots of hours if you try to tweak/work with this!

var observers = [];

function closest(el, selector) {
  var matchesFn;

  // find vendor prefix
  ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
      if (typeof document.body[fn] == 'function') {
          matchesFn = fn;
          return true;
      }
      return false;
  })

  var parent;

  // traverse parents
  while (el) {
      parent = el.parentElement;
      if (parent && parent[matchesFn](selector)) {
          return parent;
      }
      el = parent;
  }

  return null;
}

export function isSearchPage() {
  return document.querySelectorAll(".forceCommunitySearch").length;
}

export function init() {
  var sanityCheck = 0;
  // console.log("Setting up search override");
  // set up a mutation observer to look for search results
  // set up the mutation observer
  var observer = new MutationObserver(function (mutations, me) {

    // for single category searches the header is there immediately.
    var el = document.querySelector(".forceSearchResultsRegion > .forceSearchResultsGridView");

    if (!el) {
      // for multi-category searches there's a feed-end instead
      var el = document.querySelector(".feed-end");
    }

    if (el) {
      if (!el.classList.contains('initialized')) {
//        console.log(document.querySelector(".forceSearchResultsRegion"));
        // if (sanityCheck++ > 500) {
        //   me.disconnect();
        // }

        //console.log("doing overrides");
        searchOverrides(el); // passing the container to set the initialized class on once we're done
        //console.log("done");
        return;
      }
    }
  });

  // start observing
  observer.observe(document, {
    childList: true,
    subtree: true
  });

}

function searchOverrides(container) {
  //console.log("Start of overrides");
    // first clear any previously set custom-search classes.
  document.querySelectorAll(".initialized .custom-search").forEach(function(el) {
//    el.classList.remove("custom-search");
  });

  // the titles/search types to search for and manipulate
  // console.log("Initializing search overrides");
  var searchTypes = ['Resources', 'Glossary'];
  var seenCount = 0;

  // iterate over the parent item to make things easier
  if (document.querySelectorAll(".forceSearchResultsRegion .resultsItem").length) {
    // multiple search categories - e.g. "All results"
    var searchFor = '.forceSearchResultsRegion .resultsItem';
    var wantCount = searchTypes.length;

  } else {
    // otherwise it's a single search so we don't look for resultsItem
    var searchFor = '.forceSearchResultsRegion';
    var wantCount = 1;
  }

  document.querySelectorAll(searchFor).forEach(function(parent) {

    var item = parent.querySelector(".slds-page-header__title");
   //  console.log(item.textContent);
    if (searchTypes.includes(item.textContent)) {

      // now manipulate the data
      // to keep the code simple we're assuming that the title is always in the first column and the correct link is always in the second.
      // if the component changes in SF, this code will break.

      var theData = parent.querySelector(".searchScroller table tbody");

      if (!theData) {
        console.log("Not loaded yet"); return;
      }

      var renderer = theData.getAttribute('data-aura-rendered-by');
      // check if we have rows. If not, they haven't ajax loaded yet so we go back.
      var selector = 'tbody[data-aura-rendered-by="' + renderer + '"]';
      //console.log('adding observer for ' + selector);
      // because of salesforce madness we're going to need to use a mutation observer in here too...
      observeAndUpdateSearch(selector);
      seenCount++;

    }

    // if our count of processed records matches the count, we're done.
    if (seenCount == wantCount) {
      container.classList.add('initialized');
    }
  });

}

function observeAndUpdateSearch(selector) {
  // console.log("in the observer");
  if (selector in observers) return;
  observers[selector] = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {

      if (!mutation.addedNodes) return // we only care about new elements

      for (var i = 0; i < mutation.addedNodes.length; i++) {
        // do things to your newly added nodes here
        if (mutation.addedNodes[i].tagName.toLowerCase() == 'tr') {
          var row = mutation.addedNodes[i];
          // console.log(row);
          row = correctRowLinks(row);

          // make sure the parent table has the classname
          var container = closest(row, '.resultsItem');
          if (!container) {
            container = closest(row, '.forceSearchResultsRegion');
          }

          if (!container.classList.contains('custom-search')) {
            container.classList.add('custom-search');
          }
        }
        // console.log(mutation.addedNodes[i]);
      }
    })
  })

  observers[selector].observe(document.body, {
    childList: true
  , subtree: true
  , attributes: false
  , characterData: false
  });

  // kill the observer after 5s if it's still running, because .. it shouldn't be (we hope).
  setTimeout(function() {
    observers[selector].disconnect();
  }, 750);
}

function correctRowLinks(row) {
  var linkDest = row.children[1].querySelector("a").getAttribute('href');
  // update the link of the first element.
  var linkEl = row.children[0].querySelector("a");
  linkEl.setAttribute('href', linkDest);

  // set target to self and get rid of classnames and data attributes
  linkEl.setAttribute("target", "_self");
  linkEl.removeAttribute('data-special-link');
  linkEl.removeAttribute('data-refid');
  linkEl.removeAttribute('data-recordid');
  linkEl.removeAttribute('data-aura-class');
  linkEl.removeAttribute('data-navigable');
  linkEl.className = '';

  // now clone the element to get rid of event listeners

  var new_element = linkEl.cloneNode(true);
  linkEl.parentNode.replaceChild(new_element, linkEl);

  return row;
}