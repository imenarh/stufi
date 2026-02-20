// Main app - records page

(function() {
    'use strict';

    var currentSort = 'date-desc';

    function render() {
        var searchInput = document.getElementById('search-input');
        var sortSelect = document.getElementById('sort-select');

        var pattern = searchInput ? searchInput.value : '';
        currentSort = sortSelect ? sortSelect.value : 'date-desc';

        // Get records
        var records = State.getRecords();

        // Filter and sort
        var filtered = Search.filterRecords(records, pattern);
        var sorted = State.sortRecords(filtered, currentSort);
        var regex = Search.compileRegex(pattern);

        // Render
        UI.renderTable(sorted, regex);
        UI.renderCards(sorted, regex);
        UI.updateCount(sorted.length, records.length);
        UI.toggleEmpty(records.length > 0);
    }

    function init() {
        State.init();
        render();

        var searchInput = document.getElementById('search-input');
        var sortSelect = document.getElementById('sort-select');

        if (searchInput) searchInput.addEventListener('input', render);
        if (sortSelect) sortSelect.addEventListener('change', render);
    }

    init();
})();
