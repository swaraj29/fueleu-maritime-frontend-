# Reflection — AI Agent Usage in FuelEU Maritime Frontend

## What I Learned

Going into this project, I'd never built a frontend with hexagonal architecture. I'd seen the pattern in backend Java projects but applying it to React felt weird at first. I used ChatGPT to understand how ports and adapters translate to a frontend context — the key insight was that React components are inbound adapters and API clients are outbound adapters. Once that clicked, the structure made sense.

I also learned that mixing AI tools works better than relying on just one. ChatGPT is great for explaining concepts but bad at writing actual project code (it doesn't know your file structure). GitHub Copilot is the opposite — great at writing code when you give it context, but it just autocompletes without understanding the bigger picture. Using both together filled in each other's gaps.

## Efficiency Gains vs Manual Coding

Honest estimate of time saved:

| Task | Without AI | With AI | Saved |
|------|-----------|---------|-------|
| Researching hexagonal architecture for React | 3 hours | 45 min | ~2 hours |
| Setting up hexagonal folder structure | 2.5 hours | 40 min | ~2 hours |
| Writing TypeScript interfaces from API docs | 1.5 hours | 30 min | ~1 hour |
| Creating Axios adapters (3 files) | 2 hours | 45 min | ~1.5 hours |
| Building 4 tab components + Dashboard | 4 hours | 1.5 hours | ~2.5 hours |
| Writing 44 unit tests | 3 hours | 1 hour | ~2 hours |
| React hook boilerplate + state management | 2 hours | 45 min | ~1 hour |
| **Total** | **~18 hours** | **~6 hours** | **~12 hours** |

But this doesn't count the time I spent debugging AI mistakes — probably an hour or so fixing import paths, CSS issues, and reviewing generated code line by line. So net savings were around 10-11 hours.

The AI was most helpful for repetitive, pattern-based work. It was least helpful for anything requiring awareness of the full project structure (which is why import paths kept breaking).

## Things I Would Do Differently

1. **Set up path aliases from the start.** If I had configured `@core/`, `@adapters/`, `@shared/` aliases in tsconfig, the import path issues wouldn't have happened at all. The AI wouldn't have needed to count `../` levels.

2. **Start with tests.** I wrote tests at the end, but a TDD approach would have caught issues earlier — especially in the banking and pooling logic where the math needs to be exact.

3. **Use AI for planning more, coding less.** The most valuable AI interaction was when I asked ChatGPT to explain hexagonal architecture for frontend. That 10-minute conversation saved me from making wrong structural decisions. The actual code generation was nice but less impactful.

4. **Better git discipline.** I should have committed more frequently with smaller, focused commits instead of batching features together.

## Final Thought

AI agents are productivity multipliers, not replacements. They handle the boring parts (boilerplate, repetitive patterns, test scaffolding) so I can focus on the interesting parts (architecture decisions, UX design, business logic validation). But every line they generate needs review — I found at least 3-4 bugs that made it through to TypeScript's error checker. The skill isn't in using AI, it's in knowing what to ask and when to override its suggestions.
