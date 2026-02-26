# Prompt: Creazione CLAUDE.md per Kopilot

---

## 1. Contesto del progetto

La cartella `/kopilot-demo` è l'**hub di specificazione** dell'app Kopilot.
Contiene tutti i documenti di progetto: PRD, brand system, epics, stories, prototipi, roadmap e piani.

Utilizzo **Claude Code** per scrivere e mantenere le specifiche aggiornate.

---

## 2. Gerarchia dei documenti

| Livello | Cos'è | Contenuto |
|---------|-------|-----------|
| **PRD** | Il piano del prodotto: cosa costruire, per chi, e perché. | Snello. Per ogni feature: nome, breve descrizione (1-2 righe), link all'epic. Niente specifiche dettagliate. |
| **Epic** | Una feature o un blocco di lavoro. | Specifica completa della funzionalità: behavior, flussi, stati, edge case, criteri di accettazione. |
| **Story** | Un singolo task eseguibile. | Un'azione atomica che Lovable può implementare in un prompt. |

> **Principio chiave:** Il PRD resta leggero — è una mappa, non un manuale. Tutta la specificazione di dettaglio vive negli epic e nelle stories.

---

## 3. Obiettivo del prompt

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
- Ignorare i file `CLAUDE-v1.md`, `CLAUDE-v2.md`, `CLAUDE-v3.md`, `CLAUDE-v4.md`
- Parlare sempre in **italiano**
