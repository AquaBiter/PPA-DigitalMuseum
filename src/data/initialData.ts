import { Category, Artifact, QuizQuestion, Slide, AboutContent } from '../types';

export const INITIAL_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    titleHighlight: 'TITLE',
    titleSuffix: 'artifacts',
    subtitle: 'Explore Philippine popular culture and everyday life from 2000 to 2010',
    color: '#EAB308', // Yellow
  },
  {
    id: 'slide-2',
    titleHighlight: 'TITLE',
    titleSuffix: 'artifacts',
    subtitle: 'Relive the golden era of 2000s gadgets, music, and cultural milestones',
    color: '#06B6D4', // Teal / Cyan
  },
  {
    id: 'slide-3',
    titleHighlight: 'TITLE',
    titleSuffix: 'artifacts',
    subtitle: 'Discover how technology and media reshaped Filipino connections',
    color: '#EF4444', // Red
  },
  {
    id: 'slide-4',
    titleHighlight: 'TITLE',
    titleSuffix: 'artifacts',
    subtitle: 'Step into the virtual archive preserving decade-defining memories',
    color: '#F59E0B', // Gold
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'political',
    name: 'POLITICAL',
    summary: 'Discover the political events, leaders, movements, and information that shaped the 2000s.',
    fullDescription: 'This archive explores the dynamic political landscape of the Philippines from 2000 to 2010. It chronicles key leadership transitions such as EDSA Dos (2001), state policies, national elections, civil resistance movements, and the emerging role of mobile texting and early cyberactivism in political mobilization.',
    accentColor: '#EF4444',
    referenceLinks: [
      {
        id: 'ref-pol-1',
        title: 'Revolutionary Text: Social Psychology of Cellphone Texting during People Power II',
        url: 'https://www.ejournals.ph/article.php?id=4015',
      },
      {
        id: 'ref-pol-2',
        title: 'The Cell Phone and the Crowd: Messianic Politics in the Contemporary Philippines',
        url: 'https://escholarship.org/uc/item/5t1376v0',
      },
    ],
  },
  {
    id: 'economic',
    name: 'ECONOMIC',
    summary: 'Discover how Filipinos worked, spent, paid, and shopped during the 2000s.',
    fullDescription: 'This archive explores economic life and consumer culture in the Philippines from 2000 to 2010. From the mushrooming of modern shopping mega-malls, the rise of the Business Process Outsourcing (BPO) call center industry, to everyday street vending, prepaid phone cards, and changing remittance lifelines of Overseas Filipino Workers (OFWs).',
    accentColor: '#10B981',
    referenceLinks: [
      {
        id: 'ref-econ-1',
        title: '2000 Survey of Overseas Filipinos',
        url: 'https://psa.gov.ph/content/2000-survey-overseas-filipinos-sof',
      },
      {
        id: 'ref-econ-2',
        title: 'Filipino Entrepreneurs on the Internet: When Social Networking Websites Meet Mobile Commerce',
        url: 'https://journals.sagepub.com/doi/10.1177/097172180801300203',
      },
    ],
  },
  {
    id: 'social',
    name: 'SOCIAL',
    summary: 'Explore how Filipinos communicated, connected, and spent time together during the 2000s.',
    fullDescription: 'This archive explores the everyday social life of Filipinos from 2000 to 2010, including communication, friendships, family connections, gadgets, social spaces, and early online communities. It shows how technologies such as mobile phones, texting, and the Internet changed how people interacted with each other.',
    accentColor: '#06B6D4',
    referenceLinks: [
      {
        id: 'ref-soc-1',
        title: 'Revolutionary Text: Social Psychology of Cellphone Texting during People Power II',
        url: 'https://www.ejournals.ph/article.php?id=4015',
      },
      {
        id: 'ref-soc-2',
        title: 'Entertainment publics in the Philippines',
        url: 'https://journals.sagepub.com/doi/10.1177/1329878X20985960',
      },
    ],
  },
  {
    id: 'cultural',
    name: 'CULTURAL',
    summary: 'Explore the music, television, fashion, food, technology, and trends that shaped Philippine popular culture.',
    fullDescription: 'This archive celebrates the golden era of 2000s Pinoy pop culture: the golden boom of Original Pilipino Music (OPM) alternative rock bands, iconic primetime fantaseryes and reality television, cyber cafes (kompyuteran), dance crazes, and early Filipino internet subcultures.',
    accentColor: '#F59E0B',
    referenceLinks: [
      {
        id: 'ref-cult-1',
        title: 'Modes of Resistance in a Globalizing Popular Culture Industry',
        url: 'https://scispace.com/pdf/modes-of-resistance-in-a-globalizing-popular-culture-46q0pc3j5v.pdf',
      },
      {
        id: 'ref-cult-2',
        title: 'Entertainment publics in the Philippines',
        url: 'https://journals.sagepub.com/doi/10.1177/1329878X20985960',
      },
    ],
  },
  {
    id: 'environmental',
    name: 'ENVIRONMENTAL',
    summary: 'Discover environmental issues, practices, and experiences that were part of Filipino life.',
    fullDescription: 'This archive examines environmental conditions, natural disasters, ecological shifts, and communal resilience in the Philippines during the 2000s, including historical weather occurrences like Typhoon Ondoy (2009), early solid waste management campaigns, and grassroots community adaptations.',
    accentColor: '#84CC16',
    referenceLinks: [
      {
        id: 'ref-env-1',
        title: 'Philippines Environment Monitor 2001',
        url: 'https://serp-p.pids.gov.ph/publication/public/view?slug=philippines-environment-monitor-2001',
      },
      {
        id: 'ref-env-2',
        title: 'Handbook on Ecological Solid Waste Management Act of 2000 and Its Implementing Rules and Regulations',
        url: 'https://faspselib.denr.gov.ph/Materials/Detail/66452379-bf37-4bf6-9682-e4b981aebfa5',
      },
    ],
  },
];

