// Storage module - localStorage operations

var Storage = (function() {
    'use strict';

    var RECORDS_KEY = 'stufi:records';

    function loadRecords() {
        try {
            var data = localStorage.getItem(RECORDS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveRecords(records) {
        try {
            localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
            return true;
        } catch (e) {
            return false;
        }
    }

    return {
        loadRecords,
        saveRecords
    };
})();
