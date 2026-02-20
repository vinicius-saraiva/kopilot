# WhatsApp / Telegram Bot

**Feature:** Messaging bot for reminders and quick logging
**Status:** Planned — not yet specified
**Target version:** TBD

---

## Summary

A WhatsApp and/or Telegram bot that allows users to interact with Kopilot directly from their messaging app — receive reminders, log fuel, mark maintenance as done, and ask the AI mechanic questions without opening the app.

---

## Key Capabilities (high-level)

- Receive reminders via chat message instead of (or in addition to) push notifications
- Quick actions: "Mark oil change as done", "Log fuel: 40L, R$280"
- Check status: "What's due this month?"
- AI Mechanic interaction via chat
- Lower friction than opening the app for simple updates

---

## Status

This feature needs full planning and specification. A dedicated PRD will be created when prioritized.

---

## Open Questions

- WhatsApp Business API vs. Telegram Bot API (or both?)
- Cost model (WhatsApp Business API has per-message costs)
- Natural language processing for message parsing
- Authentication and account linking
- Which features to expose via bot vs. app-only
