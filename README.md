# PoE_PatchNotes — 3.29.0 Curse of the Allflame (PL / EN)

Dwujęzyczna strona z notatkami do aktualizacji **Path of Exile 3.29.0 — Curse of the Allflame**.
Oryginał angielski i tłumaczenie na język polski wyświetlane obok siebie, wiersz w wiersz, do wygodnego porównywania.

🔗 **Strona na żywo:** https://draqdras.github.io/PoE_PatchNotes/
📄 **Źródło:** https://www.pathofexile.com/forum/view-thread/3985332/page/1

## Funkcje
- **Układ dwukolumnowy** — PL i EN obok siebie; każdy przetłumaczony akapit odpowiada oryginałowi w tym samym wierszu.
- **Ukrywanie kolumny** (EN lub PL) — skupienie na jednym języku.
- **Klik w kolumnę = wyróżnienie** — aktywna kolumna jest jaśniejsza, druga wyszarzona (łatwiejsze czytanie).
- **Zamiana kolumn miejscami** — dowolna strona po lewej/prawej.
- **Kopiowanie treści komórki** jednym kliknięciem (przycisk ⧉ w każdej komórce).
- **Spis treści** u góry + **stałe menu kotwic** po prawej stronie ekranu (z podświetlaniem aktywnej sekcji).
- Ciemny motyw w klimacie dodatku, responsywność (na telefonie kolumny jedna pod drugą).

## Zasady tłumaczenia
Gra jest dostępna wyłącznie po angielsku, dlatego **nazwy własne pozostają w oryginale** — przedmioty,
gemy, mechaniki, waluty, lokacje (np. *Curse of the Allflame*, *Pact of Beidat*, *Chaos Orbs*).
Tam, gdzie to pomocne, w nawiasie podane jest tłumaczenie pomocnicze, np. *Warrant (nakaz)*.

## Struktura projektu
| Plik | Zawartość |
|------|-----------|
| `index.html` | Szkielet strony |
| `styles.css` | Motyw i układ |
| `app.js` | Renderowanie i interakcje |
| `data.js` | Treść (hardcoded): sekcje + linie z polami `en` / `pl` |
| `assets/bg.jpg` | (opcjonalnie) grafika tła — jeśli obecna, nadpisuje tło CSS |
| `PLAN.md` | Plan implementacyjny z listą zadań |

## Uruchomienie lokalne
To statyczna strona — wystarczy dowolny serwer HTTP, np.:
```bash
python -m http.server 4321
# następnie otwórz http://localhost:4321
```

## Tło graficzne
Domyślnie tło generowane jest w CSS (ciemna morska poświata). Aby użyć własnej grafiki,
umieść plik `assets/bg.jpg` — zostanie automatycznie użyty jako tło strony.

---
*Nieoficjalne, fanowskie tłumaczenie dla społeczności. Treść notatek i nazwy © Grinding Gear Games.
Path of Exile jest znakiem towarowym Grinding Gear Games.*
