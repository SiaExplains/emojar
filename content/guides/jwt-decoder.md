---
slug: debug-401-errors-by-decoding-the-jwt
tool: jwt-decoder
title: 'Debugging 401s With a JWT Decoder: A Claim-by-Claim Checklist'
description: 'When an API rejects your token, decode it and check exp, nbf, aud, iss, alg and the rest in order. A practical checklist for JWT authentication bugs.'
tags: [JWT, Authentication, Debugging, Checklist]
---

When an API answers `401 Unauthorized` and you're sending a JWT, decode the token first. Most of the time the cause is visible in the payload: it has expired, it isn't valid yet, it was issued for a different audience or issuer, or it lacks the scope the endpoint needs. Decoding doesn't verify the token, but it tells you what the token _claims_, and that's usually enough to find the bug in a couple of minutes.

## What's inside a JWT?

A JWT is three Base64URL strings joined by dots: `header.payload.signature`. Decoding the first two gives JSON:

```js
// header
{ "alg": "HS256", "typ": "JWT" }

// payload
{
  "sub": "1234567890",
  "name": "Ada Lovelace",
  "role": "admin",
  "iat": 1759800000,
  "exp": 2000000000
}
```

The signature is a MAC or digital signature over the first two parts. Checking it requires the secret or public key, which is the server's job. The registered claim names (`iss`, `sub`, `aud`, `exp`, `nbf`, `iat`, `jti`) are defined in [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519). Everything else, like `role` above, is application-specific.

## How to decode the token

1. Copy the token from your request. Copying the whole `Authorization` header value is fine: the [JWT Decoder](/online-tool/developer-tools/jwt-decoder) strips a leading `Bearer ` automatically.
2. Paste it into **JSON Web Token**. The **Header** and **Payload** appear as formatted JSON, each with its own copy button.
3. Read the status banner (_This token has expired_ or _This token has not expired yet_, with the exact `exp` time), then the **Registered claims** table, where `exp`, `nbf` and `iat` are shown as local dates with relative times like "in 7 years".

The token is decoded in your browser and never sent anywhere. Production tokens are live credentials, so you shouldn't paste them into tools that upload them.

## The checklist

Work through these in order. The first ones cover the most common failures.

### 1. Is it actually a JWT?

If you see _Invalid JWT: a token has three parts separated by dots_, you have something else: an opaque access token, a session ID, or a truncated copy. Opaque tokens can't be decoded at all. Only the server that issued them can look them up. If you see _the header is not Base64URL-encoded JSON_, the token was probably cut short or has extra characters (quotes, a trailing comma) attached.

### 2. Has it expired? (`exp`)

This is the most common cause by far. Access tokens often live 5–60 minutes. Check the banner. If the token _just_ expired, your client's refresh logic is the real bug.

### 3. Is it valid yet? (`nbf`, `iat`)

If `nbf` (not before) is in the future, the server rejects the token. If `iat` is in the future, some servers reject it too. Both usually point to **clock skew**: the issuing server's clock is ahead of the API server's. A minute or two of difference is enough when servers allow no leeway. Compare the decoded times against the current time, or check them with the [Unix Timestamp Converter](/online-tool/date-time-tools/unix-timestamp-converter).

### 4. Is it for this API? (`aud`)

`aud` can be a string or an array. If the API expects `https://api.example.com` and the token says `https://api.example.com/` (trailing slash) or a different client ID, it gets rejected. This often happens after switching environments, when the token is from staging and the API is production.

### 5. Is it from the expected issuer? (`iss`)

Same idea for the issuer: tenant IDs, region-specific identity endpoints, and `http` vs `https` all count. Compare the value character by character with the issuer configured on the API.

### 6. Does it have the right permissions?

A `401` sometimes really means "authenticated but not allowed", which should be a `403`. Look at custom claims like `scope`, `scp`, `roles` or `permissions`. A token issued without the right scope looks perfectly valid in every other way.

### 7. Is the algorithm what the server expects? (`alg`, `kid`)

If the header says `HS256` but the API expects `RS256`, or the `kid` (key ID) refers to a key the API hasn't loaded, signature verification fails even though every claim looks fine. A key rotation that hasn't reached every service yet often shows up exactly like this.

## What decoding does not prove

The decoder prints the signature and states plainly that it's **not verified**. Anyone can create a token with any payload, and decoding shows the claims no matter who wrote them. So:

- Never make authorization decisions based on a decoded but unverified payload, whether in a browser, a gateway or a script.
- If a decoded token looks right but the API still rejects it, the signature, key or algorithm is the likely problem (item 7).
- `alg: "none"` in a header is a red flag. Servers must refuse unsigned tokens.

## Privacy note on payloads

Standard signed JWTs are readable by anyone who holds them. Check the payload for things that shouldn't be there: email addresses, internal IDs or personal data that would be exposed if the token leaked into logs or browser storage. If you need confidential claims, use encrypted tokens (JWE) or keep the data on the server.

## FAQ

### Why does the expiry time look off by hours?

JWT times are Unix seconds in UTC. The decoder shows them in your local time zone. If your server logs show UTC, the two differ by your UTC offset, but the instant is the same.

### Can I edit the payload and reuse the token?

You can edit the JSON, but the signature will no longer match, and any correctly configured server will reject the token. That's the point of the signature.

### Do refresh tokens decode the same way?

Only if they're JWTs. Many providers issue opaque refresh tokens, which can't be decoded and will fail the three-part check.

Paste the next failing token into the [JWT Decoder](/online-tool/developer-tools/jwt-decoder) and go through the checklist.
