# Spec: 3-Week WhyTree Longitudinal Simulation

## Goal

Simulate 20 diverse personas using WhyTree daily for 21 days. Measure how perceived value (1-10) evolves over time. Identify where the tool shines, where it stalls, and what improvements would have the highest impact — all without modifying WhyTree code during the experiment.

## Design Principles

1. **Isolation** — Each persona gets a separate WhyTree instance (separate `~/.whytree-sim/<persona-id>/` directory). No persona can see another's data.
2. **Realistic naivety** — Personas receive only the experience a real first-time user would: the counselor prompt guides them, but they have no knowledge of SKILL.md internals, signal detection, or the technique's design rationale.
3. **Temporal fidelity** — Each session simulates a specific date. The persona's life context evolves day-to-day (mood shifts, events happen, motivation fluctuates). `sessionGap` values must reflect actual gaps (skipped days = RECENT/WEEK).
4. **No WhyTree code changes** — The tool is evaluated as-is. Findings feed a post-experiment improvement plan.

## Persona Design (20 personas)

Each persona is defined by: name, age, occupation, life stage, personality type, initial engagement level, and a "life arc" (key events that unfold during the 3 weeks).

### Diversity Axes

| Axis | Coverage |
|---|---|
| Age | 19–62, spread across decades |
| Career stage | Student, early-career, mid-career, senior, retired, career-changer |
| Domain | Tech, healthcare, education, arts, trades, finance, nonprofit, military veteran |
| Personality | Analytical, emotional, skeptical, eager, reserved, verbose |
| Initial stance | Curious, skeptical, desperate, obligated (e.g., assigned by coach), bored |
| Cultural background | Mix of Western, East Asian, South Asian, Latin American, African |
| Language comfort | Native English speakers + 3-4 ESL speakers (varying fluency) |
| Mental health | Generally healthy, one with mild anxiety, one in grief, one post-burnout |

### Persona Roster

| # | Name | Age | Occupation | Personality | Initial Stance | Life Arc (3 weeks) |
|---|---|---|---|---|---|---|
| 1 | Marcus | 28 | Software engineer | Analytical, reserved | Curious | Considering leaving FAANG for startup; gets a competing offer in week 2 |
| 2 | Priya | 34 | Pediatrician | Warm, overcommitted | Desperate | Burnout peaking; spouse gives ultimatum about hours in week 2 |
| 3 | Tomoko | 52 | Corporate VP | Strategic, guarded | Skeptical | Passed over for C-suite; headhunted for a nonprofit role in week 3 |
| 4 | Jamal | 19 | College sophomore | Enthusiastic, scattered | Curious | Undeclared major; parents pressuring pre-med; discovers music production in week 2 |
| 5 | Linda | 45 | High school teacher | Nurturing, frustrated | Obligated (coach assigned) | School budget cuts threaten her program; offered admin role in week 2 |
| 6 | Carlos | 38 | Chef / restaurant owner | Passionate, volatile | Skeptical | Restaurant struggling; food truck opportunity in week 2; partner wants out in week 3 |
| 7 | Aisha | 26 | UX designer | Creative, anxious | Curious | Imposter syndrome at new job; ships a hit feature in week 2, feels nothing |
| 8 | David | 62 | Retired military | Disciplined, isolated | Obligated (VA counselor suggested) | Struggling with civilian identity; grandchild born in week 2 |
| 9 | Suki | 31 | Freelance journalist | Inquisitive, cynical | Skeptical | Writing feels meaningless; gets offered a book deal in week 3 |
| 10 | Ryan | 24 | Electrician | Practical, inarticulate | Reluctant | Good at job but feels hollow; friend dies in accident in week 2 |
| 11 | Mei | 41 | Data scientist | Precise, introverted | Curious | Excellent career but "is this it?"; daughter asks "are you happy, mom?" in week 2 |
| 12 | Kwame | 36 | Nonprofit director | Idealistic, exhausted | Desperate | Org losing funding; board pushing commercial pivot in week 2 |
| 13 | Elena | 29 | Grad student (philosophy) | Intellectual, self-aware | Curious but performative | Knows the "right" answers already; dissertation advisor retires in week 3 |
| 14 | Tony | 55 | Construction foreman | Blunt, uncomfortable with feelings | Reluctant | Knee injury threatens career; son invites him to co-teach woodworking in week 2 |
| 15 | Fatima | 22 | Recent immigrant, retail worker | Resilient, guarded | Curious | Overqualified (was an engineer); credential recognition comes through in week 3 |
| 16 | Greg | 47 | Finance executive | Driven, hollow | Desperate | Divorce finalized week 1; kids won't talk to him; charity work resonates in week 2 |
| 17 | Yuna | 33 | Musician (classical → pop crossover) | Expressive, conflicted | Curious | Feels like selling out; viral moment in week 2 brings unexpected joy |
| 18 | Ben | 40 | Stay-at-home dad | Patient, identity-lost | Obligated (therapist suggested) | Wife gets promoted, family moves; he must decide what's next in week 3 |
| 19 | Amara | 27 | Medical resident | Driven, grieving | Desperate | Lost a patient; questioning medicine entirely; mentorship opportunity in week 3 |
| 20 | Hiroshi | 58 | University professor | Reflective, verbose | Curious | Department shrinking; offered emeritus + consulting; writing memoir |

