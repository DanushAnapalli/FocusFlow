# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-07)

**Core value:** Users must receive accurate, real-time awareness of when they're losing focus through webcam-based detection
**Current focus:** Phase 3 - AI Coaching Nudges (IN PROGRESS)

## Current Position

Phase: 3 of 5 (AI Coaching Nudges)
Plan: 1 of 2 in current phase
Status: In progress
Last activity: 2026-02-08 -- Completed 03-01-PLAN.md

Progress: [██████░░░░] 60%

## Performance Metrics

**Velocity:**
- Total plans completed: 6
- Average duration: 4 min
- Total execution time: 0.33 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Webcam Detection Pipeline | 2/3 | 9 min | 4.5 min |
| 2. Focus Scoring & Visualization | 3/3 | 8 min | 2.7 min |
| 3. AI Coaching Nudges | 1/2 | 3 min | 3.0 min |

**Recent Trend:**
- Last 5 plans: 3min, 3min, 2min, 3min, 3min
- Trend: Stable (~3 min/plan)

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: Detection and performance requirements grouped into Phase 1 (must validate stability before scoring depends on it)
- [Roadmap]: Multiplayer deferred to v2 (solo demo is the priority for hackathon)
- [Roadmap]: UI requirements distributed across feature phases rather than a separate UI phase
- [01-01]: Used ClientDetectionLoader wrapper for next/dynamic ssr:false (Next.js 15 requires ssr:false inside use client components)
- [01-01]: PermissionGate receives state as props instead of owning its own hook (prevents dual state machines)
- [01-01]: HumanGL backend configured per research (3.6x faster warmup than webgl)
- [01-02]: WebcamView is presentational (receives props from DetectionProvider), following single hook owner pattern
- [01-02]: Canvas overlay mirrors drawing context to match CSS -scale-x-100 on video, text drawn un-mirrored
- [01-02]: Fallback bounding box draw path if human.draw.all() fails (robustness)
- [02-01]: Separate routes: / = Hero landing, /session = detection pipeline (clean separation of marketing and app)
- [02-01]: Used framer-motion package name per user CONTEXT.md (not rebranded 'motion' package)
- [02-01]: Button without @radix-ui/react-slot (asChild unnecessary for hackathon)
- [02-02]: Asymmetric hysteresis (drop=8, recover=5): harder to drop than recover, matching user expectation
- [02-02]: EMA state and displayed score in useRef (not useState) to avoid unnecessary re-renders
- [02-02]: History capped at 300 entries (~60s at 5Hz) for sparkline without unbounded memory
- [02-03]: Default exports for scoring components (matches project convention)
- [02-03]: Collapsible sensitivity slider reduces visual noise; advanced control for demo operator
- [02-03]: Fixed 200px ring size with will-change hint to prevent SVG layout thrash
- [02-03]: SSR guard pattern (useState + useEffect mount check) for Recharts components
- [03-01]: Immutable state machine: all coaching-engine functions return new NudgeState objects
- [03-01]: 27 pre-cache phrases (9 per tier) for COACH-05 corpus
- [03-01]: Precache route calls ElevenLabs API directly to avoid Next.js self-request issues
- [03-01]: Buffer-to-Uint8Array conversion for NextResponse body compatibility

### Pending Todos

None yet.

### Blockers/Concerns

- Hackathon timeline is days/weeks -- ruthless prioritization required
- Human.js performance on actual demo hardware is unknown (must benchmark in Phase 1)
- Turbopack workspace root warning from lockfile detection; harmless but may surface during development
- GEMINI_API_KEY needs to be added to .env.local for Gemini text generation to work (fallback phrases will be used until configured)

## Session Continuity

Last session: 2026-02-08
Stopped at: Completed 03-01-PLAN.md (Coaching engine foundation: state machine, prompts, cache, API routes)
Resume file: .planning/phases/03-ai-coaching-nudges-ai-coaching-nudges/03-02-PLAN.md
