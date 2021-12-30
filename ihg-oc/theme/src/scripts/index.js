// helpers
// import * as Allied from './components/allied';
// import * as Search from './components/search';
// import Glide, { Controls } from '../../node_modules/@glidejs/glide/dist/glide.modular.esm';
// export { Glide, Controls };

setInterval(init, 500); // run stuff on a timer... use sparingly!


function init() {

  /*
  if (window.self != window.top) { // this was breaking; may no longer be needed
    document.querySelectorAll("body:not(.in-edit)")[0].classList.add("in-edit");
  }
  */

  // could combine / simplify all of this...

  // Do our CSS overrides
  var classMagic = document.querySelectorAll(".class-setter:not(.hs-processed)");
  if (classMagic.length) {
    classMagic.forEach(function(el) {
      var cssWrap = el.getAttribute('data-classname');
      if (cssWrap.length) cssWrap = cssWrap.split(" ");
      var cssWrapped = el.getAttribute('data-parent');
      if (cssWrap.length > 0) {

        if (cssWrapped == 'Section') {
          // we're wrapping the section
          var parent = el.closest('.cb-section');
        } else if (cssWrapped == 'Column') {
          var parent = el.closest('.cb-section_column');
        }
        DOMTokenList.prototype.add.apply(parent.classList, cssWrap); // see https://stackoverflow.com/questions/11115998/is-there-a-way-to-add-remove-several-classes-in-one-single-instruction-with-clas
        // parent.classList.add(cssWrap);
        el.classList.add("hs-processed");
        el.closest(".ui-widget").classList.add("class-setter-container");
      }

    });
  }
  var articles = document.querySelectorAll(".articles-item:not(.hs-processed), .acknowltngKnowledgeArticleItem .head-page:not(.hs-processed)");
  if (articles.length) {
    articles.forEach(function(el) {
      // get the value of the badge
      var badgeVal = el.querySelector(".slds-badge").textContent;
      el.setAttribute("data-articleType", badgeVal);
      el.classList.add("hs-processed");
    });
  }

  // same thing for main article page
  var articlePage = document.querySelectorAll(".acknowltngKnowledgeArticleItem:not(.hs-processed)");

  if (articlePage.length) {
    articlePage = articlePage[0];
    articlePage.classList.add("hs-processed");
  }


}

//// OLD STUFF FROM INIT() BELOW
//  new Glide('.glide').mount()
/*
var activators = document.querySelectorAll("a[href*='#x']");
  Array.prototype.forEach.call(activators, function(el, i) {
    if (el.style.display != 'none') {
      var parent = el.closest(".ui-widget");
      var classes = el.href.split("#")[1].split("|");

      classes.forEach(function(item) {
        item = item.substring(2);
        parent.classList.add(item);
      });

      // hide the element (don't want to get rid of it because of how SF renders pages)
      el.style.display = 'none';
    }
  });

  if (document.getElementById('allied-member-container')) {
//    console.log("Initializing Allied Members");
    Allied.init();
  }

  if (Search.isSearchPage()) {
    Search.init();
  }
*/
