// State module - application state

var State = (function() {
    'use strict';

    var records = [];

    function init() {
        records = Storage.loadRecords();
    }

    function getRecords() {
        return records.slice();
    }

    function sortRecords(recs, sortType) {
        var sorted = recs.slice();
        switch (sortType) {
            case 'date-desc':
                sorted.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
                break;
            case 'date-asc':
                sorted.sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
                break;
            case 'amount-desc':
                sorted.sort(function(a, b) { return b.amount - a.amount; });
                break;
            case 'amount-asc':
                sorted.sort(function(a, b) { return a.amount - b.amount; });
                break;
            case 'description-asc':
                sorted.sort(function(a, b) { return a.description.localeCompare(b.description); });
                break;
            case 'description-desc':
                sorted.sort(function(a, b) { return b.description.localeCompare(a.description); });
                break;
        }
        return sorted;
    }

    return {
        init: init,
        getRecords: getRecords,
        sortRecords: sortRecords
    };
})();
