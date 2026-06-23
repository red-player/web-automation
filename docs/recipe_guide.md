# QA Test Automation Recipe Guide

Welcome to the **Adaptable Automation Engine**! This guide helps you write declarative workflow recipes in JSON. The engine uses self-healing locator strategies to find elements on the page even if class names, IDs, or structures change.

---

## Editor Autocomplete & Validation

When writing recipes, ensure you include the `$schema` reference at the top of your JSON file. This gives you instant validation, errors, and parameter completion in editors like VS Code:
```json
{
  "$schema": "./recipe_schema.json",
  "name": "my-workflow-name",
  "steps": []
}
```

---

## Step Reference Guide

### 1. Navigation (`goto`)
Navigates the browser to the specified URL.
* **Parameters**:
  - `type`: `"goto"` (Required)
  - `url`: String URL (e.g. `"https://google.com"`) (Required)
  - `timeout`: Number in milliseconds (Optional, defaults to 30000)

---

### 2. Click Element (`click`)
Clicks an interactive element on the page (buttons, links, spans, divs, etc.).
* **Parameters**:
  - `type`: `"click"` (Required)
  - `name`: Logical name or label text (e.g. `"Create"`, `"Confirm"`) (Optional, triggers dynamic search)
  - `selector`: CSS or XPath selector (Optional override)
  - `isXpath`: `true` / `false` (Set to `true` if your selector is XPath/CSS. Defaults to `false` which uses dynamic discovery)

---

### 3. Fill Text Field (`fill`)
Fills a single text input or textarea with a specific value.
* **Parameters**:
  - `type`: `"fill"` (Required)
  - `name`: Field label or control name (e.g. `"username"`, `"Office Phone"`)
  - `selector`: Selector override (Optional)
  - `value`: The text value to input (Supports `{{variable}}` substitution)
  - `isXpath`: `true` / `false`

---

### 4. Fill Complex Form (`fillForm`)
Automates filling out complex form arrays with random mock generation or explicit value overrides.
* **Parameters**:
  - `type`: `"fillForm"` (Required)
  - `fields`: Array of field descriptors:
    - `name`: Field identifier (label text or control name) (Required)
    - `type`: `"input" | "dropdown" | "radio" | "date" | "textarea"` (Required)
    - `value`: Optional hardcoded override value. If omitted, mock values are auto-generated.
    - `selector`: Optional direct selector.
    - `dropdownOptionSelector`: Target selector for PrimeNG/custom dropdown items.
    - `valueType`: `"string" | "number" | "alphanumeric" | "email" | "date"`
    - `required`: Boolean validation constraint.
    - `minLength` / `maxLength` / `exactLength`: Length validation constraints.
    - `inputOptions`: Object controlling mock data modes (e.g. `mode: "PAN"`, `mode: "companyEmail"`, `charSet: ["alpha"]`).

---

### 5. Dropdown Selection (`selectOption`)
Selects an option inside a dropdown.
* **Parameters**:
  - `type`: `"selectOption"` (Required)
  - `name` / `selector`: Target lookup identifiers.
  - `value`: Option value or option label text.

---

### 6. Toggle Checkboxes & Radios (`check` / `uncheck`)
Toggles input selectors.
* **Parameters**:
  - `type`: `"check"` or `"uncheck"` (Required)
  - `name` / `selector`: Target identifiers.

---

### 7. Wait for UI Element (`waitForSelector`)
Pauses execution until the element matches the active state and becomes visible.
* **Parameters**:
  - `type`: `"waitForSelector"` (Required)
  - `name` / `selector`: Target lookup identifiers.
  - `timeout`: Waiting timeout threshold (Optional, defaults to 10000)

---

### 8. Wait for API Network Response (`waitForResponse`)
Pauses execution until the browser receives a matching API network response. Useful to ensure backend operations complete before moving to the next step.
* **Parameters**:
  - `type`: `"waitForResponse"` (Required)
  - `urlContains`: Endpoint substring to wait for (e.g. `"/suppliers"`) (Required)
  - `method`: `"GET" | "POST" | "PUT" | "DELETE"` (Defaults to `"POST"`)
  - `statusCode`: Optional expected status code (e.g. `200`)
  - `timeout`: Wait timeout in milliseconds (Optional, defaults to 15000)

---

### 9. Assert Page Text (`assertText`)
Verifies that the given text exists in the viewport (case-insensitive).
* **Parameters**:
  - `type`: `"assertText"` (Required)
  - `text`: Case-insensitive text query (Required)

---

### 10. Capture Page Screenshot (`screenshot`)
Captures a full-page screen capture. Saved inside the `screenshots/` directory.
* **Parameters**:
  - `type`: `"screenshot"` (Required)
  - `screenshotName`: Filename (Optional, e.g. `"homepage_loaded"`)

---

### 11. Multi-level Menu Navigation (`navigateSidebar`)
Clicks sequential sidebar options to navigate the app's hierarchy.
* **Parameters**:
  - `type`: `"navigateSidebar"` (Required)
  - `levels`: Dictionary of menu labels (e.g. `{ "first": "Raw Materials", "second": "Unloading" }`)

---

## Dynamic Variables (Templating)

You can write dynamic placeholders using `{{variableName}}` in your text and URL properties.
At runtime, variables sent in the API request will automatically replace these placeholders:
```json
{
  "type": "goto",
  "url": "{{loginUrl}}"
}
```
If you pass `variables: { "loginUrl": "https://example.com" }` in the API execution request, the engine resolves it automatically.

---

## Sample Recipe JSON

Here is a full example illustrating dynamic login and assertion:
```json
{
  "$schema": "./recipe_schema.json",
  "name": "portal-login-test",
  "description": "Log into the application and take a verification screenshot.",
  "steps": [
    {
      "type": "goto",
      "url": "https://vividtranstech.in/tancem/#/"
    },
    {
      "type": "fill",
      "name": "username",
      "value": "{{username}}"
    },
    {
      "type": "fill",
      "name": "password",
      "value": "{{password}}"
    },
    {
      "type": "click",
      "name": "Log In"
    },
    {
      "type": "assertText",
      "text": "Dashboard"
    },
    {
      "type": "screenshot",
      "screenshotName": "login_success"
    }
  ]
}
```
