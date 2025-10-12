# Kreatorka Zmian - Landing Page

Landing page dla warsztatów "Kreatorka Zmian - AI w Twoich rękach" - program dla kobiet wracających do pracy po przerwie macierzyńskiej.

## Struktura projektu

```
kreatorka-zmian/
├── index.html          # Główny plik HTML
├── styles.css          # Style CSS
├── script.js           # JavaScript
├── images/             # Folder na obrazy (do utworzenia)
└── README.md          # Ten plik
```

## Jak uruchomić projekt

### Opcja 1: Visual Studio Code z Live Server
1. Otwórz folder w Visual Studio Code
2. Zainstaluj rozszerzenie "Live Server"
3. Kliknij prawym przyciskiem na index.html i wybierz "Open with Live Server"

### Opcja 2: Bezpośrednie otwarcie
1. Otwórz plik index.html w przeglądarce internetowej

## Funkcjonalności

### ✅ Zaimplementowane:
- Responsywny design (desktop, tablet, mobile)
- Smooth scrolling między sekcjami
- Animacje przy przewijaniu strony
- Interaktywny formularz kontaktowy
- Efekty hover na kartach
- Sticky navigation bar
- FAQ z expandable items

### 🎨 Design:
- Paleta kolorów: Granatowy (#2D3F50) + Pomarańczowy (#FF6B4A)
- Fonty: Inter (Google Fonts)
- Ikony: Font Awesome
- Gradientowe tła i przyciski
- Nowoczesny, minimalistyczny styl

## Sekcje strony

1. **Navigation Bar** - Sticky navigation z logo
2. **Hero Section** - Główny komunikat i CTA
3. **O warsztatach** - Korzyści i opis programu
4. **Dla kogo** - Target audience
5. **Program** - Timeline z modułami
6. **Inspiracje** - Cytaty motywacyjne
7. **Kontakt** - Formularz + dane kontaktowe
8. **FAQ** - Najczęściej zadawane pytania
9. **Footer** - Logo i social media

## Customizacja

### Zmiana kolorów:
Edytuj zmienne CSS w pliku `styles.css`:
```css
/* Główne kolory */
--primary-color: #2D3F50;
--accent-color: #FF6B4A;
--background: #ffffff;
```

### Dodawanie obrazów:
1. Utwórz folder `images/`
2. Dodaj pliki graficzne
3. Zaktualizuj ścieżki w HTML

### Modyfikacja treści:
Wszystkie teksty znajdują się bezpośrednio w pliku `index.html` i są łatwe do edycji.

## Integracje

### Formularz kontaktowy:
Obecnie formularz ma podstawową walidację JavaScript. Aby działał w pełni, należy:
1. Dodać backend (PHP, Node.js, lub usługa jak Formspree)
2. Zaktualizować action i method w formularzu
3. Dodać reCAPTCHA dla bezpieczeństwa

### Analytics:
Dodaj Google Analytics lub inny tracker:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## Optymalizacja

### Performance:
- Zoptymalizowane obrazy (WebP format)
- Minifikacja CSS/JS
- Lazy loading obrazów
- CDN dla fontów i ikon

### SEO:
- Meta tags w `<head>`
- Structured data (JSON-LD)
- Sitemap.xml
- robots.txt

## Kompatybilność

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)  
- ✅ Safari (latest)
- ✅ Mobile browsers
- ✅ Internet Explorer 11+

## Wsparcie i rozwój

### Następne kroki:
1. [ ] Dodanie obrazów z brand assets
2. [ ] Integracja z systemem CRM
3. [ ] Multilingual support
4. [ ] Blog section
5. [ ] Testimonials carousel
6. [ ] Payment integration

### Bug reports:
W razie problemów, sprawdź:
1. Console errors w przeglądarce
2. Czy wszystkie pliki są prawidłowo połączone
3. Czy fonty i ikony się ładują

## Licencja

Projekt utworzony dla Kreatorka Zmian. Wszystkie prawa zastrzeżone.

---

**Autor:** AI Assistant dla Kreatorka Zmian
**Data:** Październik 2025
**Wersja:** 1.0
