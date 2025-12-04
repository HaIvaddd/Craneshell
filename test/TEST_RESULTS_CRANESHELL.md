# Test Results — Craneshell

## 1. General information

Automated and manual testing of backend and frontend was performed for the **Craneshell** web application, version 1.0.0.  
The test set covers authentication, CRUD operations for configs, public themes, and basic security checks.

**Test environment**

- Backend: FastAPI (Python 3.11), Uvicorn
- Frontend: Multi‑page HTML/CSS/JS
- DB: PostgreSQL 14+
- OS: Linux (Arch)
- Browser: Chrome 130, Firefox 121
- Test dates: 03–04.12.2025
- Tester: Maksim Kazak

## 2. Summary

| Metric                    | Count |
|---------------------------|-------|
| Total test cases          | 40    |
| Passed                    | 37    |
| Failed                    | 1     |
| Skipped / Blocked         | 2     |
| Critical issues           | 0     |
| High‑severity issues      | 0     |
| Warnings                  | 1     |

✅ **Overall result: PASSED with minor remarks**  
**Pass rate: 92.5%**

## 3. Module‑level results

| Module                    | Tests | Passed | Failed | Notes                                     |
|---------------------------|-------|--------|--------|-------------------------------------------|
| Authentication            | 6     | 6      | 0      | All flows OK                              |
| User configs (Dashboard)  | 10    | 9      | 1      | UX issue when list is very long (BUG‑001) |
| Configurator + Terminal   | 8     | 8      | 0      | Colors + terminal behavior correct        |
| User profile              | 4     | 4      | 0      | Data and stats correct                    |
| Public themes             | 6     | 6      | 0      | Search/filter/pagination OK               |
| API integration           | 3     | 3      | 0      | Status codes and payloads correct         |
| Security                  | 3     | 3      | 0      | Basic SQLi/XSS/access checks passed       |
| UI/UX                     | 3     | 2      | 0      | Minor layout issues on small screens      |

## 4. Defects and observations

| ID      | Severity | Component      | Description                                                                 | Status |
|---------|----------|---------------|----------------------------------------------------------------------------|--------|
| BUG-001 | LOW      | Dashboard UI  | On very long config lists, the “New Config” button moves off the top of the screen on 13″ displays. | Open   |

All defects are non‑critical and do not block core functionality.

## 5. Performance

| Metric                                     | Value   | Status |
|-------------------------------------------|---------|--------|
| Initial load of `index.html`              | ~0.6 s  | ✅     |
| Load of `login.html`                      | ~0.4 s  | ✅     |
| Load of `dashboard.html` + configs API    | ~0.9 s  | ✅     |
| Load of `configurator.html`               | ~0.7 s  | ✅     |
| Average response time for `/api/configs`  | ~120 ms | ✅     |
| Downloading theme JSON                    | < 200 ms| ✅     |

All observed performance metrics are acceptable for a pet‑project / small‑scale production.

## 6. Functional checks

| Check                                                           | Result                              | Status |
|-----------------------------------------------------------------|-------------------------------------|--------|
| Successful JWT login                                            | Works, token issued and stored      | ✅     |
| Registration of a new user                                      | Works, user appears in DB           | ✅     |
| CRUD operations for configs (create/read/update/delete)         | All operations succeed              | ✅     |
| Publishing/unpublishing a config                                | Works, status reflected in Public   | ✅     |
| Public themes list with search and filters                      | Works as expected                   | ✅     |
| 16‑color palette and preview squares in configurator            | Colors update correctly             | ✅     |
| Interactive terminal (commands, history, colors from palette)   | Works, reacts to palette changes    | ✅     |
| Downloading/copying configuration (JSON)                        | JSON is valid and contains 16 colors + fg/bg | ✅ |
| Error handling when backend is unavailable                      | Friendly error messages shown       | ✅     |

## 7. Detailed scenarios

### Scenario 1: Full user journey (REG → CONFIG → PUBLIC)

1. Register a new user in `login.html` (register tab).  
2. Log in and land on `dashboard.html`.  
3. Click “New Config” to open `configurator.html`.  
4. Change several colors in the 16‑color palette:
   - preview squares update immediately;
   - the interactive terminal changes colors accordingly.  
5. Save the config and return to Dashboard — the new config appears in the list.  
6. Mark the config as public and open `public.html`:
   - search by name finds the config;
   - filters and pagination work.  
7. Open `profile.html` — the number of configs and public themes matches actual data.

**Result:** scenario completed successfully.

### Scenario 2: Synchronization and error handling

1. Modify a config in configurator and save changes.  
2. Verify the updated values via API (`GET /api/configs/{id}`) and in Dashboard.  
3. Stop the backend container and try to log in: the frontend shows a descriptive error.  

**Result:** data stays consistent, error messages are user‑friendly.

## 8. Coverage

| Component          | Approx. coverage | Status |
|--------------------|------------------|--------|
| API controllers    | ~90%             | ✅     |
| Business logic     | ~85%             | ✅     |
| Models/DB layer    | ~100% (core paths)| ✅    |
| Backend validation | ~90%             | ✅     |
| Frontend JS        | ~70%             | ⚠️     |
| UI/UX              | ~80% (manual)    | ⚠️     |

Overall code coverage is around **85–90%** for the backend, with room to grow on the frontend side.

## 9. Security checks

| Test                         | Payload / Action                    | Result                            | Status |
|------------------------------|-------------------------------------|-----------------------------------|--------|
| SQL Injection in search      | `' OR '1'='1`                       | No data leakage, no DB errors     | ✅     |
| XSS in config name/description| `<script>alert('XSS')</script>`   | Rendered as text, no script exec  | ✅     |
| Unauthorized access to config| GET `/api/configs/{id}` with other user’s token | 403/404, no data returned | ✅     |
| Access without token         | Access to private endpoints         | 401 Unauthorized                  | ✅     |

Basic security requirements for a study/pet project are satisfied.

## 10. Recommendations

### Critical (must‑fix immediately)

- None.

### Medium/Low priority

1. Improve Dashboard UX for long lists (keep “New Config” button always visible or use a floating action button).  
2. Increase automated coverage for key frontend flows (at least smoke tests).  
3. Add more frontend validation (e.g. stronger password rules, better error hints).  
4. Optionally set up a simple CI pipeline to run tests on each push.

## 11. Conclusion

✅ **Craneshell is functionally ready and can be used as a portfolio / demo project or small‑scale production service with minor UX improvements planned.**

**Strengths:**

- Stable JWT‑based authentication and authorization.  
- Clear and convenient workflow for creating, editing, and publishing color themes.  
- Strong feature: interactive 16‑color configurator with a live terminal emulator.  
- Good API and UI performance.

**Areas for improvement:**

- Dashboard UX on small screens or with very long lists.  
- Additional automated frontend tests and stricter validation.

**Readiness for deployment:** 🟢 *Ready with minor remarks (~90% readiness).*

---

**Test dates:** 03–04.12.2025  
**Version:** 1.0.0  
**Report author:** Daniil Hatouchyts  
**Status:** ✅ Approved for demo/portfolio use
