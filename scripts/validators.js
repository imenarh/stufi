var Validators = (function() {
    // Description: no leading/trailing spaces, no double spaces
    var DESCRIPTION_REGEX = /\s{2,}/;
    
    // Amount: positive number, max 2 decimals
    var AMOUNT_REGEX = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    
    // Date: YYYY-MM-DD format
    var DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    
    // Category: letters, spaces, hyphens
    var CATEGORY_REGEX = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    
    // Advanced: duplicate words (back-reference)
    var DUPLICATE_REGEX = /\b(\w+)\s+\1\b/i;

    //validator functions
    function validateDescription(value) {
        if (!value || value.trim() === '') return false;
        if (value !== value.trim()) return false;
        if (DESCRIPTION_REGEX.test(value)) return false;
        return true;
    }

    function validateAmount(value) {
        var str = String(value).trim();
        if (!str) return false;
        return AMOUNT_REGEX.test(str);
    }

    function validateDate(value) {
        if (!value || value.trim() === '') return false;
        return DATE_REGEX.test(value);
    }

    function validateCategory(value) {
        if (!value || value.trim() === '') return false;
        return CATEGORY_REGEX.test(value);
    }

    function hasDuplicateWords(value) {
        if (!value) return false;
        return new RegExp(DUPLICATE_REGEX.source, 'i').test(value);
    }

    //test function
    function runTests() {
        var results = [];
        
        // Description tests
        results.push(assert(validateDescription('Lunch at cafeteria'), 'Description: valid text'));
        results.push(assert(validateDescription('Coffee'), 'Description: single word'));
        results.push(assert(!validateDescription(' leading'), 'Description: leading space fails'));
        results.push(assert(!validateDescription('trailing '), 'Description: trailing space fails'));
        results.push(assert(!validateDescription('double  space'), 'Description: double space fails'));
        results.push(assert(!validateDescription(''), 'Description: empty fails'));
        
        // Amount tests
        results.push(assert(validateAmount('12.50'), 'Amount: 12.50 valid'));
        results.push(assert(validateAmount('0'), 'Amount: 0 valid'));
        results.push(assert(validateAmount('100'), 'Amount: 100 valid'));
        results.push(assert(!validateAmount('-5'), 'Amount: negative fails'));
        results.push(assert(!validateAmount('12.500'), 'Amount: 3 decimals fails'));
        results.push(assert(!validateAmount('abc'), 'Amount: letters fail'));
        
        // Date tests
        results.push(assert(validateDate('2026-09-29'), 'Date: 2026-09-29 valid'));
        results.push(assert(validateDate('2026-01-01'), 'Date: 2026-01-01 valid'));
        results.push(assert(!validateDate('2026-13-01'), 'Date: month 13 fails'));
        results.push(assert(!validateDate('2026-00-15'), 'Date: month 0 fails'));
        results.push(assert(!validateDate('25-09-29'), 'Date: short year fails'));
        
        // Category tests
        results.push(assert(validateCategory('Food'), 'Category: Food valid'));
        results.push(assert(validateCategory('Fast Food'), 'Category: two words valid'));
        results.push(assert(validateCategory('Fast-Food'), 'Category: hyphen valid'));
        results.push(assert(!validateCategory('Food123'), 'Category: numbers fail'));
        results.push(assert(!validateCategory(''), 'Category: empty fails'));
        
        // Duplicate words (advanced regex with back-reference)
        results.push(assert(hasDuplicateWords('the the'), 'Duplicate: "the the" detected'));
        results.push(assert(hasDuplicateWords('coffee coffee'), 'Duplicate: "coffee coffee" detected'));
        results.push(assert(!hasDuplicateWords('the cat'), 'Duplicate: "the cat" not duplicate'));
        
        return results;
    }

    function assert(condition, name) {
        return { pass: condition, name: name };
    }

    function addResults(results) {
        var container = document.getElementById('test-results');
        var summary = document.getElementById('test-summary');
        
        var html = '<table class="test-table"><thead><tr><th>Test</th><th>Status</th></tr></thead><tbody>';
        
        var passCount = 0;
        var failCount = 0;
        
        for (var i = 0; i < results.length; i++) {
            var r = results[i];
            if (r.pass) passCount++;
            else failCount++;
            
            var rowClass = r.pass ? 'pass' : 'fail';
            var statusText = r.pass ? '✓ PASS' : '✗ FAIL';
            
            html += '<tr class="' + rowClass + '">';
            html += '<td>' + r.name + '</td>';
            html += '<td class="test-status ' + rowClass + '">' + statusText + '</td>';
            html += '</tr>';
        }
        
        html += '</tbody></table>';
        container.innerHTML = html;
        
        document.getElementById('summary-text').textContent = passCount + ' passed, ' + failCount + ' failed';
        summary.hidden = false;
    }

    function init() {
        document.getElementById('run-tests').addEventListener('click', function() {
            var results = runTests();
            addResults(results);
        });
    }

    //exporting the functions
    return {
        validateDescription,
        validateAmount,
        validateDate,
        validateCategory,
        hasDuplicateWords,
        init
    };
})();
