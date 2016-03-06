'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recentSearch = new Schema({
    term: String,
    when: String
});

module.exports = mongoose.model('RecentSearch', recentSearch);