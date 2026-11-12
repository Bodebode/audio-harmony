# Android release preparation
- [x] Hide native digital checkout and upgrade entry points; preserve browser payments (unit tests and simulated native browser checks).
- [x] Add authenticated account deletion and public deletion page; run handler tests and verify live unauthorized rejection.
- [x] Set com.alkeplay.app, version 1.0.0, target API 36, and complete Android scaffolding.
- [x] Repair privacy page and prepare truthful Google Play Data Safety/submission instructions.
- [x] Verify preview build and native policy behavior; document release blockers.
- [ ] Verify account deletion end-to-end using a disposable signed-in account — external Supabase has no available browser test session.
- [ ] Build and sign Android AAB and complete Play Console setup — needs local JDK/Android SDK, user's upload keystore and Play Console account.
- [ ] Publish and verify live privacy/deletion URLs — user must publish the updated website.