export const en = {
  hero: {
    name: "Michał Sagan",
    title: "Software Engineer",
    description:
      "Product Architect specializing in cloud-native integration platforms, GraphQL Federation, and API ecosystems. Transforming complex business requirements into scalable technical solutions.",
    contactBtn: "Write",
    callBtn: "Call",
    linkedInLabel: "LinkedIn",
    imageAlt: "Michał Sagan",
  },
  profile: {
    title: "Profile",
    bio: "Experienced Software Engineer specializing in cloud-native integration platforms and API ecosystems. Strong expertise in Web Apps, Commerce, GraphQL Federation, CIAM, and secure service-to-service communication, with hands-on experience in Node.js, TypeScript, and Azure/AWS. Proven ability to translate complex business requirements into scalable, well-governed technical solutions while collaborating effectively across teams.",
    highlights: [
      {
        title: "GraphQL Federation",
        description: "Architecting federated GraphQL solutions at enterprise scale",
      },
      {
        title: "Cloud Architecture",
        description: "Azure & AWS cloud-native integration platforms",
      },
      {
        title: "API Ecosystems",
        description: "Building scalable, well-governed API solutions",
      },
      {
        title: "CIAM & Security",
        description: "OAuth2, OIDC, PKCE, JWT implementation expertise",
      },
    ],
  },
  experience: {
    title: "Employment History",
    highlightsTitle: "Key Highlights",
    technologiesTitle: "Technologies",
    items: [
      {
        role: "Product Architect",
        company: "Heineken",
        period: "October 2024 - Present",
        description:
          "Defining and governing target architecture for global digital commerce platforms across multiple OpCos. Designing and scaling federated GraphQL architecture, including subgraph ownership models, domain boundaries, and governance standards.",
        technologies: ["GraphQL Federation", "Azure", "Node.js", "TypeScript", "CIAM"],
        highlights: [
          "Leading architectural decision-making (KDDs/ADRs) for GraphQL Federation",
          "Designing CIAM and authentication flows (OAuth2, OIDC, PKCE, JWT)",
          "Platform engineering and developer enablement initiatives",
        ],
      },
      {
        role: "Software Architect & Developer",
        company: "Schneider Electric",
        period: "October 2023 - October 2024",
        description:
          "Modeling architecture of integrations with external applications, solution topology, and security. Developing TypeScript code for AWS Lambda with S3, DynamoDB, AWS EventBridge.",
        technologies: ["AWS", "Node.js", "SvelteKit", "GitHub Actions", "Builder.io"],
        highlights: [
          "Implemented web components (CAAS) architecture",
          "Managed complex Builder.io (SAAS) integrations",
          "Automated deployment pipelines",
        ],
      },
      {
        role: "Full-Stack Developer",
        company: "Hunter Douglas USA",
        period: "January 2022 - September 2023",
        description:
          "Designed and delivered custom migration tool from Magento 1. Integrated SAP pricing engine and Order Management System. Built Progressive Web App with Magento PWA Studio.",
        technologies: ["PHP", "AWS", "React", "PWA", "SAP", "Adobe Commerce"],
        highlights: [
          "Custom migration tool implementation",
          "SAP pricing engine integration",
          "Platform performance optimization",
        ],
      },
      {
        role: "Adobe Commerce Architect & Developer",
        company: "ABB (via Accenture)",
        period: "February 2021 - July 2022",
        description:
          "Hybrid role combining Architect and Principal Software Engineer for Adobe Commerce Cloud B2B platform. Designed integrations across MuleSoft, SAP, Salesforce, and Fastly.",
        technologies: ["MuleSoft", "PHP", "Adobe Commerce Cloud", "Knockout.js"],
        highlights: [
          "Microfrontend architecture implementation",
          "Complex enterprise integrations",
          "Global platform performance optimization",
        ],
      },
      {
        role: "Software Architect",
        company: "JTI Geneva",
        period: "May 2019 - November 2020",
        description:
          "Led design of development environment and software architecture for large-scale B2C eCommerce platform at Japanese Tobacco International HQ.",
        technologies: ["AEM", "React.js", "Adobe Commerce", "Agile"],
        highlights: [
          "Designed headless commerce architecture",
          "Collaborated with Adobe and BuzzBrothers engineering teams",
          "Delivered platform enablement and training",
        ],
      },
    ],
  },
  projects: {
    title: "Key Projects",
    impactTitle: "Impact",
    items: [
      {
        title: "Global Commerce GraphQL Federation",
        company: "Heineken",
        period: "2024 - Present",
        description:
          "Architected and implemented federated GraphQL solution serving multiple OpCos globally. Designed subgraph ownership models, domain boundaries, and governance standards.",
        technologies: ["GraphQL Federation", "Apollo", "Node.js", "TypeScript", "Azure"],
        impact: [
          "Enabled unified API layer across 15+ markets",
          "Reduced integration complexity by 60%",
          "Improved API response times by 40%",
        ],
      },
      {
        title: "Enterprise CIAM Platform",
        company: "Heineken",
        period: "2024 - Present",
        description:
          "Designed authentication and authorization architecture implementing OAuth2, OIDC, PKCE, and JWT for global commerce platforms.",
        technologies: ["OAuth2", "OIDC", "Azure AD", "CIAM", "Security"],
        impact: [
          "Secured 50M+ user accounts",
          "Implemented zero-trust architecture",
          "Achieved SOC2 compliance",
        ],
      },
      {
        title: "Web Components as a Service (CAAS)",
        company: "Schneider Electric",
        period: "2023 - 2024",
        description:
          "Built scalable web components architecture using Builder.io integration, enabling marketing teams to build pages without developer intervention.",
        technologies: ["Web Components", "Builder.io", "SvelteKit", "AWS Lambda", "DynamoDB"],
        impact: [
          "Reduced page deployment time from days to hours",
          "Empowered 30+ marketing users",
          "Generated 200+ custom landing pages",
        ],
      },
      {
        title: "PWA E-commerce Platform",
        company: "Hunter Douglas USA",
        period: "2022 - 2023",
        description:
          "Delivered Progressive Web App using Magento PWA Studio with SAP integration for pricing and order management.",
        technologies: ["PWA", "React", "Magento", "SAP", "Adobe Commerce"],
        impact: [
          "Improved mobile conversion by 35%",
          "Reduced page load time to under 2s",
          "Integrated real-time SAP pricing engine",
        ],
      },
      {
        title: "B2B Commerce Cloud Platform",
        company: "ABB",
        period: "2021 - 2022",
        description:
          "Architected enterprise B2B platform with microfrontend architecture and complex integrations across MuleSoft, SAP, Salesforce, and Fastly CDN.",
        technologies: ["Adobe Commerce Cloud", "MuleSoft", "Microfrontends", "PHP", "SAP"],
        impact: [
          "Processed $2B+ in annual transactions",
          "Served 50+ global markets",
          "Achieved 99.9% uptime SLA",
        ],
      },
      {
        title: "Custom Magento Migration Tool",
        company: "Hunter Douglas USA",
        period: "2022",
        description:
          "Designed and built automated migration tool from Magento 1 to Magento 2, handling complex data transformations and business logic migration.",
        technologies: ["PHP", "MySQL", "AWS", "Data Migration", "ETL"],
        impact: [
          "Migrated 500K+ products successfully",
          "Reduced migration timeline by 70%",
          "Zero data loss during migration",
        ],
      },
    ],
  },
  skills: {
    title: "Skills & Expertise",
    categories: [
      {
        category: "Core Technologies",
        skills: [
          { name: "TypeScript & Node.js", level: 95 },
          { name: "GraphQL", level: 90 },
          { name: "React.js", level: 85 },
          { name: "SQL", level: 85 },
        ],
      },
      {
        category: "Cloud & Infrastructure",
        skills: [
          { name: "Azure", level: 88 },
          { name: "AWS", level: 85 },
          { name: "Docker & Kubernetes", level: 80 },
          { name: "Git", level: 90 },
        ],
      },
      {
        category: "Architecture & Security",
        skills: [
          { name: "Technical Design", level: 92 },
          { name: "CIAM & IAM", level: 88 },
          { name: "Adobe Commerce", level: 90 },
          { name: "API Governance", level: 87 },
        ],
      },
      {
        category: "Additional",
        skills: [
          { name: "C#", level: 75 },
          { name: "Python & PyTorch", level: 70 },
        ],
      },
    ],
    languagesTitle: "Languages",
    languages: [
      { name: "English", level: 95 },
      { name: "Polish", level: 100 },
    ],
    hobbiesTitle: "Hobbies & Interests",
    hobbies: ["Home Automation", "3D Printing", "Skiing", "Biking", "Sailing", "Squash"],
    bio: "Technology enthusiast with passion for automation and outdoor activities. Balancing innovation with adventure.",
  },
  toolbox: {
    kicker: "Toolbox",
    title: "Developer Toolbox",
    description:
      "Small, local-first utilities for everyday security and integration work. Tokens stay in your browser.",
    in: "in",
    ago: "ago",
    missing: "missing",
    emptyList: "No values found in this token.",
    invalidToken: "This does not look like a readable JWT payload.",
    openMenu: "Open developer toolbox",
    close: "Close",
    openFullScreen: "Open full screen",
    backToSite: "Back to sagan.dev",
    jwt: {
      title: "JWT decoder",
      subtitle: "Decode header and payload without sending the token anywhere.",
      inputLabel: "JWT token",
      placeholder: "Paste access_token or id_token here...",
      expiresIn: "Expires in",
      tokenAge: "Token age",
      notBefore: "Not before",
      roles: "Roles",
      groups: "Groups",
      scopes: "Scopes",
      claims: "Readable claims",
    },
    unix: {
      title: "Linux time",
      subtitle: "Convert Unix timestamps and watch the distance update live.",
      inputLabel: "Unix timestamp",
      placeholder: "e.g. 1767225600 or 1767225600000",
      delta: "Time distance",
      date: "Date and time",
      normalized: "Normalized seconds",
    },
    tls: {
      title: "TLS certificate",
      subtitle: "Inspect HTTPS certificate details for a public host.",
      inputLabel: "Domain or HTTPS URL",
      placeholder: "e.g. sagan.dev or https://api.example.com",
      check: "Check certificate",
      checking: "Checking...",
      status: "Certificate status",
      valid: "Trusted by default store",
      invalid: "Not trusted by default store",
      validFrom: "Valid from",
      validTo: "Valid to",
      expiresIn: "Expires in",
      expiredAgo: "Expired",
      subject: "Issued to",
      issuer: "Issued by",
      altNames: "Subject alternative names",
      fingerprints: "Fingerprints",
      connection: "TLS connection",
      chain: "Certificate chain",
      protocol: "Protocol",
      cipher: "Cipher",
      checkedAt: "Checked at",
      error: "Could not read the TLS certificate for this host.",
    },
  },
  awards: {
    title: "Honors & Awards",
    items: [
      {
        title: "Adobe Certified Expert",
        issuer: "Adobe",
        date: "2020",
        description: "Adobe Commerce Cloud Developer certification",
      },
      {
        title: "Solution Architecture Excellence",
        issuer: "Heineken",
        date: "2024",
        description: "Recognition for outstanding GraphQL Federation architecture design",
      },
      {
        title: "Innovation Award",
        issuer: "Schneider Electric",
        date: "2024",
        description: "Custom web components architecture implementation",
      },
      {
        title: "Azure Solutions Architect",
        issuer: "Microsoft",
        date: "2023",
        description: "Certified Azure Solutions Architect Expert",
      },
      {
        title: "Team Excellence Award",
        issuer: "ABB",
        date: "2022",
        description: "Outstanding contribution to enterprise platform delivery",
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
    title: "Recommendations",
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
    title: "Get In Touch",
    description:
      "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Let's build something great together.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    linkedinLabel: "LinkedIn",
    downloadLabel: "Download / Print",
    saveLabel: "Save as PDF",
    copyright: "© 2026 Michał Sagan. All rights reserved.",
    roleAt: "Product Architect at",
    writeToMe: "Write to me",
    loadingContact: "Loading contact details…",
    formTitle: "Send a message",
    formReachMeAt: "Or reach me at",
    formName: "Name",
    formNamePlaceholder: "John Smith",
    formEmail: "Email",
    formEmailPlaceholder: "john@example.com",
    formMessage: "Message",
    formMessagePlaceholder: "Hello, I'd like to discuss…",
    formSubmit: "Send message",
    formSending: "Sending…",
    formSuccess: "Message sent successfully.",
    formError: "Failed to send the message. Please try again.",
    scheduleTitle: "Book a short meeting",
    scheduleDescription:
      "Prefer a quick call? Pick a slot directly in my calendar and we can discuss your project, architecture challenge, or collaboration idea.",
    scheduleFallbackLink: "Open calendar booking",
    callNowBtn: "Call now",
    callNowLabel: "Call directly",
    meetShort: "Meet",
    linkedinUrl: "https://linkedin.com/in/michal-sagan",
    linkedinHandle: "in/michal-sagan",
    currentCompany: "Heineken",
    footerImageAlt: "Michał Sagan",
  },
  cookies: {
    bannerText:
      "We use cookies to analyze site traffic via Google Analytics and improve your experience. Read our",
    policyLink: "Cookie Policy",
    accept: "Accept all",
    reject: "Reject non-essential",
  },
};

export type Translations = typeof en;
