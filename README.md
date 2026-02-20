# stuFi - Student Finance Tracker

A responsive web application for tracking student budgets and transactions, built with vanilla HTML, CSS, and JavaScript.

**Live website**: [GitHub Pages URL](https://imenarh.github.io/stufi/index.html)

**Video Demo**: [Loom URL]

---

## Overview

**stuFi** helps students track their spending with a clean, accessible interface. Features include transaction management, spending caps, category breakdowns, and regex-powered search.

---

## Setup Guide

```bash
# Clone the repository
git clone https://github.com/imenarh/stufi
cd stufi
```

Open `index.html` in your browser.

> To load sample data: Settings → Import JSON → select `seed.json`

---

## Features

- Add, edit, and delete transactions
- Dashboard with spending stats and 7-day trend chart
- Spending cap with progress indicator
- Category breakdown with visual bars
- Regex-powered search with match highlighting
- Sort by date, description, or amount
- Currency conversion (base + 2 others)
- Auto-save to localStorage
- JSON import/export with validation
- Fully keyboard-navigable
- Responsive design (mobile, tablet, desktop)

---

## Regex Catalog

### Validation Patterns

| Field | Pattern | Valid | Invalid |
|-------|---------|-------|---------|
| Description | `/^\S(?:.*\S)?$/` | `"Lunch at cafe"` | `" leading"`, `"trailing "` |
| Amount | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | `"12.50"`, `"0"`, `"100"` | `"-5"`, `"12.500"` |
| Date | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | `"2026-02-15"` | `"2026-13-01"` |
| Category | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | `"Food"`, `"Fast Food"` | `"Food123"` |

### Advanced Regex (Back-reference)

| Pattern | Purpose | Example |
|---------|---------|---------|
| `/\b(\w+)\s+\1\b/i` | Detect duplicate consecutive words | `"the the"` → match, `"the cat"` → no match |

### User Search Patterns

| Pattern | Purpose |
|---------|---------|
| `/coffee\|tea/i` | Find beverage transactions |
| `/\.\d{2}$/` | Find amounts with cents |
| `/^\d{3,}/` | Find amounts ≥ 100 |

---

## Keyboard Map

| Key | Action |
|-----|--------|
| `Tab` | Move focus forward |
| `Shift + Tab` | Move focus backward |
| `Enter` / `Space` | Activate focused element |
| `Escape` | Close modal / cancel edit |

---

## Accessibility

### Semantic Structure
- HTML5 landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Proper heading hierarchy (one `<h1>` per page)
- Skip-to-content link
- Labels bound to all form inputs

### Keyboard Support
- All interactive elements focusable
- Visible focus indicators (3px outline)
- No keyboard traps

### ARIA
- Live regions for dynamic updates (`aria-live`)
- Progress bar with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Form errors linked via `aria-describedby`

### Contrast
- Text contrast ≥ 4.5:1 (WCAG AA)
- Focus indicators contrast ≥ 3:1

---

## Testing

1. Open `tests.html` in your browser
2. Click **"Run Tests"**
3. View results in the table

**Tests include:**
- Description validation (6 tests)
- Amount validation (6 tests)
- Date validation (5 tests)
- Category validation (5 tests)
- Duplicate word detection (3 tests)

**Total: 25 tests**

---

## File Structure

```
student-finance-tracker/
├── index.html
├── about.html
├── records.html
├── add-transaction.html
├── settings.html
├── tests.html
├── seed.json
├── styles/
│   ├── main.css
│   └── components.css
├── scripts/
│   └── validators.js
└── assets/
    └── icons/
```

---

## Data Model

```json
{
  "id": "txn_0001",
  "description": "Lunch at cafeteria",
  "amount": 12.50,
  "category": "Food",
  "date": "2026-02-15",
  "createdAt": "2026-02-15T10:30:00.000Z",
  "updatedAt": "2026-02-15T10:30:00.000Z"
}
```

**Default Categories:** Food, Books, Transport, Entertainment, Fees, Other

---
