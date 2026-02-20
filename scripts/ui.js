// UI module - rendering

var UI = (function() {
    'use strict';

    // Format date
    function formatDate(dateStr) {
        var d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    // Format currency
    function formatCurrency(amount) {
        return 'RWF ' + parseFloat(amount).toFixed(2);
    }

    // Render table
    function renderTable(recs, regex) {
        var tbody = document.getElementById('records-tbody');
        if (!recs.length) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--color-text-light)">No records found</td></tr>';
            return;
        }
        var html = '';
        for (var i = 0; i < recs.length; i++) {
            var r = recs[i];
            html += '<tr>' +
                '<td>' + Search.highlight(formatDate(r.date), regex) + '</td>' +
                '<td>' + Search.highlight(r.description, regex) + '</td>' +
                '<td><span class="category-badge">' + Search.highlight(r.category, regex) + '</span></td>' +
                '<td>' + Search.highlight(formatCurrency(r.amount), regex) + '</td>' +
            '</tr>';
        }
        tbody.innerHTML = html;
    }

    // Render cards (mobile)
    function renderCards(recs, regex) {
        var container = document.getElementById('records-cards');
        if (!recs.length) {
            container.innerHTML = '<div class="card center"><p>No records found</p></div>';
            return;
        }
        var html = '';
        for (var i = 0; i < recs.length; i++) {
            var r = recs[i];
            html += '<div class="card">' +
                '<div class="card-header">' +
                    '<span class="card-date">' + Search.highlight(formatDate(r.date), regex) + '</span>' +
                    '<span class="card-amount">' + Search.highlight(formatCurrency(r.amount), regex) + '</span>' +
                '</div>' +
                '<p class="card-description">' + Search.highlight(r.description, regex) + '</p>' +
                '<span class="card-category">' + Search.highlight(r.category, regex) + '</span>' +
            '</div>';
        }
        container.innerHTML = html;
    }

    // Update results count
    function updateCount(filtered, total) {
        var countEl = document.getElementById('results-count');
        if (countEl) {
            countEl.textContent = filtered + ' of ' + total + ' transactions';
        }
    }

    // Toggle empty state
    function toggleEmpty(hasRecords) {
        var emptyState = document.getElementById('empty-state');
        var tableContainer = document.getElementById('table-container');
        if (emptyState) emptyState.hidden = hasRecords;
        if (tableContainer) tableContainer.hidden = !hasRecords;
    }

    return {
        renderTable: renderTable,
        renderCards: renderCards,
        updateCount: updateCount,
        toggleEmpty: toggleEmpty
    };
})();
