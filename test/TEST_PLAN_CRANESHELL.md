# Test Plan — Craneshell

## 1. General information

This document defines the testing strategy, environment, and goals for the **Craneshell** web application — a service for creating and managing terminal color themes based on **FastAPI (Python)**, **PostgreSQL**, and a **multi‑page HTML/CSS/JavaScript frontend**.

The goal of testing is to verify all backend API endpoints, color configuration logic, integration between frontend and backend, authentication and authorization, and the correct behavior of the interactive 16‑color configurator and terminal preview.

## 2. Testing objectives

1. Verify the functional correctness of all FastAPI controllers (`/api/auth/*`, `/api/configs/*`, `/api/public/*`, `/api/health`).
2. Validate CRUD logic for user color configurations (create, read, update, delete, publish).
3. Ensure correct implementation of JWT authentication and authorization for user‑scoped data.
4. Check data display and synchronization between frontend pages and backend APIs.
5. Assess basic security of the system (SQL injection, XSS, unauthorized access to other users’ configs).
6. Verify error handling and input validation on both backend and frontend.
7. Validate the correctness of the interactive terminal emulator and 16‑color palette behavior.

## 3. Scope of testing

### In scope

- Unit and integration tests for all key FastAPI API endpoints.
- JWT authentication and authorization (user‑scoped access to configs).
- CRUD operations for configurations.
- Data validation on backend and frontend.
- Security checks (SQL injection, XSS, unauthorized access).
- Data display in the multi‑page frontend:
  - `login.html` — login/registration flows.
  - `dashboard.html` — list of user configs.
  - `configurator.html` — 16‑color palette + interactive terminal.
  - `profile.html` — user stats.
  - `public.html` — public themes.
- Correct work with PostgreSQL (data integrity, isolation).

### Out of scope

- Load testing with a large number of concurrent users.
- Full cross‑browser testing (focus on Chrome/Firefox).
- Native mobile applications (web only).

## 4. Test strategy

Testing will be performed using **automated backend tests with pytest** and **manual functional testing** for the frontend.

### Frameworks and tools

| Type               | Tool            | Description                                 |
|--------------------|-----------------|---------------------------------------------|
| Backend test runner| pytest          | Automated tests for FastAPI                 |
| HTTP client        | httpx/TestClient| API and integration tests                   |
| Mocking            | unittest.mock   | Mocking DB/JWT where needed                 |
| API testing        | curl / HTTPie   | Manual API checks                           |
| Frontend testing   | Browser + DevTools | Verification of JavaScript logic         |
| VCS / CI           | Git + GitHub    | Version control, optional CI                |
| Coverage           | coverage.py     | Code coverage reporting (planned)           |

## 5. Test environment

| Component | Technology / Version                |
|----------|-------------------------------------|
| OS       | Linux (Arch/Ubuntu) / Windows 10   |
| Backend  | FastAPI, Python 3.11+, Uvicorn     |
| Frontend | HTML5, CSS3, Vanilla JavaScript    |
| DB       | PostgreSQL 14+                      |
| API      | REST API with JWT                  |
| Backend port | 8000                           |
| Frontend port | 8080                          |
| Browser  | Chrome 120+, Firefox 121+          |

## 6. Test types and coverage

| Type                          | Purpose                                        | Number of tests |
|-------------------------------|-----------------------------------------------|-----------------|
| Unit tests                    | Isolated business logic (services/helpers)    | 8               |
| API integration tests         | HTTP routes and business logic                | 20              |
| Authentication/authorization tests | Login, token validation, access control | 6               |
| Security tests                | SQL injection, XSS, unauthorized access       | 3               |
| Frontend functional tests     | Manual UI/UX testing                          | 5               |
| Performance checks (light)    | Response times for main endpoints             | 2–3             |

**Total planned test cases:** around 45.

## 7. Risks and mitigation

| Risk                                    | Probability | Impact  | Mitigation                          |
|----------------------------------------|------------|---------|-------------------------------------|
| DB not initialized / migrations missing| High       | High    | Run migrations and seed scripts     |
| API unavailable                        | Medium     | High    | Ensure backend is running on :8000  |
| CORS or auth misconfiguration          | Medium     | High    | Verify CORS/JWT settings in `.env`  |
| JWT token expiration                   | Low        | Medium  | Add token refresh/renewal in tests  |
| Browser cache issues                   | Low        | Low     | Clear cache before frontend tests   |
| Test DB contamination                  | Low        | Medium  | Use separate test DB/schema         |

Overall risk level: **Low–Medium**.

## 8. Entry and exit criteria

### Entry criteria

- FastAPI application starts without errors.
- PostgreSQL test database is migrated and seeded with test data.
- All dependencies are installed (`requirements.txt`).
- Frontend and backend are running and accessible from the browser.

### Exit criteria

- All critical bugs are fixed.
- ≥ 85% of test cases passed successfully.
- All CRITICAL and HIGH priority tests passed.
- Documentation and test results are updated.

## 9. Reporting and deliverables

| Document              | Description                     | Status   |
|-----------------------|---------------------------------|----------|
| TEST_PLAN_CRANESHELL.md   | This test plan                | ✅ Created |
| TEST_RESULTS_CRANESHELL.md| Manual/automated test results| ✅ Created |
| TEST_SUMMARY.md       | Final summary and conclusions   | ⏳ Planned |

## 10. Test data

### Test users

| # | Email                   | Password | Notes          |
|---|-------------------------|----------|----------------|
| 1 | test1@craneshell.dev    | Test123! | Basic user     |
| 2 | test2@craneshell.dev    | Test123! | Basic user     |
| 3 | demo@craneshell.dev     | Demo123! | Demo account   |

### Sample configurations

- `Tokyo Night` — dark, high‑contrast palette.
- `Solarized Light` — light, soft palette.
- `Mono Green` — all greenish colors to test terminal.
- `High Contrast` — extreme contrast to check readability.

### Example test scenarios (IDs)

1. ✅ Successful login (T001)  
2. ✅ Login with invalid password (T002)  
3. ✅ Registration of a new user (T003)  
4. ✅ Creating a new config from configurator (T010)  
5. ✅ Editing existing config and saving changes (T011)  
6. ✅ Publishing config and verifying it on public page (T020)  
7. ✅ Downloading config as JSON (T021)  
8. ✅ Unauthorized access to another user’s config (SEC001)  
9. ❌ Attempted XSS in config name (SEC002) — should be escaped  

## 11. Testing schedule

| Phase                       | Date        | Responsible      | Status      |
|----------------------------|------------|------------------|------------|
| Test planning              | 03.12.2025 | QA (self)        | ✅ Done     |
| Environment setup          | 03.12.2025 | Dev/DevOps       | ✅ Done     |
| Backend functional testing | 03–04.12.2025 | QA             | ✅ Done     |
| Frontend functional testing| 04.12.2025 | QA               | ✅ Done     |
| Security testing           | 04.12.2025 | QA               | ✅ Done     |
| Regression testing         | 05.12.2025 | QA               | ⏳ Planned  |
| Final test report          | 05.12.2025 | QA               | ⏳ Planned  |

## 12. Success metrics

| Metric                    | Target value | Goal |
|---------------------------|--------------|------|
| Passed test cases         | ≥ 85%        | ✅   |
| Critical bugs             | = 0          | ✅   |
| High‑priority tests       | ≥ 90% passed | ✅   |
| Average API response time | < 500 ms     | ✅   |
| API coverage              | ≥ 90%        | ✅   |

---

**Creation date:** 03.12.2025  
**Version:** 1.0  
**Author:** Kazak Maksim
**Status:** ✅ Approved
