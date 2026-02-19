# stuFi App 

## Overview

**stuFi** (Student Finance) is a responsive web application for tracking student budgets and transactions, built with vanilla HTML, CSS, and JavaScript (no frameworks).

**Live Demo**: GitHub Pages URL (add after deployment)

**Video Demo**: Video demo URL (after recording)

## Spec & Wireframes

### Wireframes

Wireframe sketches for each section of the app. Layout adapts across three breakpoints: 360 px (mobile), 768 px (tablet), 1024 px (desktop). 


**About**
![About page wireframe (mobile and Web)](/assets/images/about.png)

**Dashboard**
```
┌────────┬────────┬────────┬────────┐
│ Total  │Records │Top Cat │ 7-day  │
│Spent   │ Count  │        │ Trend  │
├────────┴────────┴────────┤        │
│  Cap Progress Bar        │ Chart  │
│  [====-------] £45/£100  │        │
└──────────────────────────┴────────┘
```

**Records (Desktop)**
```
┌─────────────────────────────────────────────────┐
│ [Search regex input]          [Case sensitive ☐]│
│ Sort by: [Date ▾] [Amount ▾] [Description ▾]    │
├────────┬────────┬──────────┬──────────┬─────────┤
│  Date  │  Desc  │ Category │  Amount  │ Actions │
├────────┼────────┼──────────┼──────────┼─────────┤
│ ...    │ ...    │ ...      │ ...      │ ✏️ 🗑️  │
└────────┴────────┴──────────┴──────────┴─────────┘
```

**Records (Mobile ~360px)**
```
┌──────────────────────┐
│ [Search input      ] │
│ ┌──────────────────┐ │
│ │ Lunch at cafe    │ │
│ │ Food · 2025-09-29│ │
│ │ £12.50    ✏️ 🗑️ │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ Bus pass         │ │
│ │ Transport · ...  │ │
│ │ £45.00    ✏️ 🗑️ │ │
│ └──────────────────┘ │
└──────────────────────┘
```

**Add / Edit Form**
```
┌─────────────────────────────┐
│ Add New Transaction         │
│                             │
│ Description *               │
│ [________________________]  │
│ ⚠ No leading/trailing spaces│
│                             │
│ Amount (£) *    Date *      │
│ [________]      [________]  │
│                             │
│ Category *                  │
│ [Food         ▾]            │
│                             │
│ [Cancel]         [Save]     │
└─────────────────────────────┘
```

**Settings**
```
┌──────────────────────────────┐
│ Spending Cap                 │
│ [100.00] £                   │
│                              │
│ Currency Rates               │
│ Base: GBP  USD: [1.27]       │
│             EUR: [1.17]      │
│                              │
│ Categories                   │
│ Food | Books | Transport ... │
│ [+ Add category]             │
│                              │
│ [Export JSON] [Export CSV]   │
│ [Import JSON]                │
└──────────────────────────────┘
```



### Data Model

Each transaction record follows this structure:

```json
{
  "id": "txn_0001",
  "description": "Lunch at cafeteria",
  "amount": 12.50,
  "category": "Food",
  "date": "2025-09-29",
  "createdAt": "2025-09-29T10:00:00.000Z",
  "updatedAt": "2025-09-29T10:00:00.000Z"
}
```

| Field | Type | Constraints |
|---|---|---|
| `id` | string | Unique, format `txn_XXXX`, auto-generated |
| `description` | string | No leading/trailing spaces, no double spaces |
| `amount` | number | Positive, max 2 decimal places |
| `category` | string | Must match a category from the active list |
| `date` | string | ISO format `YYYY-MM-DD` |
| `createdAt` | string | ISO 8601 timestamp, set on creation |
| `updatedAt` | string | ISO 8601 timestamp, updated on every edit |

**Default Categories:** Food, Books, Transport, Entertainment, Fees, Others _(editable in Settings)_

**localStorage keys:**
- `sft:records` — array of all transaction records
- `sft:settings` — spending cap, currency rates, custom categories

---


## Setup Guide

To use the app, you need to first clone the repository:

```bash
   git clone https://github.com/imenarh/student-finance-tracker
   cd student-finance-tracker
```

Open `index.html` in your browser — no build step or server required.
To load sample data, go to `Settings` → Import JSON and select `seed.json`.

## Featuers List

- Add, edit, and delete spending transactions
- Live regex-powered search with match highlighting
- Sort records by date, description, or amount
- Dashboard with total spend, record count, top category, and 7-day trend chart
- Spending cap with ARIA live overage alerts
- Currency conversion (GBP base + USD, EUR) with manual rates
- Auto-save to `localStorage`
- JSON import/export with structure validation
- CSV export (stretch goal)
- Fully keyboard-navigable

