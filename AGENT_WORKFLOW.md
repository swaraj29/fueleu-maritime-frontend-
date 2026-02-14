# AI Agent Workflow Log

## Agents Used

1. **ChatGPT (GPT-4)** — Used in the browser for initial research on hexagonal architecture patterns for React frontends, understanding FuelEU Maritime compliance concepts (CB formula, banking/pooling rules), and planning the project structure before writing code.
2. **GitHub Copilot** — Used inside VS Code for inline autocompletions while coding. Most useful for filling out TypeScript interfaces, repetitive API adapter methods, and React hook patterns. I had it on throughout and accepted/rejected suggestions as I typed.
3. **Cursor Agent** — Used for bigger tasks like refactoring class-based entities to functional patterns, generating test files, and scaffolding multiple files at once.

---

## Prompts & Outputs

### Example 1: Planning Project Architecture

**Tool:** ChatGPT  
**Prompt:**
```
I need to build a React + TypeScript frontend for a FuelEU Maritime compliance dashboard.
The assignment requires hexagonal architecture (ports & adapters). The app has 4 tabs:
Routes, Compare, Banking, Pooling. It calls a REST backend on localhost:3000.

How should I structure the src/ folder? Give me the folder tree and explain what goes where.
```

**Output (what ChatGPT gave me):**
```
src/
  core/
    domain/entities/     → business rules (isCompliant, isSurplus, etc.)
    domain/types/        → TypeScript interfaces matching API responses
    application/usecases/ → orchestration logic (fetchRoutes, bankSurplus, etc.)
    ports/outbound/      → interfaces that adapters must implement
  adapters/
    infrastructure/api/  → Axios HTTP clients implementing the ports
    ui/components/       → React tab components
    ui/hooks/            → custom hooks managing state + calling use cases
    ui/pages/            → Dashboard page with tab navigation
  shared/
    constants/           → target intensity, API base URL
    utils/               → number formatters
```

**How I used it:** I followed this structure almost exactly. I added `shared/` for constants and formatters that didn't belong in core or adapters. ChatGPT also explained that React components act as inbound adapters and API clients act as outbound adapters — this helped me understand where each file should go.

---

### Example 2: Generating TypeScript Interfaces

**Tool:** GitHub Copilot (inline in VS Code)  
**What I did:** I wrote a comment describing the API response shape, then started typing the interface. Copilot autocompleted it.

```typescript
// I typed this comment:
// API response shape for GET /routes
// Fields: id, routeId, vesselType, fuelType, year, ghgIntensity,
// fuelConsumption, distance, totalEmissions, isBaseline

// Then started typing:
export interface RouteDTO {

// Copilot autocompleted:
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}
```

I verified the fields matched the API docs and the KPI dataset table from the assignment, then accepted it. Did the same for `ComplianceBalanceDTO`, `BankRecordDTO`, `PoolMember`, etc.

---

### Example 3: Refactoring Classes to Functions

**Tool:** Cursor Agent  
**Prompt:**
```
Refactor this Route class into pure exported functions. I want isCompliant and getEnergyInScope
as standalone arrow functions that take RouteDTO as the first parameter. No class needed.
```

**Before (what I had initially):**
```typescript
class Route {
  constructor(private data: RouteDTO) {}
  isCompliant(target: number): boolean {
    return this.data.ghgIntensity <= target;
  }
  getEnergyInScope(): number {
    return this.data.fuelConsumption * ENERGY_CONVERSION_FACTOR;
  }
}
```

**After (what the agent produced):**
```typescript
export const isCompliant = (route: RouteDTO, targetIntensity: number): boolean => {
  return route.ghgIntensity <= targetIntensity;
};

export const getEnergyInScope = (route: RouteDTO): number => {
  return route.fuelConsumption * ENERGY_CONVERSION_FACTOR;
};
```

I applied this same refactor to all 4 entity files (Route, ComplianceBalance, BankEntry, Pool). The agent handled the conversion correctly each time.

---

### Example 4: Writing the useRoutes Hook (Mix of Manual + Copilot)

**Tool:** Manual coding + GitHub Copilot  

I wrote the hook skeleton myself because I'm familiar with React hooks. Copilot helped with the try/catch error handling and the filter logic.

