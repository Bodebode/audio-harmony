# Architecture rules
- Centralize native payment visibility in src/lib/platform.ts and block payment routes before mounting them, so native releases never initialize website checkout.
- Delete accounts through an authenticated Edge Function using the validated caller ID only; remove owned storage and associated application data before deleting the Auth user.
- Keep Android release signing credentials outside the repository and sign through Android Studio or local environment variables.
- Bind support submission inserts to the authenticated caller, allowing null user IDs only for unauthenticated guests, so supporters cannot attribute submissions to other accounts.