## Regex Catalog

### Validation Patterns

| Pattern | Purpose | Example Match | Example Fail |
|---------|---------|---------------|--------------|
| `/^\S(?:.*\S)?$/` | Description: no leading/trailing spaces, no double spaces | `"Lunch at cafeteria"` | `" Lunch "` |
| `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Amount: positive number, max 2 decimals | `"12.50"`, `"0"`, `"100"` | `"-5"`, `"12.500"` |
| `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | Date: YYYY-MM-DD format | `"2025-09-29"` | `"2025-13-01"` |
| `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Category: letters, spaces, hyphens only | `"Food"`, `"Fast Food"` | `"Food123"` |

### Advanced Regex (Back-reference)

| Pattern | Purpose | Example Match | Example Fail |
|---------|---------|---------------|--------------|
| `/\b(\w+)\s+\1\b/gi` | Detect duplicate consecutive words | `"the the"`, `"is is"` | `"the cat"` |

### Search Patterns (Examples for Users)

| Pattern | Purpose | Example Use |
|---------|---------|-------------|
| `/\.\d{2}\b/` | Find amounts with cents | Matches `"12.50"` but not `"12"` |
| `/(coffee\|tea\|latte)/i` | Find beverage-related transactions | Case-insensitive beverage search |
| `/^\d{3,}/` | Find amounts ≥ 100 | Large transactions |
| `/\b(\w+)\s+\1\b/gi` | Find duplicate words in descriptions | Data quality check |

### Safe Regex Compiler

All user-provided patterns are compiled with try/catch to prevent crashes from invalid regex syntax:

```javascript
function safeRegexCompile(pattern, flags = 'i') {
  try {
    return new RegExp(pattern, flags);
  } catch (e) {
    return null; // Invalid pattern, gracefully handled
  }
}
```

---

## Keyboard Map

| Key / Combo | Action |
|---|---|
| `Tab` | Move focus forward through interactive elements |
| `Shift + Tab` | Move focus backward |
| `Enter` / `Space` | Activate button or link in focus |
| `Escape` | Cancel edit mode / close modal |
| `Alt + 1` | Jump to Dashboard section |
| `Alt + 2` | Jump to Records section |
| `Alt + 3` | Jump to Add Transaction form |
| `Alt + 4` | Jump to Settings section |

## Accessibility Plan (M1)

### Semantic Structure
- Use HTML5 landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Proper heading hierarchy: one `<h1>` per page, `<h2>` for sections, `<h3>` for subsections
- Skip-to-content link at the top of the page
- All forms have associated `<label>` elements

### Keyboard Navigation
- All interactive elements focusable via Tab/Shift+Tab
- Visible focus indicators (3px outline, high contrast)
- No keyboard traps
- Alt+number shortcuts for section navigation

### ARIA Implementation
| Component | ARIA Attribute | Purpose |
|-----------|---------------|---------|
| Cap status | `aria-live="polite"` | Announce when under cap |
| Cap exceeded | `aria-live="assertive"` | Alert when over cap |
| Search results | `aria-live="polite"` | Announce result count |
| Sort buttons | `aria-sort` | Indicate sort direction |
| Form errors | `aria-describedby` | Link to error messages |
| Modal/edit mode | `aria-modal`, `role="dialog"` | Screen reader context |

### Color & Contrast
- Text contrast ratio ≥ 4.5:1 (WCAG AA)
- Large text contrast ≥ 3:1
- Focus indicators contrast ≥ 3:1
- No information conveyed by color alone

---

## Accessibility Notes (Implementation)

- App passes WCAG 2.1 AA contrast requirements for all text elements
- All interactive elements reachable and operable via keyboard alone
- Screen reader tested with VoiceOver (macOS) and NVDA (Windows)
- ARIA live regions announce cap status and search result changes without page reload
- Focus is programmatically managed when switching sections (moved to section `<h2>`)

## Testing instructions 


1. Open `tests.html` in your browser (no server needed)
2. The page auto-runs all assertions and displays a pass/fail table
3. Green rows = pass, Red rows = fail
4. All tests should pass on a clean clone

Tests cover: all regex validators (valid and invalid inputs), edge cases (empty strings, boundary dates, duplicate words), and the safe regex compiler (malformed patterns return `null` without throwing).


## Disclosure

There is contribution from LLMs with for the documentation and understanding of the project, documentations contribution and review, and the review of my code.

- [Link](https://claude.ai/chat/c6772ef0-244d-4ea0-9ce4-75bce27dac2f)

<!-- Well-formatted README with overview, setup guide, features list, regex catalog, keyboard map, accessibility notes, and testing instructions. -->