// Default category banner graphic illustration (rolling hills, sky and clouds) matching CategoryDetail
export const DEFAULT_CATEGORY_BANNER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#BAE6FD" />
      <stop offset="70%" stop-color="#E0F2FE" />
      <stop offset="100%" stop-color="#F0F9FF" />
    </linearGradient>
    <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#A3E635" />
      <stop offset="100%" stop-color="#65A30D" />
    </linearGradient>
    <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#BEF264" />
      <stop offset="100%" stop-color="#84CC16" />
    </linearGradient>
    <linearGradient id="hillGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#65A30D" />
      <stop offset="100%" stop-color="#4D7C0F" />
    </linearGradient>
  </defs>
  <rect width="600" height="360" fill="url(#skyGrad)" />
  <g fill="#FFFFFF" opacity="0.95" transform="translate(40, 80)">
    <ellipse cx="60" cy="40" rx="40" ry="22" />
    <ellipse cx="40" cy="45" rx="25" ry="18" />
    <ellipse cx="85" cy="45" rx="30" ry="18" />
    <rect x="25" y="45" width="85" height="18" rx="8" />
  </g>
  <g fill="#FFFFFF" opacity="0.98" transform="translate(240, 60)">
    <ellipse cx="90" cy="45" rx="55" ry="32" />
    <ellipse cx="50" cy="55" rx="35" ry="22" />
    <ellipse cx="130" cy="55" rx="40" ry="22" />
    <rect x="30" y="55" width="130" height="22" rx="10" />
  </g>
  <path d="M 45 170 Q 48 166 52 170 Q 56 166 60 170" fill="none" stroke="#64748B" stroke-width="1.2" />
  <path d="M 0 240 Q 150 180 340 240 Q 480 280 600 220 L 600 360 L 0 360 Z" fill="url(#hillGrad1)" />
  <path d="M 0 270 Q 180 210 380 260 Q 520 290 600 240 L 600 360 L 0 360 Z" fill="url(#hillGrad2)" opacity="0.9" />
  <path d="M 0 240 Q 120 310 240 270 Q 360 220 600 300 L 600 360 L 0 360 Z" fill="url(#hillGrad3)" />
</svg>
`)}`;

