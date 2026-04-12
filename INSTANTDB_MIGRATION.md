# Triplit to InstantDB Migration Evaluation

**Date**: 2026-04-12
**Status**: Evaluation / Future consideration
**Motivation**: Triplit development appears to have stalled; evaluate InstantDB as a replacement.

## Current Triplit Usage Summary

| Aspect | Details |
|---|---|
| Collections | 2 (`events`, `locations`) |
| Queries | 2 subscription-based (filtered events, all locations) |
| Mutations | insert, update, delete on `events` |
| Server | Self-hosted, SQLite backend (`triplit/server.js`) |
| Client storage | IndexedDB (`storage: { type: "indexeddb" }`) |
| Auth | Anonymous JWT tokens |
| React integration | `useConnectionStatus` hook, manual `subscribe()` calls |
| Files touching Triplit | ~12 files |

### Files with Triplit dependencies

| File | Role |
|---|---|
| `triplit/schema.ts` | Schema definitions (2 collections) |
| `triplit/client.ts` | Client init, connection monitoring |
| `triplit/server.js` | Self-hosted server (SQLite) |
| `triplit/client.mock.ts` | Storybook/test mock |
| `triplit/seeds/the-seed.ts` | Seed data (10 locations) |
| `src/components/EventsCell.tsx` | Event subscription + query |
| `src/components/LocationsCell.tsx` | Location subscription + query |
| `src/components/Week.tsx` | Event insert/update |
| `src/components/EventModal.tsx` | Event update/delete |
| `src/components/ConnectionStatus.tsx` | Connection status UI |
| `src/stores/connectionStatusStore.ts` | Connection state (Zustand) |
| `.env.development`, `.env.stage`, `.env.production` | Server URL + token config |
| `package.json` | Triplit dependencies |

## InstantDB Overview

- **Repo**: https://github.com/instantdb/instant
- **License**: Open source
- **Self-hostable**: Yes, via Docker (Clojure server + PostgreSQL backend)
- **Client storage**: IndexedDB cache on web, AsyncStorage on React Native
- **Offline**: Queues mutations locally, syncs on reconnect (cache-based, not full replica)
- **React hooks**: `@instantdb/react` with `useQuery`, `transact`, connection status
- **Query model**: Declarative/relational (`{ events: { $: { where: { ... } } } }`)
- **Mutation model**: Transaction-based (`db.transact(tx.events[id].update({...}))`)

## Key Differences

### API Syntax

**Triplit query:**
```ts
const query = triplit.query("events").Where([
  ["location_id", "=", locationId],
  ["date", "<=", beforeDate],
]);
triplit.subscribe(query, (data) => setEvents(data));
```

**InstantDB equivalent:**
```ts
const { data } = db.useQuery({
  events: { $: { where: { location_id: locationId, date: { $lte: beforeDate } } } }
});
```

**Triplit mutation:**
```ts
await triplit.insert("events", { ...data, created_at: new Date() });
await triplit.update("events", id, { ...data, updated_at: new Date() });
await triplit.delete("events", id);
```

**InstantDB equivalent:**
```ts
db.transact(tx.events[id()].update({ ...data, created_at: Date.now() }));
db.transact(tx.events[id].update({ ...data, updated_at: Date.now() }));
db.transact(tx.events[id].delete());
```

### Server Architecture

| | Triplit (current) | InstantDB |
|---|---|---|
| Server runtime | Node.js | Clojure (JVM) |
| Storage backend | SQLite (embedded, zero-config) | PostgreSQL (separate service) |
| Deployment weight | Lightweight | Heavier (JVM + PostgreSQL) |
| Docker | Not required | Docker Compose recommended |

### Open Question: PGlite as a lighter alternative to PostgreSQL

