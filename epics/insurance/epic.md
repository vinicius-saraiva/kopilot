# Assicurazione

**Epic:** Sezione dedicata all'assicurazione del veicolo
**Status:** Planned
**Correlati:** [Country Profiles](../country-profiles/epic.md), [Dashboard](../dashboard/epic.md), [History](../history/epic.md)

---

## Obiettivo

Trasformare l'assicurazione da semplice reminder con data di scadenza (come oggi nella Dashboard) a una scheda dedicata dove l'utente ha tutto sotto controllo: chi contattare, quanto paga, quando scade.

Il caso d'uso principale è: **"Ho bisogno di chiamare qualcuno per la mia assicurazione, subito"** — i contatti devono essere raggiungibili in 2 tap dalla Dashboard.

---

## Come funziona

Dalla Dashboard, tappando sull'item "Seguro" / "Insurance" / "Assicurazione", si apre una scheda dedicata (non più un semplice form data). La scheda raccoglie tutte le informazioni della polizza in un'unica pagina scrollabile.

### Sezioni della scheda

**Stato** — Se la polizza è attiva, in scadenza, o scaduta. Derivato dalla data di scadenza.

**Contatti** — Uno o due blocchi contatto con azioni rapide (telefono, WhatsApp, sito, app). Usare gli stessi componenti di contatto e shortcut già presenti nella Dashboard.

**Polizza** — Numero polizza, date di vigenza (inizio/scadenza), documento PDF caricabile e consultabile in-app.

**Pagamento** — Valore totale, modalità (unica o rateale), carta utilizzata. Se rateale: numero rate e quale rata è la prossima.

---

## Contatti

L'utente può avere **1 o 2 blocchi contatto** — flessibile, non forzato.

Ogni blocco ha: etichetta libera (es. "Corretora", "Compagnia", "Agent"), nome, e azioni rapide per contattare (telefono, WhatsApp, sito web, app).

### Perché 1 o 2 contatti

| Paese | Modello tipico |
|-------|---------------|
| **Brasile** | Due attori: **corretora** (broker, punto di contatto principale) + **seguradora** (compagnia che emette la polizza). L'utente ha bisogno dei contatti di entrambi. |
| **USA** | Compagnia diretta (State Farm, Geico...) o tramite agent/broker. Di solito un solo contatto basta. |
| **Italia** | Compagnia diretta (UnipolSai, Generali...) o tramite agenzia. Di solito un solo contatto basta. |

In Brasile suggerire due blocchi ("Corretora" + "Seguradora"). In USA/Italia suggerire un blocco ("Compagnia" / "Insurance Company"). L'utente può sempre aggiungere o rimuovere un blocco.

---

## Polizza

| Campo | Obbligatorio | Note |
|-------|:---:|-------|
| Numero polizza | No | Identificativo della polizza |
| Data inizio | Sì | Inizio copertura |
| Data scadenza | Sì | Fine copertura — alimenta il reminder sulla Dashboard |
| Documento PDF | No | Upload, consultabile in-app con un tap |

---

## Pagamento

| Campo | Obbligatorio | Note |
|-------|:---:|-------|
| Valore totale | No | Importo complessivo |
| Modalità | No | Pagamento unico o rateale |
| Numero rate | No | Solo se rateale |
| Carta utilizzata | No | Testo libero, es. "Nubank ****4321" |

Se rateale, mostrare quale rata è la prossima (calcolata da totale, numero rate, e date di vigenza).

Se il pagamento è a rate, sullo storico di spese, devi aggiungere soltanto la rate equivalente al mese su ogni mese.

---

## Flussi principali

### Primo setup

L'utente tappa "Seguro" dalla Dashboard → scheda vuota con invito a compilare → compila contatti, polizza, pagamento. Ogni sezione è salvabile indipendentemente. La data di scadenza alimenta il reminder.

### Consultazione rapida

L'utente ha un problema → apre Kopilot → tappa "Seguro" → vede i contatti → tappa WhatsApp o telefono → contatto raggiunto in 2 tap.

### Rinnovo

Reminder 30 giorni prima della scadenza → l'utente rinnova → aggiorna date, importo, carica nuovo PDF → il vecchio PDF e i dati precedenti vanno nello storico (History).

---

## Requisiti

| Requisito | Priorità |
|-----------|----------|
| Scheda dedicata (sostituisce il semplice reminder) | P0 |
| Blocchi contatto con azioni rapide | P0 |
| Data scadenza con reminder | P0 |
| Upload e visualizzazione PDF polizza | P1 |
| Info pagamento con rate | P1 |
| Suggerimento numero blocchi per paese | P2 |

---

## Impatto su altri epic

- **Dashboard:** L'item assicurazione ora apre questa scheda invece di un semplice form data.
- **Country Profiles:** I suggerimenti per i blocchi contatto (1 vs 2) e le etichette dipendono dal paese.
- **History:** Al rinnovo, il vecchio documento e i dati precedenti vengono archiviati.
