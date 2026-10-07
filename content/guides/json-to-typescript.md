---
slug: type-an-api-response-in-typescript-from-a-json-sample
tool: json-to-typescript
title: Type an API Response in TypeScript From a JSON Sample
description: A walkthrough of turning a real JSON response into TypeScript interfaces, then fixing the spots a generator can't know about, such as nulls, enums and dates.
tags: [TypeScript, JSON, Developer, How-to]
---

The quickest way to type an API response in TypeScript is to paste a real JSON sample into a generator, copy the interfaces it produces, and then spend two minutes refining the parts a single sample can't reveal: fields that are sometimes null, string fields that only take a few values, and dates. Generation gets you about 90% of the way; the last 10% is your knowledge of the API.

Let's do it with a realistic example.

## Step 1: Get a representative sample

Say your app calls `GET /api/users/42` and receives:

```json
{
  "id": 42,
  "name": "Ada",
  "email": null,
  "roles": ["admin", "editor"],
  "address": { "city": "Berlin", "zip": "10115" },
  "orders": [
    { "id": 1, "total": 19.9, "paid": true },
    { "id": 2, "total": 5, "coupon": "WELCOME" }
  ]
}
```

Copy it from your browser's network tab or an API client. The sample's quality decides the types' quality, so pick a response where as many fields as possible are filled in.

## Step 2: Generate the interfaces

Paste it into [JSON to TypeScript](/online-tool/developer-tools/json-to-typescript). Output appears as you type, with no button to press. With **Root type name** set to `User`:

```ts
export interface User {
  id: number;
  name: string;
  email: null;
  roles: string[];
  address: Address;
  orders: Order[];
}

export interface Order {
  id: number;
  total: number;
  paid?: boolean;
  coupon?: string;
}

export interface Address {
  city: string;
  zip: string;
}
```

Notice what the generator inferred:

- **Nested objects become their own interfaces**, named after their key: `address` → `Address`.
- **Array items are singularized**: `orders` → `Order`.
- **Items in an array are merged.** The first order had `paid` but no `coupon`, the second the opposite, so both became optional (`?`).
- **Zip codes stay strings** because they were quoted in the JSON, which is correct, since "01067" would lose its leading zero as a number.

## Step 3: Fix what one sample can't tell you

### Nulls

`email: null` is the giveaway. In this sample the user had no email, but the field is surely a string when present. Change it to:

```ts
email: string | null;
```

**Tip:** you can let the generator do this. Paste an array of two or more records where the field is null in one and filled in another. For example, a cart whose items have `"note": null` and `"note": "gift"` produces `note: null | string;` automatically.

### Fixed sets of values

`roles: string[]` is accurate but loose. If the API only ever returns certain roles, tighten it:

```ts
roles: ("admin" | "editor" | "viewer")[];
```

Now a typo like `"admn"` becomes a compile error instead of a production bug.

### Dates

JSON has no date type, so `"2026-10-07T09:00:00Z"` is typed as `string`. That's correct for the raw response. Convert to `Date` in your own code if you need to, and keep the response type honest.

### Empty arrays

An empty array in the sample becomes `unknown[]`, since there's nothing to infer from. Replace it with the real item type, or paste a sample where the array has content.

## Step 4: Choose interface or type alias

The **Declare as** option switches between `interface` and `type alias`. For object shapes they behave almost identically:

- **Interfaces** can be extended with `extends` and merged by redeclaring them, which is handy for public library types.
- **Type aliases** can also express unions and mapped types.

Pick one per codebase and stick with it. Tick **readonly properties** to mark every field `readonly`, which is a good fit for response data you never mutate.

## Watch out for these naming quirks

The generator names types mechanically, so review the names before committing:

- **Simple singularization.** It turns "ies" into "y", drops "es" after s, x, ch and sh, and otherwise strips a trailing "s", so `categories` → `Category` and `addresses` → `Address` work, but irregular plurals like `people` or `children` keep their plural name and need a manual rename.
- **Duplicate names get numbered.** Two different nested objects both called `meta` produce `Meta` and `Meta2`. Rename them to something meaningful.
- **Unusual keys are quoted.** A key like `x-trace` becomes `"x-trace": number;`, which is valid TypeScript.
- **Arrays at the root.** If the response is an array, you get an item interface plus an alias. With root name `events`: `export type Events = EventsItem[];`.

## Step 5: Paste into your project

Every declaration is exported, so drop the output into something like `types/api.ts` and import from there. If your API has an OpenAPI or GraphQL schema, generating types from the schema is more reliable long-term. Generating from a sample is ideal for third-party APIs without one, quick prototypes and one-off scripts.

The conversion runs in your browser, so a sample containing real customer records doesn't leave your machine. It's still good practice to anonymize samples before sharing them anywhere else.

## FAQ

### Why does it say my JSON is invalid?

The input must be strict JSON: double quotes around keys and strings, no trailing commas, no comments. Run it through the [JSON Validator](/online-tool/developer-tools/json-validator) to find the exact line and column.

### Does it distinguish integers from decimals?

No. TypeScript has a single `number` type, so `3` and `19.9` both become `number`.

### Can I generate types from several responses at once?

Wrap them in a JSON array. Items are merged into one interface, with fields missing from some items marked optional.

Generate your first interfaces with [JSON to TypeScript](/online-tool/developer-tools/json-to-typescript).