// High quality embedded retro Nokia phone image as an SVG data URI
export const NOKIA_PHONES_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 480" width="100%" height="100%">
  <defs>
    <radialGradient id="tableBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#4B5563"/>
      <stop offset="100%" stop-color="#1F2937"/>
    </radialGradient>
    <linearGradient id="phone1Body" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="40%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="phone2Body" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E3A8A"/>
    </linearGradient>
    <linearGradient id="nokiaGreenScreen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#A3E635"/>
      <stop offset="100%" stop-color="#84CC16"/>
    </linearGradient>
  </defs>

  <!-- Surface Texture -->
  <rect width="600" height="480" fill="url(#tableBg)" />
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0"/>
  </filter>
  <rect width="600" height="480" filter="url(#noise)"/>

  <!-- Phone 1: Nokia 3210 (Silver/Grey) -->
  <g transform="translate(140, 60)">
    <!-- Shadow -->
    <ellipse cx="65" cy="350" rx="60" ry="16" fill="#000000" opacity="0.45" filter="blur(6px)"/>
    <!-- Body -->
    <path d="M 25 15 C 35 5, 95 5, 105 15 C 120 40, 125 120, 120 280 C 115 330, 95 345, 65 345 C 35 345, 15 330, 10 280 C 5 120, 10 40, 25 15 Z" fill="url(#phone1Body)" stroke="#334155" stroke-width="2"/>
    <!-- Speaker Slots -->
    <ellipse cx="65" cy="28" rx="7" ry="2" fill="#0F172A"/>
    <ellipse cx="65" cy="35" rx="10" ry="2" fill="#0F172A"/>
    <ellipse cx="65" cy="42" rx="7" ry="2" fill="#0F172A"/>
    <!-- Brand -->
    <text x="65" y="60" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#0F172A" text-anchor="middle" letter-spacing="1">NOKIA</text>
    <!-- Screen Frame -->
    <rect x="30" y="70" width="70" height="52" rx="6" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
    <rect x="34" y="74" width="62" height="44" rx="3" fill="url(#nokiaGreenScreen)"/>
    <!-- Retro Pixel Text on Screen -->
    <text x="75" y="82" font-family="Courier, monospace" font-size="6" fill="#14532D" font-weight="bold">12:03</text>
    <!-- Battery & Signal indicators -->
    <rect x="36" y="80" width="3" height="18" fill="#14532D"/>
    <rect x="91" y="80" width="3" height="18" fill="#14532D"/>
    <!-- Retro icons -->
    <polygon points="58,96 72,96 65,88" fill="#14532D" opacity="0.6"/>
    <text x="40" y="112" font-family="Courier, monospace" font-size="5" fill="#14532D">Menu</text>
    <text x="72" y="112" font-family="Courier, monospace" font-size="5" fill="#14532D">Names</text>

    <!-- Keypad Nav Section -->
    <ellipse cx="65" cy="140" rx="18" ry="10" fill="#94A3B8" stroke="#475569" stroke-width="1"/>
    <ellipse cx="65" cy="140" rx="12" ry="6" fill="#CBD5E1"/>
    <!-- Action keys -->
    <ellipse cx="38" cy="155" rx="8" ry="5" fill="#64748B"/>
    <ellipse cx="92" cy="155" rx="8" ry="5" fill="#64748B"/>

    <!-- Numeric Keypad -->
    <!-- Row 1 -->
    <rect x="35" y="172" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="43" y="181" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">1</text>
    <rect x="57" y="172" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="65" y="181" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">2</text>
    <rect x="79" y="172" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="87" y="181" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">3</text>
    <!-- Row 2 -->
    <rect x="35" y="190" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="43" y="199" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">4</text>
    <rect x="57" y="190" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="65" y="199" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">5</text>
    <rect x="79" y="190" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="87" y="199" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">6</text>
    <!-- Row 3 -->
    <rect x="35" y="208" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="43" y="217" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">7</text>
    <rect x="57" y="208" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="65" y="217" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">8</text>
    <rect x="79" y="208" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="87" y="217" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">9</text>
    <!-- Row 4 -->
    <rect x="35" y="226" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="43" y="235" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">*</text>
    <rect x="57" y="226" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="65" y="235" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">0</text>
    <rect x="79" y="226" width="16" height="12" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="1"/>
    <text x="87" y="235" font-family="Arial" font-size="7" font-weight="bold" fill="#1E293B" text-anchor="middle">#</text>
  </g>

  <!-- Phone 2: Nokia 3310 (Dark Navy Blue) -->
  <g transform="translate(320, 60)">
    <!-- Shadow -->
    <ellipse cx="65" cy="350" rx="60" ry="16" fill="#000000" opacity="0.45" filter="blur(6px)"/>
    <!-- Body -->
    <path d="M 22 15 C 35 3, 95 3, 108 15 C 122 35, 126 130, 122 285 C 118 335, 95 350, 65 350 C 35 350, 12 335, 8 285 C 4 130, 8 35, 22 15 Z" fill="url(#phone2Body)" stroke="#0284C7" stroke-width="2"/>
    <!-- Grey insert plate -->
    <path d="M 28 35 C 38 25, 92 25, 102 35 C 112 60, 114 130, 108 160 C 85 168, 45 168, 22 160 C 16 130, 18 60, 28 35 Z" fill="#334155" opacity="0.6"/>
    <!-- Speaker Slots -->
    <ellipse cx="65" cy="26" rx="8" ry="2" fill="#0284C7"/>
    <!-- Brand -->
    <text x="65" y="52" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">NOKIA</text>
    <!-- Screen Frame -->
    <rect x="28" y="62" width="74" height="54" rx="6" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
    <rect x="33" y="67" width="64" height="44" rx="3" fill="url(#nokiaGreenScreen)"/>
    <!-- Text on Screen -->
    <text x="65" y="82" font-family="Courier, monospace" font-size="8" fill="#14532D" font-weight="bold" text-anchor="middle">Messages</text>
    <rect x="55" y="86" width="20" height="12" fill="none" stroke="#14532D" stroke-width="1.5"/>
    <polyline points="55,86 65,94 75,86" fill="none" stroke="#14532D" stroke-width="1.5"/>
    <text x="40" y="106" font-family="Courier, monospace" font-size="5" fill="#14532D">Select</text>
    <text x="75" y="106" font-family="Courier, monospace" font-size="5" fill="#14532D">Exit</text>

    <!-- Keypad Nav Section -->
    <ellipse cx="65" cy="132" rx="20" ry="8" fill="#FBBF24" stroke="#D97706" stroke-width="1"/>
    <ellipse cx="36" cy="148" rx="10" ry="6" fill="#FBBF24" stroke="#D97706" stroke-width="1"/>
    <ellipse cx="94" cy="148" rx="10" ry="6" fill="#FBBF24" stroke="#D97706" stroke-width="1"/>

    <!-- Numeric Keypad (Amber / Yellow keys) -->
    <!-- Row 1 -->
    <rect x="33" y="166" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="42" y="176" font-family="Arial" font-size="7" font-weight="bold" fill="#78350F" text-anchor="middle">1 ao</text>
    <rect x="56" y="166" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="65" y="176" font-family="Arial" font-size="7" font-weight="bold" fill="#78350F" text-anchor="middle">2 abc</text>
    <rect x="79" y="166" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="88" y="176" font-family="Arial" font-size="7" font-weight="bold" fill="#78350F" text-anchor="middle">3 def</text>
    <!-- Row 2 -->
    <rect x="33" y="184" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="42" y="194" font-family="Arial" font-size="7" font-weight="bold" fill="#78350F" text-anchor="middle">4 ghi</text>
    <rect x="56" y="184" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="65" y="194" font-family="Arial" font-size="7" font-weight="bold" fill="#78350F" text-anchor="middle">5 jkl</text>
    <rect x="79" y="184" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="88" y="194" font-family="Arial" font-size="7" font-weight="bold" fill="#78350F" text-anchor="middle">6 mno</text>
    <!-- Row 3 -->
    <rect x="33" y="202" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="42" y="212" font-family="Arial" font-size="7" font-weight="bold" fill="#78350F" text-anchor="middle">7 pqrs</text>
    <rect x="56" y="202" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="65" y="212" font-family="Arial" font-size="7" font-weight="bold" fill="#78350F" text-anchor="middle">8 tuv</text>
    <rect x="79" y="202" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="88" y="212" font-family="Arial" font-size="7" font-weight="bold" fill="#78350F" text-anchor="middle">9 wxyz</text>
    <!-- Row 4 -->
    <rect x="33" y="220" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="42" y="230" font-family="Arial" font-size="8" font-weight="bold" fill="#78350F" text-anchor="middle">*</text>
    <rect x="56" y="220" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="65" y="230" font-family="Arial" font-size="7" font-weight="bold" fill="#78350F" text-anchor="middle">0</text>
    <rect x="79" y="220" width="18" height="13" rx="4" fill="#FDE047" stroke="#D97706" stroke-width="1"/>
    <text x="88" y="230" font-family="Arial" font-size="8" font-weight="bold" fill="#78350F" text-anchor="middle">#</text>
  </g>
