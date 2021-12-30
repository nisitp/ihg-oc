import { tns } from "../../../node_modules/tiny-slider/src/tiny-slider"

var serverURL = "//www.owners.org/";
var today = new Date();
var dd = today.getDate().toString();
var mm = (today.getMonth() + 1).toString(); //January is 0!
var yyyy = today.getFullYear().toString();

var thedate = yyyy + "-" + mm + "-" + dd; // regen once a day

function getSearchParameters() {
  var prmstr = window.location.search.substr(1);
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
  }
  return params;
}

export function init() {
  // Allied Member functionality

  var xhr = new XMLHttpRequest();

  xhr.open('GET', serverURL + 'api/allied-members/category/global%20diamond?_format=json&ver=' + thedate);
//    xhr.withCredentials = true;
  // xhr.setRequestHeader("Authorization", "Basic " + btoa("owners:owners"));

  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

  xhr.onload = function() {

    if (xhr.status === 200) {
      console.log("success");
      var obj = JSON.parse(xhr.response);
      console.log(obj);
      obj.forEach(function(el) {
        var node = document.createElement("LI");

        var logo = el.field_member_logo.replace(/&amp;/g, '&');
        var imgnode = document.createElement('img');
        imgnode.src = logo;
        imgnode.alt = el.title.replace(/&amp;/g,'&');
        node.appendChild(imgnode);
        var theList = document.getElementById("allied-member-carousel");
        theList.appendChild(node);
      });

      console.log("initializing slider");

      var slider = tns({
        container: '#allied-member-carousel',
        items: 4,
        gutter: 20,
        edgePadding: 20,
        autoplay: true
      });
      console.log("done");


      // now trigger slick - using jquery for now since required by slick
      /*
      $('#allied-member-carousel').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
  appendArrows: '.carousel-container .slick__arrow',
      });
      */

    } else {
        console.error('Request failed.  Returned status of ' + xhr.status);
    }
  } // end onload

  xhr.send();

  // Now load up the non-carousel items

  var categories = ['platinum','gold','silver','bronze','associate'];
  categories.forEach(function(item) {
    var xhrItem = new XMLHttpRequest();
    xhrItem.open('GET', serverURL + 'api/allied-members/category/' + item + '?_format=json&ver=' + thedate);
    xhrItem.setRequestHeader("Content-type", "application/json; charset=utf-8");

    var theList = document.getElementById("allied-member-list-"+item);

    xhrItem.onload = function() {
      if (xhrItem.status === 200) {
          var obj = JSON.parse(xhrItem.response);
           obj.forEach(function(el) {
//         		if (el.field_logo != "") {
              var node = document.createElement("LI");
              var imgnode = document.createElement('img');
              var logo = el.field_member_logo.replace(/&amp;/g, '&');;
              imgnode.src = logo;
              imgnode.alt = el.title;
              node.appendChild(imgnode);
              theList.appendChild(node);
            //  makeClickable(imgnode, el.title);
        });
      }
    }
    xhrItem.send();
  });//end loop over categories

} // end init
