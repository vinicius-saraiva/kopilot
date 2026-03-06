# Assicurazione — Stories

**Epic:** [epic.md](epic.md)
**Status:** Ready for Implementation

---

## Story 1: Scheda Assicurazione (P0)

### Lovable Prompt

---

L'item "Seguro" / "Insurance" / "Assicurazione" sulla Dashboard oggi apre un semplice form con data di scadenza. Voglio sostituirlo con una **scheda dedicata** che raccoglie tutte le informazioni della polizza in una pagina scrollabile.

### Cosa deve fare la scheda

**Stato** — Mostra se la polizza è attiva, in scadenza, o scaduta. Lo stato è derivato dalla data di scadenza (stessa logica dei reminder già in uso sulla Dashboard).

**Contatti** — Uno o due blocchi contatto. Ogni blocco ha un'etichetta libera (es. "Corretora", "Compagnia", "Agent"), un nome, e azioni rapide: telefono, WhatsApp, sito web, app. Usa gli stessi componenti di contatto e shortcut già implementati sulla Dashboard. L'utente può aggiungere un secondo blocco o rimuoverne uno.

**Polizza** — Data inizio, data scadenza (obbligatorie), numero polizza (opzionale). La data di scadenza alimenta il reminder sulla Dashboard come prima.

**Pagamento** — Valore totale, modalità (pagamento unico o rateale), carta utilizzata (testo libero). Tutti opzionali.

### Behavior

- L'utente arriva dalla Dashboard tappando l'item assicurazione → si apre la scheda.
- Se non ha ancora dati → scheda vuota con invito a compilare.
- Ogni sezione (contatti, polizza, pagamento) è salvabile indipendentemente — l'utente non è obbligato a compilare tutto in una volta.
- Il caso d'uso principale è la **consultazione rapida dei contatti**: l'utente deve poter chiamare o scrivere su WhatsApp al suo broker/compagnia in massimo 2 tap dalla Dashboard.

### Copy (i18n)

Le etichette seguono la lingua dell'app (PT-BR, EN, IT). Le etichette dei blocchi contatto sono testo libero inserito dall'utente — non servono traduzioni.

---

## Story 2: PDF e Rate (P1)

### Lovable Prompt

---

Alla scheda Assicurazione creata nella story precedente, aggiungi due funzionalità.

### Upload documento PDF

Nella sezione Polizza, l'utente può caricare il PDF della polizza. Il documento deve essere consultabile in-app con un solo tap (aprilo nel viewer PDF di sistema o in un viewer in-app). L'utente può sostituire il documento in qualsiasi momento caricandone uno nuovo.

### Logica rate nel pagamento

Se l'utente seleziona modalità "Rateale", appare un campo per il numero di rate. Il sistema calcola automaticamente il valore di ogni rata (totale ÷ numero rate) e mostra quale rata è la prossima, basandosi sulla data di inizio polizza e le rate distribuite nel periodo di copertura.

Nella sezione pagamento, mostra: valore della singola rata e quale rata siamo (es. "Rata 3 di 8 — R$ 300,00").

Se il pagamento è a rate, sullo storico di spese (History), registra solo la rata equivalente al mese, non il totale della polizza.

---

## Story 3: Suggerimenti per paese (P2)

### Lovable Prompt

---

Nella scheda Assicurazione, quando l'utente aggiunge i contatti per la prima volta, suggerisci un numero di blocchi contatto in base al paese selezionato nel profilo:

- **Brasile:** Suggerisci due blocchi con etichette precompilate "Corretora" e "Seguradora". In Brasile l'assicurazione auto funziona con un broker (corretora) che media con la compagnia (seguradora) — l'utente ha bisogno dei contatti di entrambi.
- **USA:** Suggerisci un blocco con etichetta "Insurance Company".
- **Italia:** Suggerisci un blocco con etichetta "Compagnia".

Sono solo suggerimenti — l'utente può sempre modificare le etichette, aggiungere un secondo blocco, o rimuoverne uno.

---

## Story 4: Rinnovo e storico (P1)

### Lovable Prompt

---

Quando la polizza assicurativa scade e l'utente la rinnova (aggiorna le date, l'importo, carica un nuovo PDF), i dati precedenti della polizza devono essere archiviati nello storico (History) — incluso il vecchio documento PDF.

Il reminder di scadenza (30 giorni prima) è già gestito dal sistema di reminder esistente sulla Dashboard — non serve reimplementarlo.

---

## Sequenza di implementazione

1. **Story 1** — Scheda completa con stato, contatti, polizza, pagamento
2. **Story 2** — Upload PDF + calcolo rate
3. **Story 4** — Rinnovo con archiviazione in History
4. **Story 3** — Suggerimenti contatti per paese (può essere fatto in qualsiasi momento)
