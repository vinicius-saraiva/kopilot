# Car Sensor — Hardware Integration

**Feature:** OBD-II / hardware integration for real-time vehicle data
**Status:** Planned — not yet specified
**Target version:** v3.0+

---

## Summary

Physical OBD-II device or native car integration that feeds real data into Kopilot: automatic mileage sync, engine code translation, health metrics, and proactive alerts.

---

## Key Capabilities (high-level)

- Real-time mileage sync → automatic interval tracking
- Engine codes: translate OBD-II codes to plain language
- Health metrics: battery voltage, coolant temp, fuel efficiency
- Proactive alerts before dashboard lights appear

---

## Implementation Paths

| Path | Pros | Cons |
|------|------|------|
| Partner with existing OBD-II device | Fast to market, no hardware | Revenue share, dependency |
| Build Kopilot OBD-II dongle | Full control, hardware revenue | Expensive, complex |
| Native car app integration | Seamless for modern cars | Limited to specific makes |
| Tesla/EV API integration | Rich data, no hardware needed | Limited to specific brands |

---

## Status

This feature needs full planning and specification. A dedicated PRD will be created when prioritized. Evaluate market fit before committing to hardware investment.

---

## Open Questions

- Build vs. partner vs. integrate decision
- Bluetooth Low Energy vs. WiFi communication
- Car compatibility database scope
- Pricing model (hardware + subscription?)
- Privacy implications of real-time vehicle data
