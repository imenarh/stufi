// Settings module - M6: Persistence + Import/Export

var Settings = (function() {
    'use strict';

    var SETTINGS_KEY = 'stufi:settings';

    // Default settings
    var defaults = {
        spendingCap: 500000,
        categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other']
    };

    // Load settings
    function load() {
        try {
            var data = localStorage.getItem(SETTINGS_KEY);
            return data ? JSON.parse(data) : defaults;
        } catch (e) {
            return defaults;
        }
    }

    // Save settings
    function save(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            return false;
        }
    }

    // Update single setting
    function update(key, value) {
        var settings = load();
        settings[key] = value;
        save(settings);
        return settings;
    }

    // Get single setting
    function get(key) {
        var settings = load();
        return settings[key];
    }

    return {
        load: load,
        save: save,
        update: update,
        get: get
    };
})();