```typescript
// I wrote this part manually — basic hook structure
export const useRoutes = () => {
  const [routes, setRoutes] = useState<RouteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RouteFilters>({});

  // After I typed "const loadRoutes = useCallback(async ", Copilot suggested:
  const loadRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoutes(routeApi, filters);
      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // I added the useEffect and return statement myself
  useEffect(() => { loadRoutes(); }, [loadRoutes]);
  return { routes, loading, error, filters, setFilters, handleSetBaseline, loadComparisons };
};
```

---

### Example 5: Generating Test Files

**Tool:** Cursor Agent  
**Prompt:**
```
Write Vitest unit tests for the Pool entity functions (getPoolSum, isPoolValid).
Use realistic maritime data — ships R001, R002 with CB values like 26308224 and -6817560.
Test edge cases: empty pool, single member, negative sum, zero sum.
```

**Output:** The agent generated 7 test cases covering all the scenarios. I verified the math:
- `getPoolSum([{cbBefore: 26308224}, {cbBefore: -6817560}])` should equal `19490664` ✅
- `isPoolValid` with negative sum should return `false` ✅
- Empty pool (sum = 0) should return `true` ✅

---

## Validation / Corrections

### Import Path Fixes (Manual)
The generated code in use case files used `../../ports/outbound/` but the correct path was `../../../ports/outbound/` because use cases sit 3 levels deep (`core/application/usecases/banking/`). I caught this from TypeScript errors in VS Code and fixed all 3 files by hand. This happened twice — once for the use case files and again for the test files.

### TailwindCSS v4 Fix (Manual)
Copilot suggested `@apply bg-slate-900 text-white` inside `@layer base {}` in index.css. This doesn't work in TailwindCSS v4 — I checked the Tailwind docs and replaced it with plain CSS properties.

### Vite Config Type Fix (Manual)
The agent imported `defineConfig` from `'vite'` when adding test config. But the `test` property only exists in `vitest/config`'s version of `defineConfig`. I found this from a TypeScript lint error and changed the import.

### Pool Validation (Manual Review)
I cross-checked the `isPoolValid` function against Article 21 of FuelEU regulation — the total pool sum must be ≥ 0. Also verified that the test values (26308224, -6817560) produce the expected sum (19490664).

---

## Observations

### Where Agent Saved Time
- **Folder scaffolding** — Creating 20+ files and directories for hexagonal architecture would have been tedious manually
- **TypeScript interfaces** — Copilot autocompleted DTOs instantly from comments describing the API response shape
- **Test boilerplate** — Generating 44 tests with proper mocked interfaces and realistic test data
- **Repetitive adapter code** — The 3 API adapter files follow the same pattern; generating them was fast

### Where It Failed or Hallucinated
- **Import paths** — Consistently wrong in deeply nested directories. AI doesn't reason well about relative file paths
- **TailwindCSS v4** — Used outdated v3 `@apply` syntax in a `@layer` block
- **Vite/Vitest config** — Wrong type import caused a build error
- **Didn't know project context** — GitHub Copilot sometimes suggested imports from packages I hadn't installed

### How I Combined Tools Effectively
1. **ChatGPT first** — Researched architecture, read about the regulation, planned structure
2. **Manual coding** — Wrote core React hooks and component structure myself
3. **GitHub Copilot** — Filled in repetitive patterns as I typed (interfaces, error handling, API calls)
4. **Cursor Agent** — Used for larger multi-file tasks (refactoring entities, generating tests)
5. **Manual debugging** — Fixed all import path issues, CSS problems, and config errors myself

---

## Best Practices Followed

- Used ChatGPT for **research and architecture planning** before writing any code
- Used GitHub Copilot's **inline completions** for boilerplate — accepted or rejected suggestions one by one, didn't blindly accept everything
- Used Cursor Agent for **refactoring** (class → function conversion) and **test generation** — tasks where generating multiple files at once is faster
- Always ran `npx tsc --noEmit` after changes to catch type errors immediately
- **Reviewed every generated line** against the assignment spec and API documentation
- Wrote tests with **mocked repository interfaces** (port pattern) so they run without a backend
- Made **incremental commits**: architecture setup → core layer → adapters → UI → tests → docs
