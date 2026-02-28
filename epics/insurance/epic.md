# Assicurazione

**Epic:** Sezione dedicata all'assicurazione del veicolo
**Status:** Planned
**Correlati:** [Country Profiles](../country-profiles/epic.md), [Dashboard](../dashboard/epic.md), [History](../history/epic.md)

---

## Obiettivo

Trasformare l'assicurazione da semplice reminder con data di scadenza (come oggi nella Dashboard) a una sezione dedicata dove l'utente ha tutto sotto controllo: chi è il suo assicuratore, chi è il suo intermediario, come contattarli rapidamente, quanto sta pagando, come, e quando scade.

---

## Contesto: come funziona l'assicurazione per paese

### Brasile

In Brasile l'assicurazione auto è **volontaria** e funziona con un modello a due attori:

- **Corretora de seguros** (broker) — l'intermediario che cerca le migliori offerte tra diverse compagnie. È il punto di contatto principale dell'utente per preventivi, rinnovi e sinistri.
- **Seguradora** (compagnia assicurativa) — chi emette la polizza (es. HDI, Porto Seguro, Tokio Marine, Allianz, Bradesco Seguros).

L'utente ha bisogno dei contatti di **entrambi**.

### USA

L'utente tratta direttamente con la compagnia assicurativa (State Farm, Geico, Progressive...) o tramite un agente/broker. L'assicurazione di responsabilità civile è **obbligatoria**.

### Italia

L'utente può trattare direttamente con la compagnia (UnipolSai, Generali, Allianz...) o tramite un'agenzia. L'assicurazione RC Auto è **obbligatoria**.

> **Principio:** La sezione deve essere flessibile — supportare da un solo contatto (compagnia diretta) a due contatti separati (broker + compagnia), senza forzare una struttura rigida.

---

## Come funziona

La sezione Assicurazione è accessibile dalla Dashboard, tappando sull'item "Seguro" / "Insurance" / "Assicurazione". Invece di aprire un semplice form di reminder, si apre una **scheda dedicata** con tutte le informazioni della polizza.

### Struttura della scheda

```
┌─────────────────────────────────────┐
│ Assicurazione                       │
├─────────────────────────────────────┤
│                                     │
│ STATO           ● Attiva (scade tra │
│                   47 giorni)        │
│                                     │
├─────────────────────────────────────┤
│ CONTATTI                            │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Corretora / Broker              │ │
│ │ Maria Silva Seguros             │ │
│ │ 📞 (11) 99999-0000  💬 🌐     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Seguradora / Compagnia          │ │
│ │ Porto Seguro                    │ │
│ │ 📞 0800-727-0800   💬 🌐 📱   │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ POLIZZA                             │
│                                     │
│ Numero:    1234567890               │
│ Vigenza:   01/03/2025 → 01/03/2026 │
│ Documento: polizza.pdf  [Apri]      │
│                                     │
├─────────────────────────────────────┤
│ PAGAMENTO                           │
│                                     │
│ Totale:    R$ 2.400,00              │
│ Modalità:  8x di R$ 300,00         │
│ Carta:     Nubank ****4321          │
│ Prossima:  15/04/2025 (rata 3/8)   │
│                                     │
└─────────────────────────────────────┘
```

---

## Contatti e Shortcut

I contatti usano lo stesso pattern di **shortcut** già presente nella Dashboard (es. link al DETRAN, DMV). Ogni contatto è un blocco con:

| Campo | Tipo | Obbligatorio | Note |
|-------|------|:---:|-------|
| Etichetta | Testo | Sì | Es. "Corretora", "Seguradora", "Agent", "Compagnia" — l'utente sceglie |
| Nome | Testo | Sì | Es. "Maria Silva Seguros", "Porto Seguro" |
| Telefono | Telefono | No | Tap per chiamare |
| WhatsApp | Telefono/Link | No | Tap per aprire chat WhatsApp |
| Sito web | URL | No | Tap per aprire browser |
| App | Deep link / URL | No | Tap per aprire l'app della compagnia |

- L'utente può aggiungere **1 o 2 blocchi contatto** (flessibile).
- In Brasile il setup suggerisce due blocchi: "Corretora" e "Seguradora".
- In USA/Italia il setup suggerisce un blocco unico: "Compagnia" / "Insurance Company".
- L'utente può sempre aggiungere o rimuovere un blocco.

