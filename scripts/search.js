// Search module - regex search and highlight

var Search = (function() {
    'use strict';

    // Safe regex compiler (always case-insensitive)
    function compileRegex(pattern) {
        if (!pattern) return null;
        try {
            return new RegExp(pattern, 'i');
        } catch (e) {
            return null;
        }
    }

    // Filter records by regex
    function filterRecords(recs, pattern) {
        if (!pattern) return recs;
        var regex = compileRegex(pattern);
        if (!regex) return [];
        return recs.filter(function(r) {
            return regex.test(r.description) || 
                   regex.test(r.category) || 
                   regex.test(r.date) || 
                   regex.test(String(r.amount));
        });
    }

    // Highlight matches with <mark>
    function highlight(text, regex) {
        if (!regex) return escapeHtml(text);
        var escaped = escapeHtml(text);
        return escaped.replace(regex, '<mark>$&</mark>');
    }

    // Escape HTML
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    return {
        compileRegex,
        filterRecords,
        highlight
    };
})();
