# stuFi - Student Finance Tracker

A responsive web application for tracking student budgets and transactions, built with vanilla HTML, CSS, and JavaScript.

**Live website**: [GitHub Pages URL](https://imenarh.github.io/stufi/index.html)

**Video Demo**: [Video Demo](https://youtu.be/3B0QUwxS82A)

---

## Overview

**stuFi** helps students track their spending with a clean, accessible interface. Features include transaction management, spending caps, regex-powered search, and data import/export.

**Currency**: RWF (Rwandan Franc) is the base currency.

---

## Setup Guide

```bash
git clone https://github.com/imenarh/stufi
cd stufi
```

Open `index.html` in your browser.

> To load sample data: navigate to Settings → Import JSON → select `seed.json`

---

## Features

- Add, edit, and delete transactions
- Dashboard with spending stats and 7-day trend chart
- Spending cap with progress indicator and ARIA alerts
- Regex-powered search with match highlighting
- Sort by date, description, or amount
- Customizable categories (persisted in localStorage)
- Currency conversion rates (USD, EUR)
- Auto-save to localStorage
- JSON/CSV export with validation
- JSON import with validation
- Fully keyboard-navigable with focus trap in modals
- Responsive design (mobile, tablet, desktop)
- ARIA live regions for screen readers

---

## Regex Catalog

### Validation Patterns

| Field | Pattern | Valid | Invalid |
|-------|---------|-------|---------|
| Description | `/^\S(?:.*\S)?$/` | `"Lunch at cafe"` | `" leading"`, `"trailing "` |
| Amount | `/^(0|[1-9]\d*)(\.\d{1,2})?$/` | `"3500"`, `"0"`, `"12500.50"` | `"-5"`, `"12.500"` |
| Date | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` | `"2026-02-15"` | `"2026-13-01"` |
| Category | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | `"Food"`, `"Fast Food"` | `"Food123"` |

### Advanced Regex (Back-reference)

| Pattern | Purpose | Example |
|---------|---------|---------|
| `/\b(\w+)\s+\1\b/i` | Detect duplicate consecutive words | `"the the"` → match, `"the cat"` → no match |

### User Search Patterns

| Pattern | Purpose |
|---------|---------|
| `/coffee|tea/i` | Find beverage transactions |
| `/\.\d{2}$/` | Find amounts with cents |
| `/^\d{5,}/` | Find amounts ≥ 10,000 |

---

## Keyboard Map

| Key | Action |
|-----|--------|
| `Tab` | Move focus forward |
| `Shift + Tab` | Move focus backward |
| `Enter` / `Space` | Activate focused element |
| `Escape` | Close modal |

---

## Accessibility

### Semantic Structure
- HTML5 landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Proper heading hierarchy (one `<h1>` per page)
- Skip-to-content link
- Labels bound to all form inputs

### Keyboard Support
- All interactive elements focusable via `Tab`
- Visible focus indicators using `:focus-visible` (3px solid outline)
- Focus trap in modals (Tab cycles within modal)
- Focus returns to trigger element when modal closes

### ARIA
- Live regions for dynamic updates (`aria-live="polite"` and `aria-live="assertive"`)
- Progress bar with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Form errors linked via `aria-describedby`
- Modal with `role="alertdialog"`, `aria-modal="true"`

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
├── index.html              # Dashboard
├── about.html              # About page
├── records.html            # Transaction list with search/sort
├── add-transaction.html    # Add/Edit transaction form
├── settings.html           # Settings (cap, categories, import/export)
├── tests.html              # Validation test suite
├── seed.json               # Sample data for import
├── README.md
├── styles/
│   ├── main.css            # Base styles, layout, components
│   └── components.css      # Page-specific styles
├── scripts/
│   ├── storage.js          # localStorage operations
│   ├── settings.js         # Settings load/save
│   ├── validators.js       # Regex validators + test runner
│   ├── state.js            # App state management
│   ├── search.js           # Regex search and highlight
│   ├── ui.js               # UI rendering
│   ├── records.js          # Records page logic
│   ├── dashboard.js        # Dashboard stats and chart
│   ├── settings-page.js    # Settings page logic
│   └── add-transaction.js  # Add/Edit transaction logic
└── assets/
    └── icons/              # SVG icons
```

---

## Data Model

```json
{
  "id": "txn_abc12345",
  "description": "Lunch at cafeteria",
  "amount": 3500.00,
  "category": "Food",
  "date": "2026-02-15",
  "createdAt": "2026-02-15T10:30:00.000Z",
  "updatedAt": "2026-02-15T10:30:00.000Z"
}
```

    "categories": Food, Books, Transport, Entertainment, Fees, Other

**Settings:**
```json
{
  "spendingCap": 500000,
  "categories": ["Food", "Books", "Transport", "Entertainment", "Fees", "Other"],
  "rates": { "USD": 0.00078, "EUR": 0.00072 }
}
```

---

## Milestones

| Milestone | Weight | Description |
|-----------|--------|-------------|
| M1 | 10% | Spec & Wireframes |
| M2 | 10% | Semantic HTML & Base CSS |
| M3 | 15% | Forms & Regex Validation |
| M4 | 20% | Render + Sort + Regex Search |
| M5 | 15% | Stats + Cap/Targets |
| M6 | 15% | Persistence + Import/Export |
| M7 | 15% | Polish & A11y Audit |

---
