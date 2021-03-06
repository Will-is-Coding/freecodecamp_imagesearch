'use strict';

//Using bing's search API
var Search = require('bing.search');
var util = require('util');
var url = require('url');

var search = new Search('vT/9WAjOCyVriUj64jnFcXsG6pd82onQhLbX8vBi70U');

var image = function(result) {
    this.url = result.url;
    this.snippet = result.title;
    this.thumbnail = result.thumbnail.url;
    this.context = result.sourceUrl;
};

var recentSearch = function(term, date) {
    this.term = term;
    this.when = date;
};

//Exported object, holding search options and the recently searched
var imageSearch = function() {
    this.recentlySearched = [];
    this.searchTerm = null;
    this.perPage = 10;
    this.offset = 1;
};

//Parse the search term from the parsed url's pathname \imagesearch\
imageSearch.prototype.parseSearch = function(originalUrl) {
  var parsed_url = url.parse(originalUrl, true);
  var regEx = new RegExp("\/imagesearch\/(.*)");
  
  this.searchTerm = parsed_url.pathname.match(regEx)[1];
  this.searchTerm = decodeURIComponent(this.searchTerm);
  
  if( parsed_url.query !== null ) //Check if they input the offset for paginating
    this.offset = parsed_url.query.offset;
  
  var now = new Date();
  var newSearch = new recentSearch( this.searchTerm, now.toUTCString()); 
  this.recentlySearched.push(newSearch);
};


imageSearch.prototype.search = function( originalUrl, res ) {
  this.parseSearch(originalUrl);
    
  var that = this; //To properly reference while inside bing's search.images() 
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write("<h1 style='text-align:center'>Searching images of " + this.searchTerm + "</h1>");
  search.images(that.searchTerm,
    {top: that.perPage, skip: that.offset * that.perPage},
    function(err, results) {
      if( err )
        throw new Error(err);
      
      //Iterate through the images returned and write them out
      for( var i = 0; i < results.length; i++ ) {
        var newImg = new image(results[i]);
        res.write(JSON.stringify(newImg));
        res.write("<br/>");
      }
      res.end();
    });
};

//Get the recent searches and what time they were preformed
imageSearch.prototype.recentSearches = function(res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write("<h1 style='text-align:center'>Recent Searches</h1>");
  if( this.recentlySearched.length === 0 )
    res.send("Woops! Nothing has been searched recently.");
  else {
    for( var i = 0; i < this.recentlySearched.length; i++ ) {
      res.write(JSON.stringify(this.recentlySearched[i]));
      res.write("<br/>");
    }
  }
  res.end();
};

module.exports = new imageSearch();