## Session Protocol

### Per-session structure

Each simulated session follows this flow:

1. **Context injection** — The simulation agent receives:
   - Persona profile (background, personality, life arc)
   - Current simulated date
   - "What happened today" — 1-2 sentences of daily context (mood, events)
   - Previous session's tree state (loaded from persona's WhyTree)
   - Previous ratings and brief session notes
   - Instruction: "You are [persona]. You do NOT know how the tool works internally. Respond naturally as this person would."

2. **WhyTree session** — A counselor agent runs the `/whytree` skill against the persona's tree. The persona agent responds as the character would. Session runs 8-15 exchanges (realistic session length).

3. **Post-session evaluation** — The persona agent (NOT the counselor) rates:
   - **Overall value** (1-10): "How valuable was this session for you?"
   - **Insight novelty** (1-10): "Did you discover something you didn't already know?"
   - **Emotional safety** (1-10): "Did you feel safe and heard?"
   - **Desire to return** (1-10): "How much do you want to come back tomorrow?"
   - **Free-text reflection** (2-3 sentences): What stood out, what felt off

4. **State persistence** — Tree JSON saved. Session transcript, ratings, and reflection logged.

### Simulated calendar

- **Week 1 (Days 1-7):** Onboarding. First encounter. Building comfort.
- **Week 2 (Days 8-14):** Life events hit. The tool is tested under real pressure.
- **Week 3 (Days 15-21):** Integration. Does the tree become a resource they reach for?

### Realistic session patterns

Not every persona uses it every day:
- **Eager users** (5-6 personas): Daily or near-daily
- **Regular users** (8-9 personas): 4-5 times/week, skip weekends or busy days
- **Sporadic users** (4-5 personas): 2-3 times/week, larger gaps
- **Drop-off risk** (1-2 personas): Use it 3-4 times total, then stop

Skipped days must be noted so `sessionGap` is accurate.

## Simulation Architecture

### Agent Roles

```
┌─────────────────────────────────────────────────┐
│              Simulation Orchestrator            │
│  (manages calendar, persona state, scheduling)  │
└──────────┬──────────────────────┬───────────────┘
           │                      │
    ┌──────▼──────┐       ┌──────▼──────┐
    │  Persona    │       │  Counselor  │
    │  Agent      │◄─────►│  Agent      │
    │  (responds  │       │  (runs      │
    │  as user)   │       │  /whytree)  │
    └─────────────┘       └─────────────┘
           │
    ┌──────▼──────┐
    │  Evaluator  │
    │  (rates     │
    │  session)   │
    └─────────────┘
```

### Data Directory Structure

```
~/.whytree-sim/
├── orchestrator-state.json        # Calendar, schedule, global state
├── personas/
│   ├── marcus/
│   │   ├── profile.json           # Persona definition + life arc
│   │   ├── whytree/               # Symlinked or used as WHYTREE_DIR
│   │   │   └── *.json             # Tree data files
│   │   ├── sessions/
│   │   │   ├── day-01.json        # Transcript + ratings
│   │   │   ├── day-02.json
│   │   │   └── ...
│   │   └── summary.json           # Running ratings + reflections
│   ├── priya/
│   │   └── ...
│   └── ...
├── analysis/
│   ├── daily-dashboard.md         # Auto-generated after each day
│   └── final-report.md            # Generated after day 21
└── config.json                    # Simulation parameters
```

### Implementation Approach

Since we cannot modify WhyTree code, the simulation uses **wrapper scripts** that:

1. **Override `WHYTREE_DIR`** — Set `HOME` or use a config override to point each persona's WhyTree at their isolated directory
2. **Simulate dates** — Inject date context into the counselor prompt so `sessionGap` calculations reflect the simulated timeline
3. **Orchestrate conversations** — Use Claude Code agents with carefully constructed prompts

### Session Simulation Script (pseudocode)

