# Documentation

This folder explains the project. The code shows **how** things work. These docs explain **what** the system is, **why** it was built this way, and **how it connects** to other modules.

**Owner:** the Documentation member. **Everyone contributes:** whoever builds something writes a first draft or tells the Documentation member what changed, and the Documentation member cleans it up and keeps it current.

## What's in this folder

| File | Question it answers | Main source of information |
|------|---------------------|----------------------------|
| [architecture.md](architecture.md) | How is our module put together? | Backend + Frontend |
| [data-model.md](data-model.md) | What data do we store, and how is it related? | Backend |
| [integration.md](integration.md) | How does our module work with the other modules? | Backend |
| [design-system.md](design-system.md) | What does our UI look like, and what are the rules? | Frontend |
| [decisions/](decisions/) | Why did we choose X over Y? | Whoever made the decision |
| [../server/openapi.yaml](../server/openapi.yaml) | What endpoints exist? (the API contract) | Backend |

Each file is a template. Fill in the `[bracketed placeholders]`, follow the hidden hint comments (open the file in your editor to see them), then delete the hints.

## When do I need to write documentation?

Use this table. If you did something in the left column, update the doc in the right column **in the same pull request**.

| If you... | Update... |
|-----------|-----------|
| Added, removed, or changed an endpoint (path, fields, status codes) | `server/openapi.yaml`, **before** writing the code |
| Chose a framework, library, database, or approach over other options | A new ADR in `decisions/` |
| Added or changed a piece of data (e.g., a new `dueDate` field on a loan) | `data-model.md` |
| Need data from another module, or another module needs data from you | `integration.md` (and tell that group) |
| Added a new color, font, component, or UI pattern | `design-system.md` |
| Added a new part of the system (new folder, new layer, new external service) | `architecture.md` |
| Changed how to install or run the project, or added an environment variable | Root `README.md` (Getting Started) and the `.env.example` file |
| Finished a feature | Tick it off in the root `README.md` feature list |
| Fixed a small bug, renamed a variable, or changed one button's style | Nothing. The commit message is enough |

### Still not sure? Ask these 3 questions

1. **Would a new teammate have to ask someone to understand this?** If yes, document it.
2. **Will someone later ask "why did you do it this way?"** If yes, write an ADR.
3. **Does it affect another group member or another module?** If yes, document it **and** tell them.

If all three answers are "no", you probably don't need to write docs.

## Rules for good docs

- **Write for a classmate who missed the last three meetings.** Use short sentences and no inside jokes.
- **Docs change with the code.** Outdated docs are worse than no docs. A pull request that changes behavior is not finished until the docs match.
- **Link instead of copying.** Endpoint details live only in `openapi.yaml`. Other docs link to it instead of repeating it.
- **Show, don't just tell.** Use tables, diagrams, examples, and screenshots.
- **No leftover template text.** If a section doesn't apply yet, write "Not applicable yet, planned for finals" instead of leaving the placeholder.

## Diagrams and images

- **Prefer Mermaid diagrams.** They are written as text inside the Markdown file, GitHub shows them as pictures, and they are easy to update. Try them at <https://mermaid.live>. In VS Code, install the "Markdown Preview Mermaid Support" extension to preview them.
- **Screenshots and other images** go in `docs/images/` (create the folder when you need it). Link them like this: `![Login screen](images/login.png)`.

## Checklist before each presentation (Documentation member)

- [ ] Root `README.md` is fully filled in, and Getting Started works on a fresh clone
- [ ] `architecture.md` diagrams match the current system
- [ ] `data-model.md` matches the mock data in `server/src/data/`
- [ ] `integration.md` lists every module we send data to or get data from
- [ ] `design-system.md` matches what the UI actually uses
- [ ] There's an ADR for each major choice (at least: backend framework and frontend framework)
- [ ] No `[placeholders]` or template hints left
- [ ] Instructor's handout completed (submitted separately)