# Gmail recipe — auto-label incoming mail (optional)

Goal: new Gmail messages get a `Triage/act-now`, `Triage/respond-today`,
`Triage/delegate`, `Triage/fyi`, or `Triage/archive` label automatically.

Do this only after you've run the file-based CLI for a few days and trust the
categories. Two paths:

## Path A — Zapier (no code)

1. **Trigger**: Gmail → "New Email" (connect your account; label filter `INBOX`).
2. **Action**: Anthropic (Claude) → "Send Message".
   - Model: `claude-haiku-4-5` (volume-friendly) or `claude-opus-5`.
   - System prompt: paste `prompts/system-prompt.md`, a `---` line, then your edited
     `prompts/your-context.md`.
   - User message:

     ```
     Triage this email and answer ONLY with JSON:
     {"category": "act_now|respond_today|delegate|fyi|archive",
      "priority": <1-5>, "summary": "...", "needs_reply": true|false,
      "suggested_reply": "..."}

     From: {{From}}
     Subject: {{Subject}}

     {{Body Plain}}
     ```

3. **Action**: Code step to `JSON.parse` the response text.
4. **Action**: Gmail → "Add Label to Email", mapping category → the matching
   `Triage/...` label (create the five labels in Gmail first).
5. Optional: Filter (`category` = `act_now`) → Slack DM/SMS yourself.

Cost: one Zapier task + a fraction of a cent (Haiku) per email.

## Path B — Google Apps Script (free, runs inside your account)

For the technically comfortable: a time-driven Apps Script that reads unprocessed
threads, calls the Anthropic API with `UrlFetchApp`, and applies labels. Sketch:

```javascript
const SYSTEM = `...paste system-prompt.md + your-context.md...`;

function triageNew() {
  const threads = GmailApp.search('in:inbox -label:Triage/done', 0, 20);
  for (const thread of threads) {
    const msg = thread.getMessages().pop();
    const result = callClaude(SYSTEM, msg.getFrom(), msg.getSubject(), msg.getPlainBody());
    thread.addLabel(getOrCreateLabel('Triage/' + result.category.replace('_', '-')));
    thread.addLabel(getOrCreateLabel('Triage/done'));
  }
}
```

Store your API key with `PropertiesService.getScriptProperties()`, never in the code.
`callClaude` is a `UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', ...)` call
with headers `x-api-key` and `anthropic-version: 2023-06-01`; ask any AI assistant to
expand this sketch, or use Path A if that sentence wasn't fun.

## A note on safety

Both paths only *label*. Deliberately: don't let any automation archive or reply on its
own until you've watched it be right for weeks. Drafting and deciding stay with you.
