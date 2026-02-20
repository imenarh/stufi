// Dashboard module - M5: Stats, Charts, Cap

var Dashboard = (function() {
    'use strict';

    var records = [];
    var settings = {};

    // Load data
    function init() {
        records = Storage.loadRecords();
        loadSettings();
        render();
    }

    function loadSettings() {
        try {
            var data = localStorage.getItem('stufi:settings');
            settings = data ? JSON.parse(data) : { spendingCap: 500 };
        } catch (e) {
            settings = { spendingCap: 500 };
        }
    }

    // Calculate stats
    function getStats() {
        var total = 0;
        var categories = {};

        for (var i = 0; i < records.length; i++) {
            var r = records[i];
            var amount = parseFloat(r.amount) || 0;
            total += amount;

            if (!categories[r.category]) {
                categories[r.category] = 0;
            }
            categories[r.category] += amount;
        }

        // Find top category
        var topCat = '—';
        var topAmount = 0;
        for (var cat in categories) {
            if (categories[cat] > topAmount) {
                topAmount = categories[cat];
                topCat = cat;
            }
        }

        // 7-day trend
        var sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        var trend = 0;
        var dailyTotals = [0, 0, 0, 0, 0, 0, 0];

        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var today = new Date().getDay();

        for (var i = 0; i < records.length; i++) {
            var r = records[i];
            var recordDate = new Date(r.date);
            if (recordDate >= sevenDaysAgo) {
                trend += parseFloat(r.amount) || 0;
                var dayIndex = recordDate.getDay();
                dailyTotals[dayIndex] += parseFloat(r.amount) || 0;
            }
        }

        return {
            total: total,
            count: records.length,
            topCategory: topCat,
            sevenDayTrend: trend,
            categories: categories,
            dailyTotals: dailyTotals,
            days: days,
            today: today
        };
    }

    // Format currency
    function formatCurrency(amount) {
        return 'RWF ' + amount.toFixed(2);
    }

    // Render stats cards
    function renderStats(stats) {
        document.getElementById('total-spent').textContent = formatCurrency(stats.total);
        document.getElementById('record-count').textContent = stats.count;
        document.getElementById('top-category').textContent = stats.topCategory;
        document.getElementById('seven-day-trend').textContent = formatCurrency(stats.sevenDayTrend);
    }

    // Render cap progress
    function renderCap(stats) {
        var cap = settings.spendingCap || 500;
        var current = stats.total;
        var percentage = cap > 0 ? (current / cap) * 100 : 0;

        // Clamp percentage
        if (percentage > 100) percentage = 100;

        // Update progress bar
        var fill = document.getElementById('cap-progress-fill');
        if (fill) {
            fill.style.width = percentage + '%';
            
            // Change color if over cap
            if (current > cap) {
                fill.style.background = 'var(--color-danger)';
            } else if (percentage >= 80) {
                fill.style.background = 'var(--color-warning)';
            } else {
                fill.style.background = 'var(--color-primary)';
            }
        }

        // Update labels
        document.getElementById('cap-current').textContent = formatCurrency(current);
        document.getElementById('cap-target').textContent = 'of ' + formatCurrency(cap);

        // Update ARIA
        var progressbar = document.querySelector('[role="progressbar"]');
        if (progressbar) {
            progressbar.setAttribute('aria-valuenow', Math.round(percentage));
            progressbar.setAttribute('aria-valuemax', 100);
        }

        // Update status with ARIA live
        var status = document.getElementById('cap-status');
        var liveRegion = document.getElementById('alert-region');
        var politeRegion = document.getElementById('live-region');

        if (current > cap) {
            var overBy = current - cap;
            status.textContent = 'Over cap by ' + formatCurrency(overBy) + '!';
            status.style.color = 'var(--color-danger)';
            
            // Assertive alert for over cap
            if (liveRegion) {
                liveRegion.textContent = 'Warning: You have exceeded your spending cap by ' + formatCurrency(overBy);
            }
        } else if (percentage >= 80) {
            var remaining = cap - current;
            status.textContent = formatCurrency(remaining) + ' remaining';
            status.style.color = 'var(--color-warning)';
            
            if (politeRegion) {
                politeRegion.textContent = 'You have ' + formatCurrency(remaining) + ' remaining in your spending cap';
            }
        } else {
            var remaining = cap - current;
            status.textContent = formatCurrency(remaining) + ' remaining';
            status.style.color = 'var(--color-text-light)';
        }
    }

    // Render 7-day chart
    function renderChart(stats) {
        var chart = document.getElementById('trend-chart');
        if (!chart) return;

        var bars = chart.querySelectorAll('div[data-day]');
        if (!bars.length) return;

        // Find max for scaling
        var maxDaily = 0;
        for (var i = 0; i < stats.dailyTotals.length; i++) {
            if (stats.dailyTotals[i] > maxDaily) {
                maxDaily = stats.dailyTotals[i];
            }
        }

        // Set bar heights
        for (var i = 0; i < bars.length; i++) {
            var dayName = bars[i].getAttribute('data-day');
            var dayIndex = stats.days.indexOf(dayName);
            var amount = dayIndex >= 0 ? stats.dailyTotals[dayIndex] : 0;
            
            var barFill = bars[i].querySelector('div');
            if (barFill) {
                var height = maxDaily > 0 ? (amount / maxDaily) * 100 : 0;
                barFill.style.height = height + '%';
            }
        }
    }

    // Main render
    function render() {
        var stats = getStats();
        renderStats(stats);
        renderCap(stats);
        renderChart(stats);
    }

    return {
        init: init,
        render: render
    };
})();