[PGlite](https://github.com/electric-sql/pglite) is an embedded PostgreSQL engine
compiled to WASM (~3MB gzipped). It runs in-process in Node.js/Bun without a separate
PostgreSQL server, using the filesystem for persistence -- conceptually similar to how
Triplit uses SQLite today.

**However**: There is no confirmed support for using PGlite as InstantDB's storage
backend. The InstantDB server expects a `DATABASE_URL` pointing to a real PostgreSQL
instance. PGlite *does* expose a PostgreSQL-compatible interface, so it may be possible
in theory, but this is **untested and unsupported** as of April 2026.

This is worth tracking. If PGlite compatibility is confirmed or added, it would make
the self-hosted InstantDB deployment nearly as lightweight as the current Triplit setup.
Relevant issues to watch:
- https://github.com/instantdb/instant/issues/1240 (self-hosting docs)
- https://github.com/instantdb/instant/issues/34 (docker-compose setup)

## What We Gain

- Actively maintained project with funded team
- Built-in auth options (Google, email magic links, etc.)
- Graph-based relational queries (useful if we add more collections later)
- Growing ecosystem and community

## What We Risk / Lose

- **PostgreSQL dependency** for self-hosting adds operational complexity vs current SQLite
- Migration effort across ~12 files (moderate but non-trivial)
- Learning curve for InstantDB's transaction-based mutation API and InstaQL query syntax
- Offline story is cache-based, not a full local database (unlikely to matter for this app)
- InstantDB is also a startup -- could face similar sustainability risks long-term

## Estimated Effort

**Overall: ~2-3 days for a developer familiar with both systems.**

| Task | Effort |
|---|---|
| Set up InstantDB (cloud or self-hosted) | 2-4 hours |
| Rewrite schema | 30 min |
| Rewrite client init | 30 min |
| Rewrite queries (EventsCell, LocationsCell) | 1-2 hours |
| Rewrite mutations (Week, EventModal) | 1-2 hours |
| Rewrite connection status handling | 1 hour |
| Rewrite mock client for Storybook | 1 hour |
| Rewrite seed data | 30 min |
| Update env files and package.json | 30 min |
| Testing and debugging | 2-4 hours |
| Data migration (export Triplit, import to InstantDB) | 1-2 hours |

---

## Action Plan

### Phase 0: Prerequisites
- [ ] Decide: use InstantDB cloud free tier, or self-host?
- [ ] If self-hosting: determine if PostgreSQL is acceptable, or wait for PGlite compat
- [ ] Create an InstantDB account / project (if using cloud)
- [ ] Read InstantDB docs: schema, queries, transactions, permissions, React hooks

### Phase 1: Setup
- [ ] Install `@instantdb/react` (replaces `@triplit/react` and `@triplit/client`)
- [ ] Remove `@triplit/server`, `@triplit/cli`, `@triplit/client`, `@triplit/react` from package.json
- [ ] Create `instant.schema.ts` with `events` and `locations` collections
- [ ] Create `instant.perms.ts` with anonymous read/write rules
- [ ] Create new client init file (replaces `triplit/client.ts`)
- [ ] Update `.env.development`, `.env.stage`, `.env.production` with InstantDB config

### Phase 2: Queries and Subscriptions
- [ ] Rewrite `src/components/EventsCell.tsx` to use `db.useQuery()` with date/location filters
- [ ] Rewrite `src/components/LocationsCell.tsx` to use `db.useQuery()` for all locations
- [ ] Verify real-time updates work (add/edit/delete an event, confirm UI updates)

### Phase 3: Mutations
- [ ] Rewrite insert logic in `src/components/Week.tsx` to use `db.transact()`
- [ ] Rewrite update logic in `src/components/Week.tsx` and `src/components/EventModal.tsx`
- [ ] Rewrite delete logic in `src/components/EventModal.tsx`
- [ ] Verify returned IDs are captured correctly after insert

### Phase 4: Connection Status
- [ ] Update `src/components/ConnectionStatus.tsx` to use InstantDB connection status API
- [ ] Update `src/stores/connectionStatusStore.ts` to map InstantDB status events
- [ ] Verify online/offline badge behavior

### Phase 5: Testing and Cleanup
- [ ] Rewrite `triplit/client.mock.ts` for Storybook compatibility
- [ ] Rewrite `triplit/seeds/the-seed.ts` using InstantDB transaction API
- [ ] Run seed data against new backend
- [ ] Test full CRUD flow end-to-end
- [ ] Test offline behavior (disconnect network, make changes, reconnect)
- [ ] Test with multiple browser tabs (real-time sync)
- [ ] Remove `triplit/` directory
- [ ] Remove Triplit-related env vars and scripts
- [ ] Update README if needed

### Phase 6: Deploy
- [ ] Deploy InstantDB backend (cloud or self-hosted)
- [ ] Migrate production data from Triplit to InstantDB
- [ ] Deploy updated frontend to staging
- [ ] Smoke test staging
- [ ] Deploy to production
