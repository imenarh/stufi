// Main app - records page

(function() {
    'use strict';

    var currentSort = 'date-desc';

    function render() {
        var searchInput = document.getElementById('search-input');
        var sortSelect = document.getElementById('sort-select');

        var pattern = searchInput ? searchInput.value : '';
        currentSort = sortSelect ? sortSelect.value : 'date-desc';

        var records = State.getRecords();
        var filtered = Search.filterRecords(records, pattern);
        var sorted = State.sortRecords(filtered, currentSort);
        var regex = Search.compileRegex(pattern);

        UI.renderTable(sorted, regex);
        UI.renderCards(sorted, regex);
        UI.updateCount(sorted.length, records.length);
        UI.toggleEmpty(records.length > 0);
    }

    function handleAction(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;

        var action = btn.getAttribute('data-action');
        var id = btn.getAttribute('data-id');

        if (action === 'edit') {
            window.location.href = 'add-transaction.html?edit=' + encodeURIComponent(id);
        } else if (action === 'delete') {
            if (confirm('Delete this transaction?')) {
                deleteRecord(id);
            }
        }
    }

    function deleteRecord(id) {
        var records = Storage.loadRecords();
        var filtered = records.filter(function(r) {
            return r.id !== id;
        });
        Storage.saveRecords(filtered);
        State.init();
        render();
        announce('Transaction deleted');
    }

    function announce(message) {
        var region = document.getElementById('live-region');
        if (region) region.textContent = message;
    }

    function init() {
        State.init();
        render();

        var searchInput = document.getElementById('search-input');
        var sortSelect = document.getElementById('sort-select');

        if (searchInput) searchInput.addEventListener('input', render);
        if (sortSelect) sortSelect.addEventListener('change', render);

        document.getElementById('records-tbody').addEventListener('click', handleAction);
        document.getElementById('records-cards').addEventListener('click', handleAction);
    }

    init();
})();
