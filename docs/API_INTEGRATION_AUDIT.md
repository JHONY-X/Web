# API Integration Audit

## Application architecture

- Next.js 16.4.6 App Router with TypeScript and React 19.3.0.
- npm is the package manager; Tailwind CSS 4 is used for styling.
- Routes and interactive screens are under `src/app`; shared UI is under `src/components`.
- No state-management or form-management package is installed.
- The User API is called server-side through an allowlisted BFF in `src/app/api/auth/user/[...operation]/route.ts`; backend-issued tokens are held in HttpOnly cookies.
- `src/lib/api/client.ts` provides the server-side API client. `ROHOBOT_API_BASE_URL` can override the default API base without exposing credentials to the browser.
- Most non-User domain services under `src/lib/api/services` still return in-memory or hard-coded sample data.
- The project has no configured unit, integration, or end-to-end test runner.
- `.env.example` documents the configurable API base URL.

## Relevant existing UI and service files

| Feature | Existing UI | Current backend connection | Audit notes |
|---|---|---|---|
| Sign-in | `src/app/login/page.tsx` | User API BFF | Backend login is wired; token response schema still needs backend clarification. Role selection is a UI routing hint, not backend authorization. |
| Candidate invitation registration | `src/app/invite/[token]/page.tsx` | `POST /user/register/` through the BFF | Uses the real User API; account role and invitation semantics still need confirmation. |
| Candidate/trainer registration | `src/app/candidate/register/page.tsx`, `src/app/trainer/scan/` | Disabled | Local demo registration has been removed. Trainer-specific live endpoints are outside this User package. |
| Employer registration | `src/app/employer/register/page.tsx` | Disabled | The User schema does not document employer role or organization fields. |
| Email verification | `src/app/verify-email/` | User API BFF | Verification and resend calls are wired; resend request and OTP relationship need backend confirmation. |
| Password reset | `src/app/forgot-password/`, `src/app/reset-password/` | User API BFF | Request, token confirmation, and reset are wired. |
| Authentication routes | `src/app/api/auth/user/` | User API BFF | Routes are allowlisted; backend-issued access/refresh tokens are stored in HttpOnly cookies. |
| Candidate profiles | `src/app/candidate/`, `src/lib/api/services/candidate.ts` | No | The service returns a sample profile and simulated results. |
| Employer/recruitment | `src/app/employer/`, `src/lib/api/services/employer.ts`, `interview.ts`, `placement.ts` | No | Services use in-memory sample records. |
| Administration | `src/app/admin/`, `src/lib/api/services/admin.ts`, `analytics.ts` | No | Dashboards and review workflows are sample or in-memory data. |
| Training/events | `src/app/admin/training/`, `src/app/trainer/` | No | Local demo registration has been removed; no matching real events/trainer API contract was established in this audit. |
| Subscriptions/payments | `src/app/employer/subscription/`, `payment.ts`, `organization.ts` | No | Payment service simulates checkout and payment status. |
| Invitations | `src/app/admin/invitations/` | `POST /invite/create/` through a server-side bridge | Admin/staff submit a candidate name and email; the backend sends an invitation email. The request requires an authenticated access token. Response format and delivery remain unverified; the current login UI does not establish an admin role session. |

## User API contract check

Swagger at `https://heran.pythonanywhere.com/api/docs/` is reachable and its OpenAPI schema is available at `/api/schema/`. The documented API base is `https://heran.pythonanywhere.com/api/v1`. A request to the documented plans endpoint returned HTTP 401 without credentials, confirming that the API requires authentication for that operation; no authenticated user workflow was exercised.

The OpenAPI document describes JWT bearer authentication. It provides exact request fields for login, registration, logout, token refresh, profile update, password reset, and email verification. It does **not** fully define several contracts:

- The login response schema in Swagger conflicts with its description. The backend owner has now confirmed the successful response contains `access` and `refresh`; the BFF validates that pair before creating a session.
- `PATCH /user/change-password/` has no request-body schema.
- `POST /user/resend-otp/` has no request-body schema.
- The registration schema has no role field; `invitation_link` is optional and its account-type semantics are unspecified.
- The employer registration UI includes organization fields, which are not part of `/user/register/`.

No undocumented payload fields, roles, claims, or tokens should be assumed.

## User-package endpoint inventory

All paths below are under `/api/v1`. Endpoint status refers to frontend integration, not the backend's checklist.

| Method and path | Frontend status | Contract note |
|---|---|---|
| `POST /user/login/` | IMPLEMENTED | Backend confirmed `access` and `refresh`; BFF and sign-in UI are wired. The selected role is only a UI routing hint. |
| `POST /user/register/` | BLOCKED | BFF and candidate invitation UI are wired; role and invitation semantics need clarification. |
| `POST /user/logout/` | IMPLEMENTED | BFF sends the documented refresh-token body and clears cookies. |
| `POST /user/refresh/` | IMPLEMENTED | BFF requires a backend-returned access/refresh pair before updating cookies. |
| `PUT /user/change-profile/` | BLOCKED | BFF and service are wired; schema marks email read-only but required; no profile UI is connected. |
| `PATCH /user/change-password/` | BLOCKED | BFF and service are wired, but there is no request schema. |
| `POST /user/forget-password/` | IMPLEMENTED | Forgot-password page is connected through the BFF. |
| `PUT /user/reset-password/` | IMPLEMENTED | Reset form is connected through the BFF. |
| `GET /user/reset-password-confirm/{uidb64}/{token}/` | IMPLEMENTED | Reset-link check is connected through the BFF. |
| `POST /user/verify-email/` | BLOCKED | BFF and UI are wired; confirm the OTP is sent/verified against the same phone number. |
| `POST /user/resend-otp/` | BLOCKED | BFF and service are wired as bodyless; no request schema is documented. |

IMPLEMENTED means integration code exists, not that the live backend call has been verified. No endpoint is VERIFIED: authenticated workflows have not been tested with a backend-issued account. See `API_INTEGRATION_PROGRESS.md` and `API_INTEGRATION_ISSUES.md` for current status and required backend clarifications.

## Validation results

- `npm run build` passed on Next.js 16.4.6.
- Focused ESLint passed for the changed API, authentication, and registration files.
- Production-server smoke test confirmed that an invalid local login request is rejected with HTTP 400 before reaching the upstream API.
- No authenticated live backend workflow has been verified; no authorized test account was available.
- The project has no configured unit, integration, or end-to-end test runner.
