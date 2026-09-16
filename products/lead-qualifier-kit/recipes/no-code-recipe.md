# No-code recipe — score leads as they arrive (no Python)

Goal: every new lead that hits your form/CRM gets scored automatically, and hot leads
get flagged to your team.

This recipe uses Zapier (the same shape works in Make or n8n).

## What you'll build

**Trigger** (new lead) → **Claude scores it** → **Write score back + alert on hot leads**

## Steps

1. **Trigger — New lead.** Pick your source: "New Form Submission" (Typeform, Webflow,
   Tally...), "New Row" (Google Sheets), or "New Lead" (HubSpot, Pipedrive, Zoho...).

2. **Action — Anthropic (Claude) "Send Message".** Zapier has a built-in Anthropic
   integration; connect it with your API key from https://console.anthropic.com.
   - Model: `claude-opus-5` (or `claude-haiku-4-5` for volume)
   - System prompt: paste the contents of `prompts/system-prompt.md`, then a `---` line,
     then the contents of your edited `prompts/scoring-rubric.md`.
   - User message:

     ```
     Qualify this lead and answer ONLY with JSON:
     {"score": <0-100>, "tier": "hot|warm|cold", "reasons": ["..."],
      "disqualifiers": ["..."], "next_step": "..."}

     Lead:
     name: {{name}}
     email: {{email}}
     company: {{company}}
     title: {{title}}
     source: {{source}}
     message: {{message}}
     ```

     (Map the `{{...}}` fields from your trigger step.)

3. **Action — Formatter → Utilities → "Convert text to line-item/JSON"** (or a one-line
   Code step: `return JSON.parse(inputData.text);`) to split the JSON into fields.

4. **Action — write back.** Update the CRM record / sheet row with `score`, `tier`,
   `next_step`.

5. **Action — alert on hot.** Add a Filter step (`tier` exactly matches `hot`), then a
   Slack/email action: "🔥 Hot lead: {{name}} ({{company}}) — {{next_step}}".

## Notes

- Costs: one Zapier task + roughly a cent or two of Claude API per lead.
- The Python CLI in this kit remains the best tool for *backfilling* an existing list;
  use this recipe for the ongoing trickle.
- Keep your rubric in one place. When you edit `prompts/scoring-rubric.md`, re-paste it
  into the Zap's system prompt so both paths score identically.
