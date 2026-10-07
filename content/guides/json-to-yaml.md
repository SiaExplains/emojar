---
slug: convert-json-to-yaml-for-kubernetes-and-ci-configs
tool: json-to-yaml
title: Converting JSON to YAML for Kubernetes and CI Configs
description: 'Turn JSON into clean YAML for manifests and pipelines, and avoid the type traps (yes, no, dates) that make the same file parse differently in different tools.'
tags: [YAML, JSON, Kubernetes, DevOps]
---

To convert JSON to YAML, parse the JSON and write each object as indented `key: value` lines and each array as `- item` lines. Strings only get quotes when they'd otherwise be read as a different type. Every JSON document has an exact YAML equivalent, so the conversion never loses data. What you do need to check is how the _receiving_ tool reads a few unquoted values, because not every YAML parser follows the same version of the spec.

## Why convert JSON to YAML at all?

You often get JSON from a source that speaks only JSON: `kubectl get -o json`, a cloud console export, an API, or a teammate's script. The file you need to commit is often YAML: a Kubernetes manifest, a Helm values file, a GitHub Actions workflow, a Docker Compose file or an OpenAPI spec. YAML is easier to read and review, and it allows comments. Converting by hand is slow and it's easy to get the indentation wrong.

## A worked example: a Deployment manifest

Say you have this JSON (shortened):

```json
{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": { "name": "web", "labels": { "app": "web" } },
  "spec": {
    "replicas": 2,
    "template": {
      "spec": {
        "containers": [
          {
            "name": "web",
            "image": "nginx:1.27",
            "ports": [{ "containerPort": 80 }],
            "env": [
              { "name": "FEATURE_X", "value": "true" },
              { "name": "TIMEOUT", "value": "30" },
              { "name": "REGION", "value": "no" }
            ]
          }
        ]
      }
    }
  }
}
```

Paste it into the [JSON to YAML converter](/online-tool/developer-tools/json-to-yaml) and the **YAML output** appears as you type:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  labels:
    app: web
spec:
  replicas: 2
  template:
    spec:
      containers:
        - name: web
          image: nginx:1.27
          ports:
            - containerPort: 80
          env:
            - name: FEATURE_X
              value: 'true'
            - name: TIMEOUT
              value: '30'
            - name: REGION
              value: no
```

A few things to notice:

- `replicas: 2` stays a number, because it was a number in the JSON.
- `"true"` and `"30"` keep their quotes. Without them, a YAML parser would read a boolean and an integer, and Kubernetes rejects non-string env values.
- `REGION: no` is **not** quoted, and that's the line to worry about.

## Why can `no` be a problem?

The converter uses the `yaml` library, which follows YAML 1.2. In YAML 1.2, only `true` and `false` are booleans, so `no`, `yes`, `on` and `off` are plain strings and need no quotes. Many tools still parse YAML with 1.1 rules, though, and under 1.1 those words are booleans. PyYAML does this, and so do Go programs built on older YAML libraries, which includes parts of the Kubernetes ecosystem. Under 1.1 rules, `value: no` becomes `false`, and you get an error like "cannot unmarshal bool into string", or worse, a silently wrong config.

The same applies to dates: a string like `"2026-10-07"` comes out as `date: 2026-10-07`, which some 1.1 parsers turn into a date object.

**Fix:** after converting, scan for unquoted values that look like `yes`, `no`, `on`, `off`, `y`, `n` or a date, and add quotes by hand when the target tool might use 1.1 rules. It's a 10-second check that prevents a confusing deploy failure.

## How are other special strings handled?

The converter adds quotes whenever a plain string would be ambiguous in YAML 1.2:

| JSON value               | YAML output            | Why                               |
| ------------------------ | ---------------------- | --------------------------------- |
| `"30"`                   | `"30"`                 | Otherwise read as a number        |
| `"true"`                 | `"true"`               | Otherwise read as a boolean       |
| `"0755"`                 | `"0755"`               | Looks numeric                     |
| `"~"`                    | `"~"`                  | `~` means null in YAML            |
| `"a: b"`                 | `"a: b"`               | Colon-space would start a mapping |
| `"#x"`                   | `"#x"`                 | `#` would start a comment         |
| `""`                     | `""`                   | Empty string, not null            |
| `"echo one\necho two\n"` | block scalar with `\|` | Multi-line text stays readable    |

Empty arrays and objects come out as `[]` and `{}`, and `null` stays `null`.

## Step by step

1. Paste or type your JSON into **JSON input**. **Load sample** shows a small example.
2. Read the YAML as it updates. If the JSON is invalid, you get the parse error with its line and column instead of YAML output.
3. Check for unquoted `yes`, `no`, `on`, `off` and date-like values if the target parser might use YAML 1.1.
4. Copy the result, or download it as a `.yaml` file.

The output uses 2-space indentation, and list items are indented under their parent key, a style that both Kubernetes and GitHub Actions accept. Conversion happens in your browser, so it's safe to paste manifests that contain internal image names or config values.

## What the converter does not do

- **Add comments.** JSON has none to carry over. Add explanatory comments after converting. That's one of the main reasons to use YAML in the first place.
- **Create anchors or aliases.** Repeated blocks are written out in full. If you want `&anchor`/`*alias` reuse, refactor the YAML by hand.
- **Know your schema.** It can't tell that a field _should_ be a string. It only writes the types your JSON already has.

Going the other way, for example to check that a hand-edited file still parses to what you expect, use [YAML to JSON](/online-tool/developer-tools/yaml-to-json). It's also a good round-trip test after making edits.

## FAQ

### Is YAML really a superset of JSON?

Since YAML 1.2, almost entirely: any valid JSON document is also valid YAML. You could commit the JSON as-is to a `.yaml` file and most tools would accept it. Converting just makes it easier to read and lets you add comments.

### Will key order be preserved?

Yes. Keys appear in the same order as in the JSON input, so diffs against the original stay readable.

### Can I convert several JSON documents into a multi-document YAML file?

Not in one pass. Convert each document separately and join them with a `---` line, which is how Kubernetes expects several resources in one file.

Convert your next manifest with the [JSON to YAML converter](/online-tool/developer-tools/json-to-yaml).
