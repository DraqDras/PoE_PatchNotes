# PoE_PatchNotes — Plan implementacyjny

Dwujęzyczna (EN/PL) strona z patch notes **Path of Exile 3.29.0 — Curse of the Allflame**.
Źródło: https://www.pathofexile.com/forum/view-thread/3985332/page/1

> Legenda: `[ ]` do zrobienia · `[~]` w trakcie · `[x]` gotowe

---

## 1. Setup projektu
- [x] Utworzyć folder `PoE_PatchNotes/` + `assets/`
- [x] Pobrać i ustrukturyzować treść artykułu (26 sekcji, 663 linie, ~103 tys. znaków)
- [x] Napisać `PLAN.md`
- [x] `README.md` z opisem projektu i linkiem do strony
- [x] `.gitignore`

## 2. Szkielet strony (HTML / CSS / JS)
- [x] `index.html` — struktura strony (nagłówek, spis treści, kontrolki, tabele sekcji)
- [x] `styles.css` — ciemny motyw, tło (grafika + overlay), prawie niewidoczne granice tabeli
- [x] `app.js` — renderowanie danych, interakcje
- [x] `data.js` — treść (hardcoded): sekcje + linie z polami `en` i `pl`

## 3. Wymagane funkcje  (zaimplementowane i zweryfikowane w przeglądarce)
- [x] Układ dwukolumnowy: **PL po lewej / EN po prawej**, wiersz-w-wiersz (porównywalne akapity)
- [x] Spis treści (kotwice do sekcji) na górze strony
- [x] Stałe menu z kotwicami zawsze dostępne po **prawej stronie ekranu** (+ scrollspy)
- [x] Każda sekcja podzielona na osobne linie (wiersze)
- [x] Ukrywanie kolumny EN lub PL (skupienie na jednym akapicie)
- [x] Klik w kolumnę → aktywna kolumna jaśniejsza, nieaktywna szara (focus czytania)
- [x] Przycisk kopiowania zawartości w **każdej komórce**
- [x] Zachowanie oryginalnych nazw PoE (przedmioty/gemy/mechaniki) w PL, tłumaczenie w nawiasie
- [x] Ciemne body, jasny tekst, prawie niewidoczne (ciemnoszare) granice tabeli
- [x] (bonus) Zamiana kolumn miejscami — rozstrzyga niejednoznaczność „lewa/prawa"
- [x] Responsywność (mobile: menu chowane, kolumny jedna pod drugą)

## 4. Tło graficzne
- [x] CSS-owe atmosferyczne tło (ciemna morska poświata Allflame) jako fallback
- [x] Slot na `assets/bg.jpg` — jeśli plik istnieje, nadpisuje tło (użytkownik wrzuca załączoną grafikę)

## 5. Tłumaczenie sekcji (EN kompletne od razu, PL uzupełniane)
- [x] 01. The Curse of the Allflame Challenge League (10)
- [x] 02. New Content and Features (25)
- [x] 03. Mercenaries of Trarthus as a Core League (18)
- [x] 04. Abyss Revamp (34)
- [x] 05. Legion Revamp (52)
- [x] 06. Gem Socket Changes (31)
- [x] 07. Talisman Revamp (19)
- [x] 08. League Changes (8)
- [x] 09. Betrayal (6)
- [x] 10. Breach (12)
- [x] 11. Endgame Changes (21)
- [x] 12. Atlas Passive Tree Changes (4)
- [x] 13. Player Changes (9)
- [x] 14. Ascendancy Changes (11)
- [x] 15. Passive Skill Tree Changes (5)
- [x] 16. Skill Gem Changes (140)
- [x] 17. Vaal Gem Changes (8)
- [x] 18. Support Gem Changes (13)
- [x] 19. Unique Item Changes (49)
- [x] 20. Item Changes (97)
- [x] 21. Divination Card Changes (5)
- [x] 22. Ruthless-specific Changes (4)
- [x] 23. Monster Changes (3)
- [x] 24. Quest Reward Changes (3)
- [x] 25. User Interface and Quality of Life Changes (11)
- [x] 26. Bug Fixes (42)

**✅ Wszystkie 26 sekcji przetłumaczone (640 linii, EN + PL kompletne).**

## 6. Publikacja
- [x] `git init`, pierwszy commit
- [x] Utworzyć publiczne repo na GitHub (`DraqDras/PoE_PatchNotes`)
- [x] `git push`
- [x] Włączyć GitHub Pages (branch `main`, `/root`) — darmowa strona do odczytu
- [x] Zweryfikować działanie opublikowanej strony → https://draqdras.github.io/PoE_PatchNotes/

## 7. Dokumentacja
- [x] Zaktualizować wiki projektu (`workspaceDocs/PoE_PatchNotes/`)

## 8. Dodatkowe funkcje (etap 2)
- [x] Domyślny focus na kolumnie polskiej
- [x] Kolor aktywnego (wyróżnionego) tekstu = `#ffd7a5`
- [x] Ikona oka (eye / eye-slash) na przyciskach Polski / English (toggle widoczności)
- [x] Spis treści w formie tabeli PL/EN; klik w dowolny wiersz przenosi do sekcji
- [x] Boczne menu „Sekcje" — zwijanie/rozwijanie (ikona arrow-left-right)
- [x] Oznaczanie ważnych komórek checkboxem (jasna ramka) + zapis w cookies + notka o cookies
