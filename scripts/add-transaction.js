// Add/Edit Transaction page functionality - M3

(function() {
    'use strict';

    var form = document.getElementById('transaction-form');
    var recentList = document.getElementById('recent-list');
    var editMode = false;
    var editingId = null;

    function init() {
        if (!form) return;
        
        populateCategories();
        checkEditMode();
        form.addEventListener('submit', handleSubmit);
        loadRecent();
    }

    function checkEditMode() {
        var params = new URLSearchParams(window.location.search);
        editingId = params.get('edit');
        
        if (editingId) {
            editMode = true;
            loadRecordForEdit(editingId);
            
            document.getElementById('form-heading').textContent = 'Edit Transaction';
            document.getElementById('submit-btn').textContent = 'Update Transaction';
            
            var recentCard = document.getElementById('recent-table');
            if (recentCard) recentCard.hidden = true;
        }
    }

    function loadRecordForEdit(id) {
        var records = Storage.loadRecords();
        var record = records.find(function(r) {
            return r.id === id;
        });
        
        if (record) {
            document.getElementById('transaction-id').value = record.id;
            document.getElementById('description').value = record.description;
            document.getElementById('amount').value = record.amount;
            document.getElementById('date').value = record.date;
            document.getElementById('category').value = record.category;
        } else {
            alert('Record not found');
            window.location.href = 'records.html';
        }
    }

    function populateCategories() {
        var select = document.getElementById('category');
        if (!select) return;
        
        var settings = Settings.load();
        var categories = settings.categories || ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];
        
        var html = '<option value="">Select a category</option>';
        for (var i = 0; i < categories.length; i++) {
            html += '<option value="' + escapeHtml(categories[i]) + '">' + escapeHtml(categories[i]) + '</option>';
        }
        select.innerHTML = html;
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        var description = document.getElementById('description').value.trim();
        var amount = document.getElementById('amount').value.trim();
        var date = document.getElementById('date').value;
        var category = document.getElementById('category').value;
        
        var valid = true;
        
        clearErrors();
        
        if (!Validators.validateDescription(description)) {
            showError('description-error', 'Invalid description');
            valid = false;
        }
        
        if (Validators.hasDuplicateWords(description)) {
            showError('description-error', 'Duplicate consecutive words detected');
            valid = false;
        }
        
        if (!Validators.validateAmount(amount)) {
            showError('amount-error', 'Invalid amount');
            valid = false;
        }
        
        if (!Validators.validateDate(date)) {
            showError('date-error', 'Invalid date');
            valid = false;
        }
        
        if (!Validators.validateCategory(category)) {
            showError('category-error', 'Please select a category');
            valid = false;
        }
        
        if (!valid) return;
        
        var records = Storage.loadRecords();
        
        if (editMode && editingId) {
            var index = records.findIndex(function(r) {
                return r.id === editingId;
            });
            
            if (index > -1) {
                records[index].description = description;
                records[index].amount = parseFloat(amount);
                records[index].category = category;
                records[index].date = date;
                records[index].updatedAt = new Date().toISOString();
            }
            
            Storage.saveRecords(records);
            announce('Transaction updated: ' + description);
        } else {
            var newRecord = {
                id: 'txn_' + String(Date.now()).slice(-8),
                description: description,
                amount: parseFloat(amount),
                category: category,
                date: date,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            records.push(newRecord);
            Storage.saveRecords(records);
            announce('Transaction added: ' + description);
        }
        
        window.location.href = 'records.html';
    }

    function showError(id, message) {
        var el = document.getElementById(id);
        if (el) {
            el.textContent = message;
        }
    }

    function clearErrors() {
        var errors = document.querySelectorAll('.form-error');
        for (var i = 0; i < errors.length; i++) {
            errors[i].textContent = '';
        }
    }

    function loadRecent() {
        if (!recentList || editMode) return;
        
        var records = Storage.loadRecords();
        var recent = records.slice(-5).reverse();
        
        if (recent.length === 0) {
            recentList.innerHTML = '<p class="no-recent">No recent transactions</p>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < recent.length; i++) {
            var r = recent[i];
            html += '<div class="recent-item">';
            html += '<span class="recent-desc">' + escapeHtml(r.description) + '</span>';
            html += '<span class="recent-amount">RWF ' + r.amount.toFixed(2) + '</span>';
            html += '</div>';
        }
        
        recentList.innerHTML = html;
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function announce(message) {
        var region = document.getElementById('live-region');
        if (region) {
            region.textContent = message;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