</svg>
`)}`;

export const INITIAL_ARTIFACTS: Artifact[] = [
  // 1. Cultural Archive
  {
    id: 'cult-anime',
    categoryId: 'cultural',
    title: 'Anime in Filipino Popular Culture',
    description:
      'Anime became a recognizable part of Filipino entertainment through television broadcasts and Filipino-dubbed shows. Japanese animated series introduced viewers to different characters, stories, and art styles. These shows became part of the childhood memories of many Filipinos and helped build interest in Japanese popular culture.',
    notes:
      'Voltes V helped popularize Japanese anime among Filipino viewers, influencing childhood entertainment during the 2000s.',
    imageUrl: 'https://img.youtube.com/vi/0rcNkcSgbHU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/0rcNkcSgbHU',
    videoTitle: 'Anime in Filipino Popular Culture',
    videos: [
      {
        id: 'vid-cult-anime-1',
        url: 'https://www.youtube.com/embed/0rcNkcSgbHU',
        title: 'Anime in Filipino Popular Culture',
      },
    ],
  },
  {
    id: 'cult-opm-rock',
    categoryId: 'cultural',
    title: 'OPM and Filipino Rock Music',
    description:
      'Original Pilipino Music (OPM) played an important role in Filipino popular culture during the 2000s. Filipino bands and singers connected with listeners through songs about love, friendship, personal experiences, and everyday life. Concerts and music programs also helped artists maintain their connection with fans.',
    notes:
      "The Eraserheads' 2008 reunion concert showed the lasting popularity of Filipino rock music across generations.",
    imageUrl: 'https://img.youtube.com/vi/WAvJvAOAkDM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/WAvJvAOAkDM',
    videoTitle: 'Eraserheads Reunion Concert',
    videos: [
      {
        id: 'vid-cult-opm-1',
        url: 'https://www.youtube.com/embed/WAvJvAOAkDM',
        title: 'Eraserheads Reunion Concert',
      },
    ],
  },
  {
    id: 'cult-teleseryes',
    categoryId: 'cultural',
    title: 'Philippine Television Dramas',
    description:
      'Television dramas, commonly called teleseryes, were an important form of entertainment for Filipino audiences. Their stories often focused on family relationships, romance, conflict, and personal struggles. These programs also influenced conversations and shared viewing experiences at home.',
    notes:
      'The original Pangako Sa ’Yo (2000–2002) became a popular teleserye featuring romance, family, and personal struggles.',
    imageUrl: 'https://img.youtube.com/vi/azqFrHlpDOE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/azqFrHlpDOE',
    videoTitle: 'Pangako Sa ’Yo Marathon Part 1',
    videos: [
      {
        id: 'vid-cult-tele-1',
        url: 'https://www.youtube.com/embed/azqFrHlpDOE',
        title: 'Pangako Sa ’Yo Marathon Part 1',
      },
    ],
  },

  // 2. Economic Archive
  {
    id: 'econ-sari-sari',
    categoryId: 'economic',
    title: 'Sari-Sari Stores',
    description:
      'Sari-sari stores have long served as small neighborhood businesses in the Philippines. They sell everyday products in small quantities, making basic goods more accessible to nearby residents. These stores also provide income for families and support local economic activity.',
    notes:
      'Sari-sari stores support family income by selling affordable everyday goods to local communities.',
    imageUrl: 'https://img.youtube.com/vi/oRi_ipjlEoU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/oRi_ipjlEoU',
    videoTitle: 'Sari-Sari Store Example',
    videos: [
      {
        id: 'vid-econ-sari-1',
        url: 'https://www.youtube.com/embed/oRi_ipjlEoU',
        title: 'Sari-Sari Store Example',
      },
    ],
  },
  {
    id: 'econ-bpo',
    categoryId: 'economic',
    title: 'Call Centers and the BPO Industry',
    description:
      "The business process outsourcing (BPO) industry became an important source of employment in the Philippines during the 2000s. Call centers provided jobs that involved customer service and communication with international clients. The industry's growth was connected to globalization and improvements in communication technology.",
    notes:
      'The growing BPO industry in the 2000s created jobs for Filipinos serving international businesses.',
    imageUrl: 'https://img.youtube.com/vi/d8hBJN9iVZw/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/d8hBJN9iVZw',
    videoTitle: 'Kwento sa Likod ng BPO',
    videos: [
      {
        id: 'vid-econ-bpo-1',
        url: 'https://www.youtube.com/embed/d8hBJN9iVZw',
        title: 'Kwento sa Likod ng BPO',
      },
    ],
  },
  {
    id: 'econ-ofw',
    categoryId: 'economic',
    title: 'Overseas Filipino Workers (OFWs)',
    description:
      'Overseas Filipino workers contribute to the Philippine economy by sending money to their families. These remittances help pay for food, education, housing, and other household expenses. Overseas employment also affects family relationships because some workers spend long periods away from home.',
    notes:
      'OFWs support Philippine households through remittances that help pay for food, education, and other needs.',
    imageUrl: 'https://img.youtube.com/vi/NRXuaMvZ6kE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/NRXuaMvZ6kE',
    videoTitle: 'Philippines: A Penny Saved',
    videos: [
      {
        id: 'vid-econ-ofw-1',
        url: 'https://www.youtube.com/embed/NRXuaMvZ6kE',
        title: 'Philippines: A Penny Saved',
      },
    ],
  },

  // 3. Environmental Archive
  {
    id: 'env-ondoy',
    categoryId: 'environmental',
    title: 'Typhoon Ondoy',
    description:
      'Typhoon Ondoy, internationally known as Tropical Storm Ketsana, caused severe flooding in parts of the Philippines in September 2009. Heavy rainfall affected homes, roads, and communities, leaving many people in need of rescue and assistance. The disaster highlighted the importance of disaster preparedness and community response.',
    notes:
      'Typhoon Ondoy caused severe flooding in September 2009, highlighting the need for disaster preparedness and emergency response.',
    imageUrl: 'https://img.youtube.com/vi/Ib_Icfzb5QM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/Ib_Icfzb5QM',
    videoTitle: 'Ondoy News Footage',
    videos: [
      {
        id: 'vid-env-ondoy-1',
        url: 'https://www.youtube.com/embed/Ib_Icfzb5QM',
        title: 'Ondoy News Footage',
      },
    ],
  },
  {
    id: 'env-waste-recycling',
    categoryId: 'environmental',
    title: 'Waste Management and Recycling',
    description:
      'Waste management is important because improper disposal can contribute to pollution, clogged drainage systems, and health risks. In the Philippines, waste segregation and recycling are among the practices encouraged to reduce waste and improve environmental conditions.',
    notes:
      'Waste segregation and recycling help reduce pollution and prevent garbage from clogging drainage systems.',
    imageUrl: 'https://img.youtube.com/vi/4JDGFNoY-rQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/4JDGFNoY-rQ',
    videoTitle: 'Waste Management and Recycling',
    videos: [
      {
        id: 'vid-env-waste-1',
        url: 'https://www.youtube.com/embed/4JDGFNoY-rQ',
        title: 'Waste Management and Recycling',
      },
    ],
  },
  {
    id: 'env-plastic-pollution',
    categoryId: 'environmental',
    title: 'Plastic Pollution in the Philippines',
    description:
      'Plastic pollution is an environmental concern that affects waterways, coastlines, marine life, and communities. Single-use plastic products can accumulate when waste is not collected or disposed of properly. Reducing unnecessary plastic use and improving waste management can help lessen these effects.',
    notes:
      'Improperly disposed plastic waste harms waterways and marine life, making waste reduction important.',
    imageUrl: 'https://img.youtube.com/vi/OdHY9s5Pi7g/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/OdHY9s5Pi7g',
    videoTitle: 'All Choked Up: The Single-Use Plastics Problem in the Philippines',
    videos: [
      {
        id: 'vid-env-plastic-1',
        url: 'https://www.youtube.com/embed/OdHY9s5Pi7g',
        title: 'All Choked Up: The Single-Use Plastics Problem in the Philippines',
      },
    ],
  },

  // 4. Political Archive
  {
    id: 'pol-people-power-ii',
    categoryId: 'political',
    title: 'People Power II',
    description:
      'People Power II, also known as EDSA Dos, was a series of mass protests in January 2001 that led to President Joseph Estrada leaving office. The event demonstrated how public demonstrations and collective action could influence political change in the Philippines.',
    notes:
      'People Power II in January 2001 led to President Joseph Estrada leaving office, with text messages helping protesters coordinate.',
    imageUrl: 'https://img.youtube.com/vi/kVGdsJWLKxs/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/kVGdsJWLKxs',
    videoTitle: 'TV Patrol Throwback: EDSA Dos in 2001',
    videos: [
      {
        id: 'vid-pol-edsa-1',
        url: 'https://www.youtube.com/embed/kVGdsJWLKxs',
        title: 'TV Patrol Throwback: EDSA Dos in 2001',
      },
    ],
  },
  {
    id: 'pol-protests-participation',
    categoryId: 'political',
    title: 'Political Protests and Public Participation',
    description:
      'Political protests provide a way for citizens to express their opinions, raise concerns, and call for changes in government. In the Philippines, public movements have played a role in shaping political discussions and encouraging people to participate in national issues.',
    notes:
      'Political protests allow citizens to express concerns and call for government action through public participation.',
    imageUrl: 'https://img.youtube.com/vi/1UEJvhedgg8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/1UEJvhedgg8',
    videoTitle: 'People Power II Coverage',
    videos: [
      {
        id: 'vid-pol-coverage-1',
        url: 'https://www.youtube.com/embed/1UEJvhedgg8',
        title: 'People Power II Coverage',
      },
    ],
  },

  // 5. Social Archive
  {
    id: 'soc-nokia-texting',
    categoryId: 'social',
    title: 'Nokia Phones and Text Messaging',
    description:
      'Mobile phones such as the Nokia 3310 were associated with the growth of text messaging in the Philippines. SMS provided a relatively affordable way to communicate with friends and family.',
    notes:
      'Nokia phones and SMS made mobile communication more accessible before internet-based messaging apps became common.',
    imageUrl: 'https://img.youtube.com/vi/ysL5_yCQw_4/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/ysL5_yCQw_4',
    videoTitle: 'Nokia 3310 and Philippine texting culture video search',
    videos: [
      {
        id: 'vid-soc-nokia-1',
        url: 'https://www.youtube.com/embed/ysL5_yCQw_4',
        title: 'Nokia 3310 and Philippine texting culture video search',
      },
    ],
  },
  {
    id: 'soc-internet-cafes',
    categoryId: 'social',
    title: 'Internet Cafés',
    description:
      'Internet cafés gave people access to computers, email, chat rooms, online games, and websites, including those who did not own a computer or have Internet access at home.',
    notes:
      'Internet cafés provided computer access for gaming, chatting, email, and socializing, especially for people without home internet.',
    imageUrl: 'https://img.youtube.com/vi/Qjux-xO8hOk/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/Qjux-xO8hOk',
    videoTitle: 'Philippine Internet cafés in the 2000s video search',
    videos: [
      {
        id: 'vid-soc-cafe-1',
        url: 'https://www.youtube.com/embed/Qjux-xO8hOk',
        title: 'Philippine Internet cafés in the 2000s video search',
      },
    ],
  },
  {
    id: 'soc-social-media',
    categoryId: 'social',
    title: 'Social Media Platforms and Social Networking',
    description:
      'During the 2000s, social networking websites changed how Filipinos communicated and maintained friendships online. Platforms such as Friendster, MySpace, and later Facebook allowed users to create profiles, share photos, post messages, and connect with friends. These websites became important spaces for self-expression and online interaction before today\'s social media apps became common.',
    notes:
      'Friendster, MySpace, and Facebook helped Filipinos share photos, create profiles, and maintain friendships online during the 2000s.',
    imageUrl: 'https://img.youtube.com/vi/xXnbuC8-zUs/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/xXnbuC8-zUs',
    videoTitle: 'Ano nga ba ang Friendster?',
    videos: [
      {
        id: 'vid-soc-friendster-1',
        url: 'https://www.youtube.com/embed/xXnbuC8-zUs',
        title: 'Ano nga ba ang Friendster?',
      },
    ],
  },
];

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  // 1. Cultural Archive
  {
    id: 'q-cult-1',
    categoryId: 'cultural',
    artifactId: 'cult-opm-rock',
    questionText: 'Which music genre was represented by Filipino bands such as the Eraserheads during the 2000s?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Original Pilipino Music (OPM) and alternative rock' },
      { id: 'choice-B', letter: 'B', text: 'K-pop idol music only' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'The Eraserheads were a well-known Filipino band associated with OPM and alternative rock. Their 2008 reunion showed their lasting popularity.',
  },
  {
    id: 'q-cult-2',
    categoryId: 'cultural',
    artifactId: 'cult-teleseryes',
    questionText: 'What was one major role of teleseryes in Filipino households during the 2000s?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Replacing all forms of entertainment' },
      { id: 'choice-B', letter: 'B', text: 'Providing popular television dramas for family viewing' },
    ],
    correctChoiceId: 'choice-B',
    explanation: 'Teleseryes were a popular form of entertainment, with stories about romance, family, and personal struggles.',
  },

  // 2. Economic Archive
  {
    id: 'q-econ-1',
    categoryId: 'economic',
    artifactId: 'econ-sari-sari',
    questionText: 'What was one important purpose of a sari-sari store in a Filipino community?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Selling everyday goods in small quantities' },
      { id: 'choice-B', letter: 'B', text: 'Providing international airline services' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Sari-sari stores allowed customers to buy common household products conveniently, often in small amounts.',
  },
  {
    id: 'q-econ-2',
    categoryId: 'economic',
    artifactId: 'econ-ofw',
    questionText: 'How did many Overseas Filipino Workers (OFWs) support their families in the Philippines?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'By sending only imported products' },
      { id: 'choice-B', letter: 'B', text: 'By sending money earned from working abroad' },
    ],
    correctChoiceId: 'choice-B',
    explanation: 'OFWs often sent remittances to help pay for food, education, housing, and other family expenses.',
  },

  // 3. Environmental Archive
  {
    id: 'q-env-1',
    categoryId: 'environmental',
    artifactId: 'env-ondoy',
    questionText: 'What major environmental disaster affected Metro Manila and nearby areas in September 2009?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'A volcanic eruption in Metro Manila' },
      { id: 'choice-B', letter: 'B', text: 'Severe flooding caused by Tropical Storm Ondoy' },
    ],
    correctChoiceId: 'choice-B',
    explanation: 'Ondoy brought heavy rainfall that caused widespread flooding and affected many communities.',
  },
  {
    id: 'q-env-2',
    categoryId: 'environmental',
    artifactId: 'env-waste-recycling',
    questionText: 'What is one purpose of waste segregation?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Separating different types of waste for proper disposal and recycling' },
      { id: 'choice-B', letter: 'B', text: 'Mixing all waste together before disposal' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Waste segregation helps make recycling easier and supports safer waste management.',
  },

  // 4. Political Archive
  {
    id: 'q-pol-1',
    categoryId: 'political',
    artifactId: 'pol-people-power-ii',
    questionText: 'What happened during People Power II in January 2001?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'The Philippines changed from a republic to a monarchy' },
      { id: 'choice-B', letter: 'B', text: 'Mass protests led to President Joseph Estrada leaving office' },
    ],
    correctChoiceId: 'choice-B',
    explanation: 'People Power II was a major political movement that resulted in Estrada leaving the presidency.',
  },
  {
    id: 'q-pol-2',
    categoryId: 'political',
    artifactId: 'pol-people-power-ii',
    questionText: 'Which communication method helped spread information and organize people during People Power II?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Mobile-phone text messaging' },
      { id: 'choice-B', letter: 'B', text: 'Video calls through modern smartphone apps' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Text messaging was widely used to share information and encourage participation during the protests.',
  },

  // 5. Social Archive
  {
    id: 'q-soc-1',
    categoryId: 'social',
    artifactId: 'soc-nokia-texting',
    questionText: 'What was a common use of mobile phones in the Philippines during the 2000s?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Text messaging and phone calls' },
      { id: 'choice-B', letter: 'B', text: 'Streaming high-definition videos on modern social media apps' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'SMS and calls were common ways to communicate before today\'s smartphone apps and mobile streaming became widespread.',
  },
  {
    id: 'q-soc-2',
    categoryId: 'social',
    artifactId: 'soc-internet-cafes',
    questionText: 'Why did many Filipinos visit Internet cafés during the 2000s?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'To access only traditional printed newspapers' },
      { id: 'choice-B', letter: 'B', text: 'To use computers, browse the Internet, chat, and play online games' },
    ],
    correctChoiceId: 'choice-B',
    explanation: 'Internet cafés provided computer and Internet access for people who did not have these resources at home.',
  },
];

