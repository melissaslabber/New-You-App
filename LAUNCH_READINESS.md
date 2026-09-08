# New You launch readiness

## Security and operations

- Set a unique `SESSION_SECRET` of at least 32 random characters in Vercel Production.
- Set a strong, unique `STAFF_PIN`. Change it immediately if it has ever been shared outside authorised staff.
- Keep the Upstash Redis integration connected to the Production environment.
- Download the coach JSON backup at least weekly and store it in an encrypted, access-controlled location.
- Test account pause, login rate limits, logout, data export and permanent deletion before accepting paying members.
- Give each staff member only the access they need. Never share member photos or health records without permission.

## Real-device release test

Run these checks on at least one current and one older Android phone, plus one current and one older iPhone:

1. Install to the home screen and reopen the app.
2. Log in, close the browser completely, reopen and confirm the session safely resumes.
3. Log food by search, typed barcode, live camera and uploaded barcode photo.
4. Test camera denied, camera allowed, poor light, rotated photo, gallery upload and a large phone photo.
5. Upload and remove a progress photo and an InBody JPG.
6. Save food, steps, exercise, weight and measurements. Reopen and confirm all values remain.
7. Run a full workout with sound on, screen locked/unlocked and an incoming call interruption.
8. Export progress, request membership cancellation and permanently delete a disposable test account.
9. Check small-screen text, keyboard overlap, scrolling, landscape mode and slow mobile data.

Record phone model, operating-system version, browser, result and screenshot for every failure. Camera support must not be called complete until this matrix passes on physical devices.

## Food accuracy rules

- Database values are estimates until checked against the exact product label.
- Log edible portion only and prefer grams or millilitres measured with a scale or labelled container.
- Teaspoon and tablespoon conversions use ingredient-specific gram weights where available. They are still estimates because density and spoon filling vary.
- A serving uses the directory's stated serving size. Members should adjust it to the amount actually eaten.
- Barcode products must be reviewed before saving because external databases can be incomplete or incorrect.

## Before payments are automated

Do not promise automatic access cancellation until the payment provider sends verified webhooks and the app has idempotent activation, failed-payment, retry, cancellation and refund handling. Test the entire flow in the provider's sandbox first.
