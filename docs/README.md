# Documentation — Inventory Management System

This folder explains the **Inventory Management System**. The code shows **how** things work, while these docs explain **what** the system is, **why** it was built this way, and **how it connects** to other modules.

**Owner:** Documentation Member  
**Everyone contributes:** Anyone who builds or updates a feature writes a draft or informs the Documentation member, who cleans it up and keeps it current.

---

## What's in this folder

| File | Question it answers | Main source of information |
|------|---------------------|----------------------------|
| [architecture.md](architecture.md) | How is our module put together? | Backend + Frontend |
| [data-model.md](data-model.md) | What data do we store, and how is it related? | Backend |
| [integration.md](integration.md) | How does our module work with the other modules? | Backend |
| [design-system.md](design-system.md) | What does our UI look like, and what are the rules? | Frontend |
| [decisions/](decisions/) | Why did we choose X over Y? | Whoever made the decision |
| [../server/openapi.yaml](../server/openapi.yaml) | What endpoints exist? (the API contract) | Backend |

---

## When do I need to write documentation?

Update documentation **in the same pull request** as your code changes:

| If you... | Update... |
|-----------|-----------|
| Added, removed, or changed an inventory endpoint | `server/openapi.yaml` (before writing code) |
| Chose a framework, library, database, or approach | A new ADR in `decisions/` |
| Added or changed data fields (e.g., `sku`, `quantity`, `reorderLevel`) | `data-model.md` |
| Integrated data with another module | `integration.md` (and notify that group) |
| Added UI elements (e.g., badges, buttons, inventory tables) | `design-system.md` |
| Added new structure (new folder, service, or layer) | `architecture.md` |
| Changed setup steps or environment variables | Root `README.md` & `.env.example` |
| Finished a feature | Root `README.md` feature checklist |
| Fixed a small bug or tweaked minor styling | Nothing. The commit message is enough |


---


## Presentation Checklist (Documentation Lead)

- [ ] Root `README.md` is filled out and setup works on a fresh clone.
- [ ] `architecture.md` reflects current system setup.
- [ ] `data-model.md` matches the database schema.
- [ ] `integration.md` covers connected modules.
- [ ] `design-system.md` matches the live UI.
- [ ] ADRs recorded for major technical decisions.
- [ ] All `[placeholders]` removed.