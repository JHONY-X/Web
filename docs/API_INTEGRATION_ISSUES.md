# API Integration Issues

## Confirmed contract

1. **Login request:** The request shape contains `email_address` and `password`. The login form sends these fields through the User API service.
2. **Login response:** The backend owner confirmed that a successful `POST /user/login/` response contains `access` and `refresh`. The frontend validates both values and stores only backend-returned tokens.
3. **Registration request:** The provided request shape contains `first_name`, `middle_name`, `last_name`, `email_address`, `phone_number`, `password`, `password2`, and `invitation_link`. The candidate invitation form already submits these fields through the User API service.
4. **Candidate invitation creation:** `POST /invite/create/` requires a bearer access token, accepts `full_name` and `email_address`, and sends the invitation by email. Admin/staff initiate it from the invitations page. The response JSON was not provided; the frontend treats any successful 2xx as accepted and does not depend on a response body.

## Backend contract clarifications required

1. **Registration role/invitation semantics:** The invitation flow is for candidates, and `/user/register/` receives the provided `invitation_link` field. Confirm whether this endpoint is exclusively for candidate accounts and whether the emailed link opens the frontend's `/invite/{token}` route.
2. **Admin authentication:** The invitation endpoint requires a bearer token, but the current login UI only establishes candidate/employer role hints. Confirm how admin/staff log in and how their role is identified; backend authorization remains authoritative.
3. **Change password:** Publish the request-body fields for `PATCH /user/change-password/`.
4. **Resend OTP:** Publish the request parameters/body and expected response for `POST /user/resend-otp/`.
5. **Profile update:** The `PUT /user/change-profile/` schema marks `email_address` read-only but also required. Confirm whether clients should send it.
6. **Email verification:** The documented body uses `code` and `phone`; confirm that the OTP sent by the registration/resend flow is verified against the same phone number.

Until confirmed, the frontend must not invent role claims, token values, or undocumented request fields. Only tokens returned by the backend may be retained.

## Verification limitation

The public API was reachable, but authenticated workflows could not be exercised without an authorized test account. Any frontend integration remains unverified until requests are tested against backend-issued credentials.
