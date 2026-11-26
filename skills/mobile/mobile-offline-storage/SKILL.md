---
name: mobile-offline-storage
description: Local persistence and offline support for React Native - MMKV, expo-sqlite, TanStack Query cache persistence, secure storage and a sync queue. Use when the app must work offline or cache data.
platform: mobile
sections: [persistence, offline, caching, sync]
tags: [mmkv, sqlite, offline-first, tanstack-query, secure-store]
requires: []
---

# Offline & Storage

## Choose storage by data type
| Data | Use |
|---|---|
| Tokens, secrets | `expo-secure-store` (Keychain/Keystore) |
| Small key-value, settings, flags | `react-native-mmkv` |
| Relational/queryable data, large lists | `expo-sqlite` (+ Drizzle ORM optional) |
| Server cache | TanStack Query + persister (MMKV or SQLite) |
| Files/media | `expo-file-system` |

## Rules
- Never store tokens in plain AsyncStorage/MMKV.
- Treat the server as source of truth; local DB is a cache unless the app is truly local-first.
- Mutations while offline go to a persisted **outbox queue** (id, type, payload, attempts, createdAt); replay in order on reconnect (`@react-native-community/netinfo`), with idempotency keys and exponential backoff.
- Show connectivity and sync state in the UI (banner or subtle indicator); optimistic updates with rollback on failure.
- Version the local schema and write migrations; handle app upgrade paths.
- Clear all local data and secure storage on logout.

## Checklist
- [ ] Airplane-mode test: read cached data, queue a mutation, reconnect, mutation syncs once
- [ ] Secrets only in secure storage
- [ ] Migrations tested on upgrade
- [ ] Logout wipes user data
