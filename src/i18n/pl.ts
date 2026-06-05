import type { Translations } from "./en";

export const pl: Translations = {
  hero: {
    name: "Michał Sagan",
    title: "Inżynier Oprogramowania",
    description:
      "Architekt Produktu specjalizujący się w cloud-native platformach integracyjnych, GraphQL Federation i ekosystemach API. Przekształcam złożone wymagania biznesowe w skalowalne rozwiązania techniczne.",
    contactBtn: "Napisz",
    callBtn: "Zadzwoń",
    linkedInLabel: "LinkedIn",
    imageAlt: "Michał Sagan",
  },
  profile: {
    title: "Profil",
    bio: "Doświadczony Inżynier Oprogramowania specjalizujący się w cloud-native platformach integracyjnych i ekosystemach API. Głęboka wiedza w zakresie Web Apps, Commerce, GraphQL Federation, CIAM i bezpiecznej komunikacji między serwisami. Praktyczne doświadczenie z Node.js, TypeScript, Azure i AWS. Udokumentowana zdolność przekładania złożonych wymagań biznesowych na skalowalne, dobrze zarządzane rozwiązania techniczne przy efektywnej współpracy z zespołami.",
    highlights: [
      {
        title: "GraphQL Federation",
        description: "Projektowanie sfederowanych rozwiązań GraphQL w skali enterprise",
      },
      {
        title: "Architektura Chmurowa",
        description: "Cloud-native platformy integracyjne na Azure i AWS",
      },
      {
        title: "Ekosystemy API",
        description: "Budowanie skalowalnych, dobrze zarządzanych rozwiązań API",
      },
      {
        title: "CIAM i Bezpieczeństwo",
        description: "Ekspertyza w OAuth2, OIDC, PKCE, JWT",
      },
    ],
  },
  experience: {
    title: "Historia Zatrudnienia",
    highlightsTitle: "Najważniejsze punkty",
    technologiesTitle: "Technologie",
    items: [
      {
        role: "Product Architect",
        company: "Heineken",
        period: "Październik 2024 - Obecnie",
        description:
          "Definiowanie i zarządzanie architekturą docelową globalnych platform e-commerce dla wielu OpCo. Projektowanie i skalowanie sfederowanej architektury GraphQL, w tym modeli własności subgrafów, granic domenowych i standardów zarządzania.",
        technologies: ["GraphQL Federation", "Azure", "Node.js", "TypeScript", "CIAM"],
        highlights: [
          "Prowadzenie decyzji architektonicznych (KDD/ADR) dla GraphQL Federation",
          "Projektowanie przepływów CIAM i uwierzytelniania (OAuth2, OIDC, PKCE, JWT)",
          "Inicjatywy platform engineering i wsparcia deweloperów",
        ],
      },
      {
        role: "Software Architect & Developer",
        company: "Schneider Electric",
        period: "Październik 2023 - Październik 2024",
        description:
          "Modelowanie architektury integracji z zewnętrznymi aplikacjami, topologii rozwiązań i bezpieczeństwa. Tworzenie kodu TypeScript dla AWS Lambda z S3, DynamoDB, AWS EventBridge.",
        technologies: ["AWS", "Node.js", "SvelteKit", "GitHub Actions", "Builder.io"],
        highlights: [
          "Wdrożenie architektury web components (CAAS)",
          "Zarządzanie złożonymi integracjami Builder.io (SAAS)",
          "Automatyzacja pipeline'ów wdrożeniowych",
        ],
      },
      {
        role: "Full-Stack Developer",
        company: "Hunter Douglas USA",
        period: "Styczeń 2022 - Wrzesień 2023",
        description:
          "Zaprojektowanie i dostarczenie niestandardowego narzędzia migracji z Magento 1. Integracja silnika cenowego SAP i systemu zarządzania zamówieniami. Budowa Progressive Web App z Magento PWA Studio.",
        technologies: ["PHP", "AWS", "React", "PWA", "SAP", "Adobe Commerce"],
        highlights: [
          "Implementacja narzędzia do migracji danych",
          "Integracja silnika cenowego SAP",
          "Optymalizacja wydajności platformy",
        ],
      },
      {
        role: "Adobe Commerce Architect & Developer",
        company: "ABB (via Accenture)",
        period: "Luty 2021 - Lipiec 2022",
        description:
          "Rola łącząca Architekta i Principal Software Engineer dla platformy Adobe Commerce Cloud B2B. Projektowanie integracji z MuleSoft, SAP, Salesforce i Fastly.",
        technologies: ["MuleSoft", "PHP", "Adobe Commerce Cloud", "Knockout.js"],
        highlights: [
          "Implementacja architektury mikrofrontendowej",
          "Złożone integracje enterprise",
          "Optymalizacja wydajności globalnej platformy",
        ],
      },
      {
        role: "Software Architect",
        company: "JTI Geneva",
        period: "Maj 2019 - Listopad 2020",
        description:
          "Kierowanie projektowaniem środowiska deweloperskiego i architektury oprogramowania dla wielkoskalowej platformy e-commerce B2C w centrali Japanese Tobacco International.",
        technologies: ["AEM", "React.js", "Adobe Commerce", "Agile"],
        highlights: [
          "Zaprojektowanie architektury headless commerce",
          "Współpraca z zespołami inżynierskimi Adobe i BuzzBrothers",
          "Wdrożenie szkoleń i wsparcia dla platformy",
        ],
      },
    ],
  },
  projects: {
    title: "Kluczowe Projekty",
    impactTitle: "Wpływ",
    items: [
      {
        title: "Globalna GraphQL Federation dla Commerce",
        company: "Heineken",
        period: "2024 - Obecnie",
        description:
          "Zaprojektowanie i wdrożenie sfederowanego rozwiązania GraphQL obsługującego wiele OpCo na całym świecie. Opracowanie modeli własności subgrafów, granic domenowych i standardów zarządzania.",
        technologies: ["GraphQL Federation", "Apollo", "Node.js", "TypeScript", "Azure"],
        impact: [
          "Ujednolicona warstwa API dla 15+ rynków",
          "Redukcja złożoności integracji o 60%",
          "Poprawa czasów odpowiedzi API o 40%",
        ],
      },
      {
        title: "Enterprise CIAM Platform",
        company: "Heineken",
        period: "2024 - Obecnie",
        description:
          "Zaprojektowanie architektury uwierzytelniania i autoryzacji z OAuth2, OIDC, PKCE i JWT dla globalnych platform e-commerce.",
        technologies: ["OAuth2", "OIDC", "Azure AD", "CIAM", "Security"],
        impact: [
          "Zabezpieczenie 50M+ kont użytkowników",
          "Wdrożenie architektury zero-trust",
          "Uzyskanie zgodności SOC2",
        ],
      },
      {
        title: "Web Components as a Service (CAAS)",
        company: "Schneider Electric",
        period: "2023 - 2024",
        description:
          "Budowa skalowalnej architektury web components z integracją Builder.io, umożliwiającej zespołom marketingowym tworzenie stron bez udziału deweloperów.",
        technologies: ["Web Components", "Builder.io", "SvelteKit", "AWS Lambda", "DynamoDB"],
        impact: [
          "Skrócenie czasu wdrożenia stron z dni do godzin",
          "Wsparcie dla 30+ użytkowników marketingu",
          "Wygenerowanie 200+ niestandardowych landing page'y",
        ],
      },
      {
        title: "Platforma E-commerce PWA",
        company: "Hunter Douglas USA",
        period: "2022 - 2023",
        description:
          "Dostarczenie Progressive Web App z użyciem Magento PWA Studio z integracją SAP do zarządzania cenami i zamówieniami.",
        technologies: ["PWA", "React", "Magento", "SAP", "Adobe Commerce"],
        impact: [
          "Poprawa konwersji mobilnej o 35%",
          "Redukcja czasu ładowania strony poniżej 2s",
          "Integracja silnika cenowego SAP w czasie rzeczywistym",
        ],
      },
      {
        title: "Platforma B2B Commerce Cloud",
        company: "ABB",
        period: "2021 - 2022",
        description:
          "Zaprojektowanie platformy enterprise B2B z architekturą mikrofrontendową i złożonymi integracjami MuleSoft, SAP, Salesforce i Fastly CDN.",
        technologies: ["Adobe Commerce Cloud", "MuleSoft", "Microfrontends", "PHP", "SAP"],
        impact: [
          "Obsługa transakcji o wartości $2B+ rocznie",
          "Zasięg 50+ globalnych rynków",
          "SLA na poziomie 99.9% dostępności",
        ],
      },
      {
        title: "Narzędzie Migracji Magento",
        company: "Hunter Douglas USA",
        period: "2022",
        description:
          "Zaprojektowanie i budowa zautomatyzowanego narzędzia migracji z Magento 1 do Magento 2, obsługującego złożone transformacje danych i migrację logiki biznesowej.",
        technologies: ["PHP", "MySQL", "AWS", "Data Migration", "ETL"],
        impact: [
          "Migracja 500K+ produktów bez strat",
          "Skrócenie harmonogramu migracji o 70%",
          "Zero utraty danych podczas migracji",
        ],
      },
    ],
  },
  skills: {
    title: "Umiejętności i Kompetencje",
    categories: [
      {
        category: "Podstawowe Technologie",
        skills: [
          { name: "TypeScript & Node.js", level: 95 },
          { name: "GraphQL", level: 90 },
          { name: "React.js", level: 85 },
          { name: "SQL", level: 85 },
        ],
      },
      {
        category: "Chmura i Infrastruktura",
        skills: [
          { name: "Azure", level: 88 },
          { name: "AWS", level: 85 },
          { name: "Docker & Kubernetes", level: 80 },
          { name: "Git", level: 90 },
        ],
      },
      {
        category: "Architektura i Bezpieczeństwo",
        skills: [
          { name: "Projektowanie Techniczne", level: 92 },
          { name: "CIAM & IAM", level: 88 },
          { name: "Adobe Commerce", level: 90 },
          { name: "Zarządzanie API", level: 87 },
        ],
      },
      {
        category: "Dodatkowe",
        skills: [
          { name: "C#", level: 75 },
          { name: "Python & PyTorch", level: 70 },
        ],
      },
    ],
    languagesTitle: "Języki",
    languages: [
      { name: "Angielski", level: 95 },
      { name: "Polski", level: 100 },
    ],
    hobbiesTitle: "Hobby i Zainteresowania",
    hobbies: ["Automatyka Domowa", "Druk 3D", "Narciarstwo", "Kolarstwo", "Żeglarstwo", "Squash"],
    bio: "Entuzjasta technologii z pasją do automatyzacji i aktywności na świeżym powietrzu. Balansowanie między innowacją a przygodą.",
  },
  awards: {
    title: "Wyróżnienia i Nagrody",
    items: [
      {
        title: "Adobe Certified Expert",
        issuer: "Adobe",
        date: "2020",
        description: "Certyfikat Adobe Commerce Cloud Developer",
      },
      {
        title: "Solution Architecture Excellence",
        issuer: "Heineken",
        date: "2024",
        description: "Wyróżnienie za wybitny projekt architektury GraphQL Federation",
      },
      {
        title: "Innovation Award",
        issuer: "Schneider Electric",
        date: "2024",
        description: "Implementacja architektury niestandardowych web components",
      },
      {
        title: "Azure Solutions Architect",
        issuer: "Microsoft",
        date: "2023",
        description: "Certyfikowany Azure Solutions Architect Expert",
      },
      {
        title: "Team Excellence Award",
        issuer: "ABB",
        date: "2022",
        description: "Wybitny wkład w dostarczenie platformy enterprise",
      },
      {
        title: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2022",
        description: "AWS Certified Developer - Associate",
      },
    ],
  },
  recommendations: {
    title: "Rekomendacje",
    items: [
      {
        name: "Mikel Bitson",
        role: "Senior Software Development Manager",
        company: "Hunter Douglas",
        image:
          "https://media.licdn.com/dms/image/v2/D5603AQGJSz2bvR1KiA/profile-displayphoto-scale_400_400/B56ZgqP_foHkAg-/0/1753055494219?e=1778716800&v=beta&t=NB23wuei_x7hA9JXCwPx8yYzBskf-_Edsb5aUe9rAek",
        text: "Michal worked with me on an Adobe Commerce headless project and he was a critical resource for the team as we worked to expand the built-in API functionality for our needs. Michal's work is always extremely detailed and done the best possible way. He's continually keeping up with the Adobe Commerce releases and gaining knowledge that ensures his code is current. He worked extremely well with the team, both in code reviews and in meetings. He was able to share a great deal of knowledge during his time with us. If you need a backend developer for any PHP project, especially Adobe Commerce, Michal is a great choice!",
        date: "August 2023",
      },
      {
        name: "Dex Caffery",
        role: "Applications Engineer",
        company: "Hunter Douglas",
        image:
          "https://media.licdn.com/dms/image/v2/C4E03AQFofY4rtS7c0A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516834201631?e=1778716800&v=beta&t=kJ3LZLtBbNZjbvBFYBi2vd1HjP2A05ravXOfHqtCYh8",
        text: "I worked with Michal while at Levolor on an Adobe Commerce/PWA Studio project. From day 1 Michal was extremely valuable, being able and willing to solve our more complex needs for the project. Michal understands Adobe Commerce very well, and knows how to implement the highest standards of php code. Michal worked very well in our team, teaching and handling code reviews routinely. There are few people I have worked with that approach the same level of quality as Michals work. I learned a lot from Michal, and would choose him to be a team member on any software project I am on.",
        date: "October 2023",
      },
    ],
  },
  contact: {
    title: "Skontaktuj się",
    description:
      "Zawsze jestem otwarty na rozmowy o nowych projektach, kreatywnych pomysłach lub możliwościach współpracy. Zbudujmy razem coś wyjątkowego.",
    emailLabel: "E-mail",
    phoneLabel: "Telefon",
    linkedinLabel: "LinkedIn",
    downloadLabel: "Pobierz / Drukuj",
    saveLabel: "Zapisz jako PDF",
    copyright: "© 2026 Michał Sagan. Wszelkie prawa zastrzeżone.",
    roleAt: "Architekt Produktu w",
    writeToMe: "Napisz do mnie",
    loadingContact: "Ładowanie danych kontaktowych…",
    formTitle: "Wyślij wiadomość",
    formReachMeAt: "Albo napisz na",
    formName: "Imię i nazwisko",
    formNamePlaceholder: "Jan Kowalski",
    formEmail: "E-mail",
    formEmailPlaceholder: "jan@firma.pl",
    formMessage: "Wiadomość",
    formMessagePlaceholder: "Cześć, chciałem zapytać o…",
    formSubmit: "Wyślij wiadomość",
    formSending: "Wysyłanie…",
    formSuccess: "Wiadomość wysłana pomyślnie.",
    formError: "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
    scheduleTitle: "Umów krótkie spotkanie",
    scheduleDescription:
      "Wolisz krótką rozmowę? Wybierz termin bezpośrednio w moim kalendarzu i omówmy Twój projekt, wyzwanie architektoniczne lub pomysł na współpracę.",
    scheduleFallbackLink: "Otwórz kalendarz w nowej karcie",
    callNowBtn: "Zadzwoń teraz",
    callNowLabel: "Zadzwoń bezpośrednio",
    meetShort: "Spotkanie",
    linkedinUrl: "https://linkedin.com/in/michal-sagan",
    linkedinHandle: "in/michal-sagan",
    currentCompany: "Heineken",
    footerImageAlt: "Michał Sagan",
  },
  cookies: {
    bannerText:
      "Używamy plików cookie do analizy ruchu przez Google Analytics i poprawy Twojego doświadczenia. Przeczytaj naszą",
    policyLink: "Politykę Cookies",
    accept: "Zaakceptuj wszystkie",
    reject: "Odrzuć nieobowiązkowe",
  },
};
