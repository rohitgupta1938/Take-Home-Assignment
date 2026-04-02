# 📝 Take-Home Assignment — The Untested API

## 🚀 Overview

This assignment involved working with an unfamiliar Node.js + Express codebase.
The goal was to understand the existing implementation, identify issues, write tests, and implement a new feature.

I focused on:

* Understanding the flow of the application
* Identifying logical and design issues
* Writing tests to validate behavior
* Fixing bugs and improving consistency
* Implementing a new API feature

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js 18+

### Installation

```bash
cd task-api
npm install
```

### Run the server

```bash
npm start
```

Server runs at:

```
http://localhost:3000
```

---

## 🧪 Running Tests

```bash
npm test
npm run coverage
```

Tests are written using Jest and Supertest.

---

## 📁 Project Structure

```
task-api/
  src/
    app.js                  # Express app setup
    routes/tasks.js         # Route handlers
    services/taskService.js # Business logic + in-memory store
    utils/validators.js     # Input validation
  tests/                    # Test cases
  package.json
  jest.config.js
```

---

# 🐛 Bug Report

## Bug 1: Status mismatch with API specification

* **Location:** `taskService.js`, `validators.js`
* **Issue:** Code used `todo`, `in_progress`, `done`
* **Expected:** `pending`, `in-progress`, `completed`
* **Reason:** Implementation did not follow API contract, causing inconsistencies in validation and responses

---

## Bug 2: Incorrect status filtering logic

* **Location:** `taskService.js`

```js
t.status.includes(status)
```

* **Issue:** Used partial matching instead of exact match
* **Impact:** Incorrect results for filtering

---

## Bug 3: Incorrect pagination logic

* **Location:** `taskService.js`

```js
const offset = page * limit;
```

* **Issue:** Skips first page records
* **Fix:**

```js
const offset = (page - 1) * limit;
```

---

## Bug 4: Incorrect behavior in completeTask

* **Location:** `taskService.js`
* **Issue:**

  * Priority was overwritten unnecessarily
  * Status value did not match API specification
* **Impact:** Data inconsistency

---

## Bug 5: Stats structure mismatch

* **Location:** `taskService.js`
* **Issue:** Used incorrect status keys
* **Impact:** Incorrect stats output

---

# 🔧 Fix Implemented

## Pagination Fix

### Before:

```js
const offset = page * limit;
```

### After:

```js
const offset = (page - 1) * limit;
```

### Reason:

Pagination should start from `(page - 1) * limit` to correctly return the first page.

---

# 🚀 Feature Implementation

## PATCH /tasks/:id/assign

### Description

This endpoint assigns a task to a user.

### Request Body

```json
{
  "userId": "user-1"
}
```

### Behavior

* Validates `userId`
* Adds `assignedTo` field to the task
* Returns updated task

---

## 🧠 Design Decisions

* Used a single `assignedTo` field instead of multiple users for simplicity
* Did not introduce a separate user model (out of scope)
* Validation ensures `userId` is a non-empty string

---

## ⚖️ Tradeoffs

* Multiple assignees are not supported
* No persistent database (in-memory only)
* Simplicity prioritized over scalability

---

# 🧪 Test Coverage

## Covered Areas

* Task creation (valid and invalid cases)
* Fetching tasks (all, filtered, paginated)
* Updating tasks
* Deleting tasks
* Completing tasks
* Assigning tasks

## Edge Cases

* Missing required fields
* Invalid input values
* Invalid task IDs

## Test Approach

* Covered both success and failure scenarios
* Used `_reset()` before each test to ensure isolation

---

# 🤔 Observations

* The main challenge was inconsistency between API specification and implementation
* Identifying logical bugs required careful code reading
* Writing tests helped validate behavior and uncover issues

---

# 👨‍💻 Tech Stack

* Node.js
* Express.js
* Jest
* Supertest

---

# ✅ Conclusion

This assignment helped me improve:

* Debugging and problem-solving skills
* Understanding of backend API design
* Writing effective and meaningful test cases
* Handling edge cases in real-world scenarios

---