---

## Polizza

| Campo | Tipo | Obbligatorio | Note |
|-------|------|:---:|-------|
| Numero polizza | Testo | No | Numero identificativo della polizza |
| Data inizio | Data | Sì | Inizio della copertura |
| Data scadenza | Data | Sì | Fine della copertura — alimenta il reminder |
| Documento PDF | File (upload) | No | L'utente carica il PDF della polizza |

### Upload PDF

- Formati accettati: PDF
- Il file è consultabile in-app (visualizzatore PDF o apertura nel viewer di sistema)
- L'utente può sostituire il documento in qualsiasi momento

---

## Pagamento

| Campo | Tipo | Obbligatorio | Note |
|-------|------|:---:|-------|
| Valore totale | Valuta | No | Importo complessivo della polizza |
| Modalità | Selezione | No | Pagamento unico / Rateale |
| Numero rate | Numero | No | Visibile solo se modalità = Rateale |
| Carta utilizzata | Testo | No | Es. "Nubank ****4321" — testo libero |

### Logica rate

Se l'utente sceglie **Rateale**:
- Il sistema calcola il valore di ogni rata (totale / numero rate)
- Mostra quale rata è la prossima basandosi sulla data di inizio e il numero di rate distribuite nell'anno di copertura
- Es. polizza da R$ 2.400 in 8x → rate da R$ 300, distribuite ogni ~37 giorni dalla data di inizio

---

## Requisiti

| Requisito | Priorità | Note |
|-----------|----------|------|
| Scheda dedicata assicurazione (non solo reminder) | P0 | Sostituisce il semplice item della Dashboard |
| Blocchi contatto flessibili (1 o 2) | P0 | Broker + compagnia o solo compagnia |
| Shortcut telefono, WhatsApp, sito, app | P0 | Azioni rapide — stessa UX dei shortcut Dashboard |
| Data scadenza con reminder | P0 | Già esistente, da mantenere |
| Upload PDF polizza | P1 | Consultabile in-app |
| Info pagamento (totale, modalità, rate, carta) | P1 | |
| Calcolo e visualizzazione rata corrente | P2 | Derivato da totale + numero rate + date |
| Numero polizza | P2 | |
| Suggerimento blocchi contatto per paese | P2 | Brasile → 2 blocchi, USA/Italia → 1 blocco |

---

## Flusso utente

### Primo setup (da Dashboard)

```
1. Utente tappa "Seguro" / "Insurance" sulla Dashboard
2. Se non ha dati → scheda vuota con invito a compilare
3. Compila i campi in ordine:
   a. Contatti (chi è la mia assicurazione / broker?)
   b. Polizza (quando scade? upload PDF)
   c. Pagamento (quanto pago? come?)
4. Ogni sezione è salvabile indipendentemente
5. La data di scadenza alimenta il reminder sulla Dashboard
```

### Consultazione rapida

```
1. Utente ha un problema con l'auto
2. Apre Kopilot → tappa "Seguro"
3. Vede i contatti → tappa WhatsApp della corretora
4. Chat aperta in 2 tap dalla Dashboard
```

### Rinnovo

```
1. Reminder 30 giorni prima della scadenza
2. Utente rinnova la polizza
3. Aggiorna date, importo, upload nuovo PDF
4. Il vecchio PDF va nello storico (History)
```

---

## Note di design

- La scheda deve sembrare una "carta d'identità" della polizza — tutto su una pagina, scrollabile
- I blocchi contatto devono essere visivamente prominenti — il caso d'uso principale è "ho bisogno di chiamare qualcuno, subito"
- Le shortcut (telefono, WhatsApp, sito, app) devono essere icone tappabili, non link testuali
- Il PDF deve essere apribile con un solo tap

---

## Impatto su altri epic

- **Dashboard:** L'item "Seguro" / "Insurance" / "Assicurazione" nella Dashboard ora apre questa scheda invece di un semplice form data.
- **Country Profiles:** I suggerimenti per i blocchi contatto (1 vs 2) e le etichette dipendono dal paese selezionato.
- **History:** Quando l'utente rinnova la polizza, il vecchio documento e i dati precedenti vengono archiviati nella timeline.
