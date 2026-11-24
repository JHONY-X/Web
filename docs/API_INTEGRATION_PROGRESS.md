# API Integration Progress

Status definitions: NOT STARTED = no frontend integration; IN PROGRESS = being implemented; IMPLEMENTED = integration code exists; VERIFIED = tested successfully against the live backend; BLOCKED = required backend contract is missing or ambiguous.

## Current scope: User module (11 endpoints)

| Method and endpoint | Status | Notes |
|---|---|---|
| `POST /user/login/` | IMPLEMENTED | Backend confirmed the successful response contains `access` and `refresh`; BFF requires both before creating a session. |
| `POST /user/register/` | IMPLEMENTED | Candidate invitation flow submits the documented registration fields, including the invitation token as `invitation_link`. Backend invitation email/link behavior has not been live-tested. |
| `POST /user/logout/` | IMPLEMENTED | BFF sends the backend refresh token and clears auth cookies on success. |
| `POST /user/refresh/` | IMPLEMENTED | BFF validates and stores only the backend-returned token pair. |
| `PUT /user/change-profile/` | BLOCKED | Service and BFF are wired; email is marked read-only but required, and no profile screen uses it yet. |
| `PATCH /user/change-password/` | BLOCKED | Service and BFF are wired, but the request-body schema is missing. |
| `POST /user/forget-password/` | IMPLEMENTED | Forgot-password page is connected through the BFF. |
| `PUT /user/reset-password/` | IMPLEMENTED | Reset form is connected through the BFF. |
| `GET /user/reset-password-confirm/{uidb64}/{token}/` | IMPLEMENTED | Reset-link check is connected through the BFF. |
| `POST /user/verify-email/` | BLOCKED | Verification UI and BFF are wired; backend must confirm that OTPs match the registration/resend flow. |
| `POST /user/resend-otp/` | BLOCKED | Service and BFF are wired as a bodyless request; the documented request schema is missing. |

IMPLEMENTED means integration code exists; it does not mean the backend call was verified. No endpoint is VERIFIED: authenticated workflows have not been tested with a backend-issued account. The BFF is in `src/app/api/auth/user/[...operation]/route.ts`; browser-facing methods are in `src/lib/api/services/user.ts`.

## Related invitation endpoint

| Method and endpoint | Status | Notes |
|---|---|---|
| `POST /invite/create/` | IMPLEMENTED | Admin/staff invitation form sends `full_name` and `email_address`; the server forwards the authenticated access token, and the backend sends an invitation email. Any successful upstream 2xx is treated as accepted because the response shape was not provided. Delivery has not been verified. The current login UI does not establish an admin role session. |

## Remaining modules

Subscriptions (17), Professionals (28), Organizations (13), Recruitment (10), Invitations (8), Feedback (4), and Events (10) remain outside this implementation step. Their frontend integration status is NOT STARTED.
