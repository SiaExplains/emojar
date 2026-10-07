---
slug: json-to-xml-conversion-problems-and-fixes
tool: json-to-xml
title: "JSON to XML Output Looks Wrong? 7 Common Problems, Fixed"
description: Missing root element, arrays without a wrapper, renamed keys, values that change type on the way back. Why JSON-to-XML conversion surprises people, with fixes.
tags: [JSON, XML, Developer Tools, Troubleshooting]
---

Most "wrong" JSON-to-XML output is the converter following a convention you did not expect, not a bug. JSON has objects, arrays and typed values; XML has elements, attributes and text, so every converter has to make choices: what becomes the root, how arrays are written, which keys become attributes. Know the rules and you can shape your JSON to get the XML you want.

## 1. Why is there no `<root>` element, or an unexpected one?

The converter needs exactly one root element, because XML documents can only have one.

- If your JSON object has **a single top-level key**, that key becomes the root. `{"library": {...}}` produces `<library>...</library>`.
- If it has **several top-level keys**, everything is wrapped in `<root>`. `{"a": 1, "b": 2}` produces `<root><a>1</a><b>2</b></root>`.
- If the JSON is **an array**, items are wrapped in `<root>` too.

**Fix:** type a name into **Root element (JSON → XML)** to force your own root in any of these cases. Note that once you fill it in, a single top-level key is no longer promoted; it becomes a child of your root.

## 2. Why don't my arrays have a wrapper element?

This is the most common surprise. An array becomes the same element repeated, with no parent around the group. Take this order:

```json
{"order":{"@id":"A-1001","customer":"Ada","items":[{"sku":"PEN-01","qty":2},{"sku":"NB-07","qty":1}]}}
```

The `items` array turns into two sibling `<items>` elements:

```xml
<order id="A-1001">
  <customer>Ada</customer>
  <items>
    <sku>PEN-01</sku>
    <qty>2</qty>
  </items>
  <items>
    <sku>NB-07</sku>
    <qty>1</qty>
  </items>
</order>
```

**Fix:** if the target format expects `<items><item>...</item><item>...</item></items>`, describe that nesting in the JSON: `"items": {"item": [ ... ]}`. The **Array item name** option (default `item`) only names elements for an array at the very top of the JSON, such as `[{"a":1},{"a":2}]`, which becomes `<root><row>...</row><row>...</row></root>` if you set the item name to `row`.

## 3. Why did my nested arrays collapse?

Arrays inside arrays have no natural XML equivalent, so they are flattened. `{"a": [[1, 2], [3]]}` becomes three `<a>` elements with the values 1, 2 and 3, and the grouping is lost.

**Fix:** wrap inner arrays in an object, for example `{"a": [{"v": [1, 2]}, {"v": [3]}]}`, so each group gets its own element.

## 4. How do I make attributes instead of child elements?

Prefix the key with `@`. In the sample on the tool page, `"@name": "City Library"` produces `<library name="City Library">`. Two rules apply:

- The value must be a string, number, boolean or null. An object or array under an `@` key cannot be an attribute, so it is written as a child element instead, with the `@` turned into an underscore (`_meta`).
- To put text and attributes on the same element, use the special key `#text`: `{"p": {"@lang": "en", "#text": "Hello"}}` gives `<p lang="en">Hello</p>`.

## 5. Why were some of my keys renamed?

XML element names are stricter than JSON keys. They cannot start with a digit, cannot contain spaces, and names beginning with "xml" are reserved. The converter adjusts them instead of producing invalid XML:

| JSON key | XML element |
| --- | --- |
| `2nd address` | `_2nd_address` |
| `unit price ($)` | `unit_price____` |
| `xmlData` | `_xmlData` |

**Fix:** rename keys in the JSON first if the receiving system expects particular names. Values containing `&` or `<` are escaped automatically.

## 6. Why does the JSON look different after converting back?

Converting JSON to XML and then using **Convert: XML → JSON** is not a perfect round trip, because XML carries less type information:

| Original JSON | After JSON → XML → JSON |
| --- | --- |
| `"tags": []` | `"tags": null` |
| `"tags": ["a"]` | `"tags": "a"` (no longer an array) |
| `"@id": "1"` | `"@id": 1` (now a number) |
| `"zip": "02134"` | `"zip": "02134"` (kept, because of the leading zero) |
| `"paid": true` | `"paid": true` |

On the way back, attributes get an `@` prefix, repeated elements become arrays, and text that looks like a number, `true`, `false` or `null` is converted to that JSON type. Elements with the same name are grouped into one array, so `<a>1</a><b>x</b><a>2</a>` becomes `"a": [1, 2], "b": "x"` and the original interleaving is gone.

**Fix:** if your code expects an array, normalize it after parsing (treat a single object as a one-item list).

## 7. Why is my XML rejected?

Two causes cover nearly every error:

- **The XML is not well-formed:** a missing closing tag, an unescaped `&`, or two root elements. The [XML formatter](/online-tool/developer-tools/xml-formatter) often makes the broken spot obvious.
- **It contains an inline DTD** (`<!DOCTYPE ... [ ... ]>`). These are refused on purpose to avoid entity-expansion attacks. Remove the DTD block and convert again.

On the JSON side, the message starts with "Invalid JSON". Trailing commas and single quotes are usual suspects; the [JSON validator](/online-tool/developer-tools/json-validator) points to the exact position.

## How do you run a conversion?

1. Open the [JSON to XML converter](/online-tool/developer-tools/json-to-xml), or go straight to the [XML to JSON version](/online-tool/developer-tools/json-to-xml/xml-to-json).
2. Choose the direction in **Convert**.
3. Paste your input. The output updates as you type.
4. Optionally set **Root element (JSON → XML)** and **Array item name**, and untick **XML declaration** if you do not want the `<?xml version="1.0" encoding="UTF-8"?>` line on top.
5. Copy the output or download it as a `.xml` or `.json` file.

The conversion runs entirely in your browser.

## FAQ

### Does the converter preserve key order?

For JSON to XML, yes: elements appear in the same order as the keys. For XML to JSON, same-named elements are grouped, so order across different names can change.

### Do numbers stay numbers in the XML?

XML has no number type, so `1965` becomes the text `<year>1965</year>`. Types come from a schema on the receiving side.

Have a payload to convert? Paste it into the [JSON to XML converter](/online-tool/developer-tools/json-to-xml) and adjust the root and item names until the output matches your target.
