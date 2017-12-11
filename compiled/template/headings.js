"use strict";

module.exports = function (h, that) {

  var sortControl = require('./sort-control')(h, that);

  var headings = [];

  if (that.hasChildRow && that.opts.childRowTogglerFirst) headings.push(h(
    "th",
    null,
    []
  ));

  //Pulled from column-filters.js
  if (that.opts.replaceHeadingWithFilter){

    var textFilter = require('./text-filter')(h, that);
    var dateFilter = require('./date-filter')(h, that);
    var listFilter = require('./list-filter')(h, that);
  
    var filters = [];
    var filter;

  }
  //end pulled

  that.allColumns.map(function (column) {

    //Pulled from column-filters.js
    var filter = false;
    if (that.opts.replaceHeadingWithFilter){
      if (that.filterable(column)) {
        switch (true) {
          case that.isTextFilter(column):
            filter = textFilter(column);break;
          case that.isDateFilter(column):
            filter = dateFilter(column);break;
          case that.isListFilter(column):
            filter = listFilter(column);break;
        }
      }

      if (typeof that.$slots['filter__' + column] !== 'undefined') {
        filter = filter ? h(
          'div',
          null,
          [filter, that.$slots['filter__' + column]]
        ) : that.$slots['filter__' + column];
      }
    }
    //end pulled

    //Modified to allow filters to replace column headings
    headings.push(h(
      "th",
      {
        on: {
          "click": that.orderByColumn.bind(that, column)
        },

        "class": that.sortableClass(column) },
      [h(
        "span",
        { "class": "VueTables__heading", attrs: { title: that.getHeadingTooltip(column, h) }
        },
        [filter ? filter : that.getHeading(column, h)]
      ), sortControl(column)]
    ));
  }.bind(that));

  if (that.hasChildRow && !that.opts.childRowTogglerFirst) headings.push(h(
    "th",
    null,
    []
  ));

  return headings;
};