export const INITIAL_ABOUT_CONTENT: AboutContent = {
  paragraph1:
    'PopPinoyArchive is a virtual museum that explores Philippine popular culture from 2000 to 2010. It looks at how technology, emotions, entertainment, and foreign influences shaped the way Filipinos experienced popular culture during the decade.',
  paragraph2:
    'Explore different parts of the museum to discover the music, television, technology, trends, and cultural experiences that became part of everyday Filipino life. Through interactive sections, images, and a timeline, PopPinoyArchive brings the culture of the 2000s into a digital space that is easy and fun to explore.',
  timelineTitle: 'Philippine Popular Culture Timeline (2000–2010)',
  milestones: [
    {
      id: 'm-2000',
      year: '2000',
      title: 'The Beginning of a New Decade',
      desc: 'Mobile phones and text messaging were becoming important parts of Filipino communication. Television dramas, OPM, radio, and local movies remained popular forms of entertainment. The Payatas dumpsite tragedy also raised serious concerns about waste management and community safety.',
    },
    {
      id: 'm-2001',
      year: '2001',
      title: 'People Power II',
      desc: 'EDSA II led to President Joseph Estrada leaving office and Gloria Macapagal-Arroyo becoming president. Text messaging helped people share information and coordinate during the protests, showing how mobile technology could influence political participation.',
    },
    {
      id: 'm-2002',
      year: '2002',
      title: 'Television and Digital Film',
      desc: 'Filipino teleseryes continued to attract audiences, with the original Pangako Sa ’Yo concluding its run. Digital filmmaking also began creating new opportunities for independent Filipino filmmakers.',
    },
    {
      id: 'm-2003',
      year: '2003',
      title: 'Film and Political Events',
      desc: 'Filipino movies such as Crying Ladies and Magnifico gained attention. The Oakwood mutiny also became a major political event, showing the continuing influence of national issues on public discussion.',
    },
    {
      id: 'm-2004',
      year: '2004',
      title: 'Elections and Media',
      desc: 'The 2004 presidential election made political news, television coverage, and campaign advertising important parts of public life. Mobile phones and the internet continued changing how Filipinos communicated and received information.',
    },
    {
      id: 'm-2005',
      year: '2005',
      title: 'Reality Television',
      desc: 'Pinoy Big Brother premiered in the Philippines, bringing reality television into more Filipino households. Viewers followed contestants\' daily lives and discussed the show with family and friends.',
    },
    {
      id: 'm-2006',
      year: '2006',
      title: 'Growing Digital Entertainment',
      desc: 'Independent Filipino filmmaking continued to develop with movies like Kubrador. Internet access expanded through internet cafés, allowing more people to connect online.',
    },
    {
      id: 'm-2007',
      year: '2007',
      title: 'Internet and Social Media Growth',
      desc: 'Internet cafés remained popular across the country. Filipinos used social networking platforms such as Friendster to connect with friends, while blogs and online forums became popular spaces for sharing personal stories.',
    },
    {
      id: 'm-2008',
      year: '2008',
      title: 'Music and Nostalgia',
      desc: 'The Eraserheads held their reunion concert, showing how Filipino rock music connected different generations. The year also brought attention to global economic challenges that affected many Filipino families.',
    },
    {
      id: 'm-2009',
      year: '2009',
      title: 'Typhoon Ondoy and Social Media Response',
      desc: 'Typhoon Ondoy brought heavy rainfall and severe flooding across Metro Manila and nearby provinces. Many Filipinos used platforms like Facebook and Twitter to share rescue information, coordinate relief efforts, and ask for help.',
    },
    {
      id: 'm-2010',
      year: '2010',
      title: 'Automated Elections and Leadership Change',
      desc: 'The Philippines held its first nationwide automated elections, with Benigno Aquino III elected as president. Social media also became an increasingly important tool for sharing news and discussing national issues.',
    },
    {
      id: 'm-2026',
      year: 'Present: 2026',
      title: 'Digital Culture & Everyday Technology',
      desc: 'This timeline focuses on modern Filipino popular culture, including P-pop, streaming platforms, social media trends, digital payments, artificial intelligence, online activism, and climate awareness. It highlights how digital technology influences the way Filipinos communicate, work, learn, and enjoy entertainment today.',
    },
    {
      id: 'm-2030-2040',
      year: 'Future: 2030–2040',
      title: 'Speculative Scenarios & Emerging Horizons',
      desc: 'This timeline imagines how Philippine popular culture might change in the coming years. Possible developments include AI-assisted entertainment, more immersive digital experiences, cashless transactions, new forms of online communities, climate-adaptive lifestyles, and changes in how people work and communicate.\n\nThe future timeline is based on possible scenarios rather than guaranteed predictions. Its purpose is to encourage visitors to think critically about how current choices and technological developments may shape Filipino life in the future.',
    },
  ],
};
