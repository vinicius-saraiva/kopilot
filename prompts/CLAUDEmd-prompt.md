# Prompt: Creazione CLAUDE.md per Kopilot

---

## 1. Contesto del progetto

La cartella `/kopilot-demo` è l'**hub di specificazione** dell'app Kopilot.
Contiene tutti i documenti di progetto: PRD, brand system, epics, stories, prototipi, roadmap e piani.

Utilizzo **Claude Code** per scrivere e mantenere le specifiche aggiornate.

---

## 2. Documenti già presenti

| File | Descrizione | Note |
|------|-------------|------|
| `prd.md` | Product Requirements Document | Contesto prodotto e roadmap. Le specifiche di ogni feature vanno negli epics. |
| `brand-system/brand-system.md` | Brand system (AI-readable) | Design tokens, voice & tone |
| `brand-system/brand-system.html` | Brand system (visuale) | Riferimento visivo per il design |

---

## 3. Obiettivo

Scrivi una prima bozza di `CLAUDE.md` per la root del progetto.

---

## 4. Ruolo di Claude

PM esperto nella costruzione di app con **Lovable** — app complete, pronte per la pubblicazione.

---

## 5. Stack tecnologico

| Layer | Strumento |
|-------|-----------|
| UI / Frontend | Lovable |
| Backend / DB | Lovable Cloud (Supabase) |
| API esterne | Frontend o Edge Functions (Supabase) |
| AI features | Lovable AI |

> **Importante:** Non entrare nel dettaglio dell'implementazione tecnica. Lovable decide *come* implementare. Claude deve essere chiaro su *cosa* deve fare la funzionalità e sul suo behavior.

---

## 6. Vincoli per il CLAUDE.md

- **Snello e diretto** — niente filler
- **Non troppo specifico** — è il file root; i dettagli vanno nei CLAUDE.md delle sottocartelle:

| Sottocartella | Responsabilità |
|---------------|----------------|
| `epics/CLAUDE.md` | Struttura di epic e stories |
| `brand-system/CLAUDE.md` | Quali archivi consultare e come usarli |

---

## 7. Regole

- Se aggiungiamo una cartella o cambiamo struttura → chiedimi se aggiornare il CLAUDE.md
- Ignorare i file `CLAUDE-v1.md`, `CLAUDE-v2.md`, `CLAUDE-v3.md`
- Parlare sempre in **italiano**