```
for each simulated_day in 1..21:
  for each persona in active_personas_today:

    # 1. Load persona state
    profile = load(persona.profile)
    daily_context = generate_daily_context(persona, day)
    tree_state = load(persona.whytree_dir)

    # 2. Spawn paired agents
    counselor = spawn_agent(
      role: "whytree_counselor",
      skill: SKILL.md,
      whytree_dir: persona.whytree_dir,
      simulated_date: day
    )

    persona_agent = spawn_agent(
      role: "simulated_user",
      prompt: """
        You are {profile.name}, a {profile.age}-year-old {profile.occupation}.
        Personality: {profile.personality}
        Today is {simulated_date}. {daily_context}

        You are using a tool called "Why Tree" for purpose discovery.
        You don't know how it works internally — just respond naturally
        as {profile.name} would. Be authentic to the character:
        - If skeptical, push back
        - If emotional, be emotional
        - If inarticulate, struggle with words
        - If intellectual, over-analyze

        Previous sessions: {session_history_summary}
      """
    )

    # 3. Run session (8-15 exchanges)
    transcript = run_conversation(counselor, persona_agent, max_turns=15)

    # 4. Evaluate
    ratings = persona_agent.evaluate(transcript)

    # 5. Save
    save(persona.sessions/day-{N}.json, {transcript, ratings})
    update(persona.summary.json)
```

## Measurement Framework

### Primary Metrics (per persona, per session)

| Metric | Scale | What it measures |
|---|---|---|
| Overall value | 1-10 | Perceived usefulness of this session |
| Insight novelty | 1-10 | Whether new self-knowledge emerged |
| Emotional safety | 1-10 | Trust and psychological comfort |
| Desire to return | 1-10 | Motivation to continue |

### Derived Metrics

- **Engagement curve** — Rating trajectory over 21 days (rising, flat, declining, U-shaped?)
- **Retention** — What % of personas are still using it by day 21?
- **Activation rate** — How many sessions before first "aha moment" (novelty >= 8)?
- **Stall detection** — Consecutive sessions where value < 5
- **Recovery rate** — After a low-value session, how often does the next session recover?
- **Persona cluster analysis** — Which persona types benefit most/least?

### Weekly Aggregates

| Week | Expected Pattern | Key Question |
|---|---|---|
| Week 1 | Novelty high, depth low | Does the tool earn trust? |
| Week 2 | Life events test the tool | Does it help when it matters? |
| Week 3 | Novelty may plateau | Does it still add value, or is it repetitive? |

## Expected Failure Modes to Watch

1. **Repetitive sessions** — After 5-7 sessions, does the counselor keep asking the same questions? Does the tree grow or stagnate?
2. **Shallow trees for inarticulate users** — Do Tony, Ryan, Fatima hit a wall because the technique requires verbal fluency?
3. **Over-intellectualization** — Does Elena game the system with cached insights?
4. **Obligation resentment** — Do Linda, David, Ben resent being "assigned" this tool?
5. **Crisis mismatch** — When Ryan's friend dies or Amara loses a patient, does the tool feel tone-deaf?
6. **Diminishing returns** — Is session 15 meaningfully different from session 5?
7. **Tree clutter** — After 15+ sessions, does the tree become unwieldy?
8. **Session gap handling** — Does the tool re-orient well after 2-3 day gaps?

## Output Deliverables

### After simulation completes:

1. **Rating heatmap** — 20 personas x 21 days, color-coded 1-10
2. **Persona narratives** — 1-paragraph summary per persona: what happened, what worked, what didn't
3. **Top 10 improvement opportunities** — Ranked by impact x frequency, with transcript evidence
4. **Engagement archetypes** — Cluster personas into 3-5 engagement patterns
5. **Critical incidents log** — Sessions where the tool notably succeeded or failed, with analysis
6. **Recommendations** — Prioritized list of WhyTree changes to make post-experiment

## Execution Plan

### Phase 1: Setup (before simulation)
- Create persona profiles with full life arcs
- Set up data directories
- Build orchestration script
- Run 1 pilot persona for 3 days to calibrate

### Phase 2: Simulation (21 simulated days)
- Run 4-5 personas per batch (parallel agents)
- Generate daily dashboard after each simulated day
- Human checkpoint after Week 1 to catch simulation drift

### Phase 3: Analysis (after simulation)
- Generate all deliverables
- Identify top improvement opportunities
- Draft improvement plan for WhyTree code changes

## Constraints

- **No WhyTree code modification** during simulation
- **Context window management** — Each session must be self-contained; persona continuity comes from saved state, not conversation history
- **Cost awareness** — 20 personas x ~15 sessions x ~12 exchanges = ~3,600 agent exchanges. Budget accordingly.
- **Simulation ≠ reality** — Findings are hypotheses, not user research. Real users will surprise us in ways simulated personas cannot.

## Open Questions

1. Should we simulate the MCP tool calls or actually run WhyTree CLI for each persona?
2. How do we handle the counselor agent's access to SKILL.md without the persona seeing it?
3. Should we include a control group (5 personas using a simple journaling prompt instead)?
4. What's the minimum session length that produces meaningful data?
5. How do we prevent persona agents from "performing" depth they wouldn't actually have?
