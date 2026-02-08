# Project State: FocusFlow

**Last Updated:** 2026-02-08
**Current Phase:** Phase 4 - Session Management (Plan 1 of 3 complete)
**Status:** Session foundation built, UI integration next

## Current Milestone

**Milestone:** Core Demo Loop (Phases 1-3) + Session Management (Phase 4)
**Status:** Phase 4 in progress (1/3 plans complete)
**Progress:** 3/6 phases complete, phase 4 started
**Progress bar:** ██████████░░░░░░░░░░ (50% phases, 1/3 P4 plans)

## Recent Changes (Last 7 Days)

### 2026-02-08
- ✅ **Phase 3 Complete:** AI Coaching Nudges fully implemented
  - Coaching engine with state machine (timing, escalation, recovery)
  - Gemini 2.5 Flash integration for contextual coaching text
  - ElevenLabs Flash v2.5 TTS with server-side caching
  - NudgeIndicator component with tier-colored styling
  - Pre-cache warm-up system (27 phrases)
  - SpeechSynthesis fallback for offline/quota scenarios
  - Complete pipeline: score drop → chime → coaching → visual feedback

- 🔧 **Focus Scoring Refinement:**
  - Changed to 3-second timer system (±1 point every 3 seconds)
  - Score only decreases (no increase), starting at 100
  - Improved detection thresholds (head: ±45°/35°, gaze: ±60°)
  - Reduced gaze weight to 20%, increased head pose to 70%
  - Chime trigger lowered to 2 points lost (from 5)
  - Chime interval reduced to 1.5 seconds (from 3 seconds)

### 2026-02-07
- ✅ **Phase 2 Complete:** Focus Scoring & Visualization
  - Real-time 0-100 focus score with color-coded feedback
  - Animated circular ring, sparkline chart, stat cards
  - Sensitivity slider for EMA tuning
  - Two-column layout (webcam + analytics)
  - Audio chime system for focus drops

## Active Work

**Current:** Phase 4 - Session Management (Plan 04-02: Session UI Controls next)
**Last Completed:** 04-01-PLAN.md (Session Management Foundation)
**Next:** Plan 04-02 (Session controls, summary modal, DetectionProvider integration)
**Blocked:** None

## Technical Debt

- [ ] Add proper error boundaries for React components
- [ ] Implement retry logic for API failures (Gemini, ElevenLabs)
- [ ] Add E2E tests for coaching pipeline
- [ ] Optimize tensor memory usage in long sessions (>1 hour)
- [ ] Add loading states for API calls

## Known Issues

- [ ] Score can appear "stuck" momentarily when hysteresis prevents update (by design, but may need UX improvement)
- [ ] Calibration progress bar animation can lag on slower devices
- [ ] SpeechSynthesis onend sometimes doesn't fire (10s timeout mitigates this)

## Environment Status

**Development:**
- ✅ Next.js 15 with Turbopack
- ✅ Human.js detection running at ~5 FPS
- ✅ Gemini API integrated (requires GEMINI_API_KEY)
- ✅ ElevenLabs TTS integrated (requires ELEVENLABS_API_KEY)
- ✅ All builds passing

**API Keys Required:**
- `GEMINI_API_KEY` - Google AI Studio
- `ELEVENLABS_API_KEY` - ElevenLabs

## Metrics

**Phase Completion:**
- Phase 1: Not started (3 plans)
- Phase 2: ✅ Complete (3/3 plans, 2026-02-07)
- Phase 3: ✅ Complete (2/2 plans, 2026-02-08)
- Phase 4: In progress (1/3 plans, 2026-02-08)
- Phase 5: Not started (stretch goal)
- Phase 6: Not started (polish/enhancements)

**Code Stats:**
- Total commits: ~15+
- Active files: ~30
- API routes: 3 (coaching/generate, coaching/precache, elevenlabs/speak)
- React hooks: 6 (useWebcamPermission, useHumanDetection, useFocusScore, useFocusChime, useAICoaching, useSessionManager)
- Components: ~15

## Next Steps

1. **Plan 04-02:** Session UI Controls - SessionControls component, SessionSummary modal, DetectionProvider integration
2. **Plan 04-03:** Session History & Streaks - SessionHistory list, StreakBadge, PersonalBests, pre-session dashboard
3. **Phase 4 UAT:** End-to-end session lifecycle verification

## Dependencies

**External Services:**
- Google Gemini API (text generation)
- ElevenLabs API (voice synthesis)
- Browser SpeechSynthesis (fallback)

**Browser Requirements:**
- Chrome/Edge (primary targets)
- Webcam permission required
- WebGL for TensorFlow.js

## Decisions Log

### Recent Decisions
1. **[2026-02-08]** useReducer for session state machine (no new dependency, predictable transitions)
2. **[2026-02-08]** localStorage for session persistence (data < 100KB, no IndexedDB needed)
3. **[2026-02-08]** Sessions under 60s not persisted (prevents accidental starts polluting history)
4. **[2026-02-08]** Snapshots downsampled to 120 points for storage (one per ~30s for 60-min session)
5. **[2026-02-08]** Reset functions preserve calibration and audio cache (expensive to regenerate)
6. **[2026-02-08]** Phase 6 added: Polish & Visual Enhancements - dynamic face mesh color based on focus score
7. **[2026-02-08]** Focus score only decreases (no increase) - simpler "survival mode"
8. **[2026-02-08]** 3-second discrete timer instead of continuous smoothing - more predictable
9. **[2026-02-08]** Escalation persists across session (resets only on sustained high focus)
10. **[2026-02-08]** Pre-cache audio on session start (fire-and-forget, non-blocking)
11. **[2026-02-07]** Head pose weighted higher than gaze (70% vs 20%) - reliability over accuracy

### Historical Decisions
- Chose Human.js over MediaPipe (browser-native, no backend)
- Chose Next.js App Router over Pages (modern, streaming)
- Chose ElevenLabs Flash v2.5 over Turbo (latency: 75ms vs 450ms)
- Chose Gemini 2.5 Flash over GPT-4 (cost, caching, performance)

## Session Continuity

**Last session:** 2026-02-08
**Stopped at:** Completed 04-01-PLAN.md
**Resume:** .planning/phases/04-session-management-session-management/04-02-PLAN.md

---
*Updated: 2026-02-08*
*Status: Phase 4 In Progress (1/3 plans complete)*
