// Settings page functionality - M6

(function() {
    'use strict';

    var settings = {};

    // Initialize
    function init() {
        settings = Settings.load();
        populateForm();
        updateStorageInfo();
        setupEventListeners();
    }

    // Populate form with current settings
    function populateForm() {
        document.getElementById('spending-cap').value = settings.spendingCap || 500000;
        
        if (settings.rates) {
            if (settings.rates.USD) {
                document.getElementById('rate-usd').value = settings.rates.USD;
            }
            if (settings.rates.EUR) {
                document.getElementById('rate-eur').value = settings.rates.EUR;
            }
        }
        
        renderCategories();
    }

    // Render categories list
    function renderCategories() {
        var container = document.getElementById('categories-list');
        var categories = settings.categories || ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];
        
        var html = '';
        for (var i = 0; i < categories.length; i++) {
            var cat = categories[i];
            html += '<span class="category-tag">' + escapeHtml(cat) + 
                ' <button type="button" class="remove-tag" data-category="' + escapeHtml(cat) + '" aria-label="Remove ' + escapeHtml(cat) + ' category">&times;</button></span>';
        }
        container.innerHTML = html;
    }

    // Escape HTML
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Update storage info
    function updateStorageInfo() {
        var records = Storage.loadRecords();
        document.getElementById('records-stored').textContent = records.length;
        
        var used = new Blob([JSON.stringify(records)]).size;
        document.getElementById('storage-used').textContent = (used / 1024).toFixed(2) + ' KB';
    }

    // Setup event listeners
    function setupEventListeners() {
        // Save cap
        document.getElementById('save-cap-btn').addEventListener('click', saveCap);
        
        // Save rates
        document.getElementById('save-rates-btn').addEventListener('click', saveRates);
        
        // Add category
        document.getElementById('add-category-btn').addEventListener('click', addCategory);
        document.getElementById('new-category').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addCategory();
        });
        
        // Remove category (delegation)
        document.getElementById('categories-list').addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-tag')) {
                removeCategory(e.target.getAttribute('data-category'));
            }
        });
        
        // Export JSON
        document.getElementById('export-json-btn').addEventListener('click', exportJSON);
        
        // Export CSV
        document.getElementById('export-csv-btn').addEventListener('click', exportCSV);
        
        // Import JSON
        document.getElementById('import-file').addEventListener('change', importJSON);
        
        // Clear data
        document.getElementById('clear-data-btn').addEventListener('click', function() {
            showModal('clear-modal');
        });
        
        // Clear modal
        document.getElementById('clear-cancel').addEventListener('click', function() {
            hideModal('clear-modal');
        });
        document.getElementById('clear-confirm').addEventListener('click', clearAllData);
        
        // Close modal on backdrop click
        document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
            backdrop.addEventListener('click', function() {
                hideModal('clear-modal');
            });
        });
        
        // Escape key closes modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideModal('clear-modal');
            }
        });
    }

    // Save spending cap
    function saveCap() {
        var input = document.getElementById('spending-cap');
        var value = parseFloat(input.value);
        
        if (isNaN(value) || value < 0) {
            alert('Please enter a valid positive number');
            return;
        }
        
        settings.spendingCap = value;
        Settings.save(settings);
        
        announce('Spending cap saved: RWF ' + value.toFixed(2));
        alert('Spending cap saved!');
    }

    // Save rates
    function saveRates() {
        var usd = parseFloat(document.getElementById('rate-usd').value);
        var eur = parseFloat(document.getElementById('rate-eur').value);
        
        if (isNaN(usd) || isNaN(eur) || usd <= 0 || eur <= 0) {
            alert('Please enter valid positive numbers for rates');
            return;
        }
        
        settings.rates = { USD: usd, EUR: eur };
        Settings.save(settings);
        
        announce('Currency rates saved');
        alert('Rates saved!');
    }

    // Add category
    function addCategory() {
        var input = document.getElementById('new-category');
        var value = input.value.trim();
        
        if (!value) return;
        
        // Validate
        if (!Validators.validateCategory(value)) {
            alert('Invalid category. Use letters, spaces, and hyphens only.');
            return;
        }
        
        if (!settings.categories) {
            settings.categories = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];
        }
        
        if (settings.categories.indexOf(value) !== -1) {
            alert('Category already exists');
            return;
        }
        
        settings.categories.push(value);
        Settings.save(settings);
        
        input.value = '';
        renderCategories();
        announce('Category added: ' + value);
    }

    // Remove category
    function removeCategory(category) {
        if (!settings.categories) return;
        
        var index = settings.categories.indexOf(category);
        if (index > -1) {
            settings.categories.splice(index, 1);
            Settings.save(settings);
            renderCategories();
            announce('Category removed: ' + category);
        }
    }

    // Export JSON
    function exportJSON() {
        var data = {
            records: Storage.loadRecords(),
            settings: Settings.load(),
            exportedAt: new Date().toISOString()
        };
        
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        
        var a = document.createElement('a');
        a.href = url;
        a.download = 'stufi-export-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        
        URL.revokeObjectURL(url);
        announce('Data exported');
    }

    // Export CSV
    function exportCSV() {
        var records = Storage.loadRecords();
        
        if (records.length === 0) {
            alert('No records to export');
            return;
        }
        
        var csv = 'ID,Description,Amount,Category,Date,Created,Updated\n';
        
        for (var i = 0; i < records.length; i++) {
            var r = records[i];
            csv += [
                r.id,
                '"' + (r.description || '').replace(/"/g, '""') + '"',
                r.amount,
                r.category,
                r.date,
                r.createdAt || '',
                r.updatedAt || ''
            ].join(',') + '\n';
        }
        
        var blob = new Blob([csv], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        
        var a = document.createElement('a');
        a.href = url;
        a.download = 'stufi-export-' + new Date().toISOString().split('T')[0] + '.csv';
        a.click();
        
        URL.revokeObjectURL(url);
        announce('CSV exported');
    }

    // Import JSON
    function importJSON(e) {
        var file = e.target.files[0];
        if (!file) return;
        
        var reader = new FileReader();
        reader.onload = function(event) {
            try {
                var data = JSON.parse(event.target.result);
                
                // Validate structure
                if (data.records && !Array.isArray(data.records)) {
                    throw new Error('Invalid data structure: records must be an array');
                }
                
                // Validate each record
                if (data.records) {
                    for (var i = 0; i < data.records.length; i++) {
                        var r = data.records[i];
                        if (!r.id || !r.description || r.amount === undefined || !r.category || !r.date) {
                            throw new Error('Invalid record at index ' + i + ': missing required fields');
                        }
                    }
                }
                
                // Import records
                if (data.records && data.records.length > 0) {
                    Storage.saveRecords(data.records);
                }
                
                // Import settings
                if (data.settings) {
                    Settings.save(data.settings);
                    settings = Settings.load();
                }
                
                updateStorageInfo();
                populateForm();
                
                announce('Data imported successfully');
                alert('Imported ' + (data.records ? data.records.length : 0) + ' records');
            } catch (err) {
                alert('Import failed: ' + err.message);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    // Clear all data
    function clearAllData() {
        localStorage.removeItem('stufi:records');
        localStorage.removeItem('stufi:settings');
        
        settings = Settings.load(); // Reload defaults
        populateForm();
        updateStorageInfo();
        hideModal('clear-modal');
        
        announce('All data cleared');
        alert('All data has been cleared');
    }

    // Show modal
    function showModal(id) {
        var modal = document.getElementById(id);
        if (modal) {
            modal.hidden = false;
        }
    }

    // Hide modal
    function hideModal(id) {
        var modal = document.getElementById(id);
        if (modal) {
            modal.hidden = true;
        }
    }

    // Announce for screen readers
    function announce(message) {
        var region = document.getElementById('live-region');
        if (region) {
            region.textContent = message;
        }
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
