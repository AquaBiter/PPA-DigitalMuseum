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
  },
  {
    id: 'economic',
    name: 'ECONOMIC',
    summary: 'Discover how Filipinos worked, spent, paid, and shopped during the 2000s.',
    fullDescription: 'This archive explores economic life and consumer culture in the Philippines from 2000 to 2010. From the mushrooming of modern shopping mega-malls, the rise of the Business Process Outsourcing (BPO) call center industry, to everyday street vending, prepaid phone cards, and changing remittance lifelines of Overseas Filipino Workers (OFWs).',
    accentColor: '#10B981',
  },
  {
    id: 'social',
    name: 'SOCIAL',
    summary: 'Explore how Filipinos communicated, connected, and spent time together during the 2000s.',
    fullDescription: 'This archive explores the everyday social life of Filipinos from 2000 to 2010, including communication, friendships, family connections, gadgets, social spaces, and early online communities. It shows how technologies such as mobile phones, texting, and the Internet changed how people interacted with each other.',
    accentColor: '#06B6D4',
  },
  {
    id: 'cultural',
    name: 'CULTURAL',
    summary: 'Explore the music, television, fashion, food, technology, and trends that shaped Philippine popular culture.',
    fullDescription: 'This archive celebrates the golden era of 2000s Pinoy pop culture: the golden boom of Original Pilipino Music (OPM) alternative rock bands, iconic primetime fantaseryes and reality television, cyber cafes (kompyuteran), dance crazes, and early Filipino internet subcultures.',
    accentColor: '#F59E0B',
  },
  {
    id: 'environmental',
    name: 'ENVIRONMENTAL',
    summary: 'Discover environmental issues, practices, and experiences that were part of Filipino life.',
    fullDescription: 'This archive examines environmental conditions, natural disasters, ecological shifts, and communal resilience in the Philippines during the 2000s, including historical weather occurrences like Typhoon Ondoy (2009), early solid waste management campaigns, and grassroots community adaptations.',
    accentColor: '#84CC16',
  },
];

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
  {
    id: 'nokia-phones',
    categoryId: 'social',
    title: 'NOKIA PHONES',
    description: 'This archive explores the everyday social life of Filipinos from 2000 to 2010, including communication, friendships, family connections, gadgets, social spaces, and early online communities. It shows how technologies such as mobile phones, texting, and the Internet changed how people interacted with each other.',
    notes: 'The phone represents the early stage of mobile communication before smartphones became common.',
    imageUrl: NOKIA_PHONES_IMG,
    videoUrl: 'https://www.youtube.com/embed/rP1Zc5oJ8aE', // Classic 2000s tech commercial or demonstration
    videoTitle: '2000s Mobile Tech & Texting Culture in the Philippines',
    videos: [
      {
        id: 'vid-nokia-1',
        url: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
        title: '2000s Mobile Tech & Texting Culture in the Philippines',
      },
      {
        id: 'vid-nokia-2',
        url: 'https://www.youtube.com/embed/Q4Xky3t8YmQ',
        title: 'Nokia 3310 & 3210 Nostalgia Retrospective',
      },
    ],
  },
  {
    id: 'friendster-internet-cafe',
    categoryId: 'social',
    title: 'FRIENDSTER & INTERNET CAFES (2002–2008)',
    description: 'Before Facebook, Friendster was the dominant social network in the Philippines, with millions customizing their profiles with CSS glitter graphics and background songs. Neighborhood Internet cafes (P20 per hour) became the primary youth social hangout for online gaming like Ragnarok Online and chatting on Yahoo Messenger.',
    notes: 'Friendster testimonials and profile views were the ultimate social currency among Filipino youth.',
    imageUrl: NOKIA_PHONES_IMG,
    videoUrl: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
    videoTitle: '2000s Internet Cafe & Friendster Phenomenon',
    videos: [
      {
        id: 'vid-friendster-1',
        url: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
        title: '2000s Internet Cafe & Friendster Phenomenon',
      },
    ],
  },
  {
    id: 'edsa-dos',
    categoryId: 'political',
    title: 'EDSA DOS & SMS MOBILIZATION',
    description: 'In January 2001, mass demonstrations gathered at the EDSA Shrine, heavily coordinated through viral SMS forward messages reading "Go 2 EDSA, Wear blk". This demonstrated how early mobile technology could alter political history.',
    notes: 'Considered one of the earliest mobile phone-driven political uprisings in the world.',
    imageUrl: NOKIA_PHONES_IMG,
    videoUrl: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
    videoTitle: 'EDSA II SMS Revolution Documentary',
    videos: [
      {
        id: 'vid-edsa-1',
        url: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
        title: 'EDSA II SMS Revolution Documentary',
      },
    ],
  },
  {
    id: 'hello-garci-scandal',
    categoryId: 'political',
    title: 'HELLO GARCI & SATIRE RINGTONES (2005)',
    description: 'In 2005, wiretapped audio from the 2004 presidential elections leaked to the public. Audio clips of the conversation quickly turned into viral mobile ringtones and remixes, transforming national political controversy into grassroots popular satire.',
    notes: 'Exemplified how mobile ringtones became a medium for political commentary and humor.',
    imageUrl: NOKIA_PHONES_IMG,
    videoUrl: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
    videoTitle: '2005 Political Wiretaps & Media Satire Archive',
    videos: [
      {
        id: 'vid-garci-1',
        url: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
        title: '2005 Political Wiretaps & Media Satire Archive',
      },
    ],
  },
  {
    id: 'bpo-boom',
    categoryId: 'economic',
    title: 'THE CALL CENTER BOOM & 24/7 ECONOMY',
    description: 'During the 2000s, Eastwood City, Ortigas, and Makati transformed into 24-hour economic hubs. The BPO sector provided hundreds of thousands of jobs and spawned late-night dining and coffee culture across metro hubs.',
    notes: 'The economic expansion created a new middle class and revolutionized graveyard-shift commerce.',
    imageUrl: NOKIA_PHONES_IMG,
    videoUrl: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
    videoTitle: 'Rise of BPO and 2000s Philippine Commerce',
    videos: [
      {
        id: 'vid-bpo-1',
        url: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
        title: 'Rise of BPO and 2000s Philippine Commerce',
      },
    ],
  },
  {
    id: 'opm-bands',
    categoryId: 'cultural',
    title: 'OPM BAND INVASION & MYX COUNTDOWN',
    description: 'The 2000s was a golden era for Pinoy rock and pop. Bands like Parokya ni Edgar, Kamikazee, Sponge Cola, Bamboo, and Hale dominated radio charts and the MYX Daily Top 10 countdowns.',
    notes: 'Physical CDs, cassette tapes, and pirated MP3s shaped how youth shared and experienced songs.',
    imageUrl: NOKIA_PHONES_IMG,
    videoUrl: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
    videoTitle: '2000s OPM Band Era Highlights',
    videos: [
      {
        id: 'vid-opm-1',
        url: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
        title: '2000s OPM Band Era Highlights',
      },
    ],
  },
  {
    id: 'anime-fever-tv',
    categoryId: 'cultural',
    title: 'TAGALOG ANIME FEVER & AFTERNOON TV',
    description: 'During the early to mid-2000s, local TV stations broadcast beloved Japanese anime dubbed into Tagalog, such as Ghost Fighter, Flame of Recca, Slam Dunk, and Hunter x Hunter. After-school anime viewership became a nationwide collective ritual for Generation Y and Z Filipinos.',
    notes: 'Tagalog dubbing made anime culturally accessible across all socio-economic backgrounds.',
    imageUrl: NOKIA_PHONES_IMG,
    videoUrl: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
    videoTitle: '2000s Philippine TV Anime Nostalgia',
    videos: [
      {
        id: 'vid-anime-1',
        url: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
        title: '2000s Philippine TV Anime Nostalgia',
      },
    ],
  },
  {
    id: 'typhoon-ondoy',
    categoryId: 'environmental',
    title: 'TYPHOON ONDOY & CITIZEN RESILIENCE (2009)',
    description: 'Typhoon Ketsana (Ondoy) dumped a month worth of rain in six hours on Metro Manila in September 2009. It triggered unprecedented social media rescue coordination on Twitter and Facebook, marking the dawn of digital humanitarian response.',
    notes: 'Highlights community bayanihan and the pivotal shift toward crowd-sourced rescue maps.',
    imageUrl: NOKIA_PHONES_IMG,
    videoUrl: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
    videoTitle: 'Typhoon Ondoy 2009 Bayanihan Archive',
    videos: [
      {
        id: 'vid-ondoy-1',
        url: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
        title: 'Typhoon Ondoy 2009 Bayanihan Archive',
      },
    ],
  },
];

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-social-nokia',
    categoryId: 'social',
    artifactId: 'nokia-phones',
    questionText: 'What was one of the main ways Filipinos used mobile phones during the 2000s?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Text messaging and calls' },
      { id: 'choice-B', letter: 'B', text: 'Video streaming and social media' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Correct! The Philippines was hailed as the "SMS Capital of the World" during the 2000s, sending hundreds of millions of text messages daily before mobile internet and modern smartphones became standard.',
  },
  {
    id: 'q-political-edsa',
    categoryId: 'political',
    artifactId: 'edsa-dos',
    questionText: 'How did Filipinos primarily coordinate crowds during the 2001 EDSA Dos protests?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Viral SMS chain messages' },
      { id: 'choice-B', letter: 'B', text: 'TikTok and Instagram Live' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Correct! Chains of SMS text messages calling citizens to "Go 2 EDSA, Wear blk" spread across millions of phones within hours.',
  },
  {
    id: 'q-cultural-music',
    categoryId: 'cultural',
    artifactId: 'opm-bands',
    questionText: 'Which music channel music video chart was most widely watched by Filipino youth in the mid-2000s?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'MYX Daily Top 10' },
      { id: 'choice-B', letter: 'B', text: 'Spotify Global Top 50' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Correct! MYX and MTV Philippines were the ultimate television authorities for music videos and votes during the decade.',
  },
  {
    id: 'q-economic-bpo',
    categoryId: 'economic',
    artifactId: 'bpo-boom',
    questionText: 'What industry experienced an explosive employment boom in Metro Manila throughout the 2000s?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'BPO / Call Centers' },
      { id: 'choice-B', letter: 'B', text: 'Electric vehicle manufacturing' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Correct! The Business Process Outsourcing (BPO) and call center boom transformed districts like Eastwood and Ortigas into vibrant 24/7 commercial hubs.',
  },
  {
    id: 'q-environmental-ondoy',
    categoryId: 'environmental',
    artifactId: 'typhoon-ondoy',
    questionText: 'Which 2009 typhoon spurred pioneering citizen rescue coordination over Twitter and social networks in Metro Manila?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Typhoon Ondoy (Ketsana)' },
      { id: 'choice-B', letter: 'B', text: 'Typhoon Yolanda (Haiyan)' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Correct! Typhoon Ondoy struck in September 2009, prompting the first viral crowd-sourced social media rescue efforts in the country.',
  },
];

export const INITIAL_ABOUT_CONTENT: AboutContent = {
  paragraph1:
    'PopPinoyArchive is a virtual museum that explores Philippine popular culture from 2000 to 2010. It looks at how technology, emotions, entertainment, and foreign influences shaped the way Filipinos experienced popular culture during the decade.',
  paragraph2:
    'Explore different parts of the museum to discover the music, television, technology, trends, and cultural experiences that became part of everyday Filipino life. Through interactive sections, images, and a timeline, PopPinoyArchive brings the culture of the 2000s into a digital space that is easy and fun to explore.',
  timelineTitle: 'The 2000–2010 Cultural Timeline',
  milestones: [
    {
      id: 'm-2000',
      year: '2000',
      title: 'Nokia 3310 & Y2K',
      desc: 'Cellular phones redefine Filipino communication with custom monochrome operator logos and composer ringtones.',
    },
    {
      id: 'm-2001',
      year: '2001',
      title: 'EDSA Dos & SMS Power',
      desc: 'Viral text chains mobilize millions to the EDSA Shrine, crowning the country the "Text Capital of the World".',
    },
    {
      id: 'm-2003',
      year: '2003',
      title: 'Friendster Craze & Cyber Cafes',
      desc: 'Friendster profiles, testimonials, and midnight internet cafe (kompyuteran) LAN gaming take over youth culture.',
    },
    {
      id: 'm-2005',
      year: '2005',
      title: 'Pinoy Big Brother & Reality TV',
      desc: "The historic launch of Kuya's house triggers national text voting frenzy and reality TV culture.",
    },
    {
      id: 'm-2006',
      year: '2006',
      title: 'OPM Rock Renaissance',
      desc: 'Parokya ni Edgar, Kamikazee, Bamboo, and Sponge Cola dominate MYX Top 10 countdowns and radio airwaves.',
    },
    {
      id: 'm-2009',
      year: '2009',
      title: 'Typhoon Ondoy Digital Bayanihan',
      desc: 'Mass digital crowdsourcing on Twitter and Facebook pioneers social media humanitarian response in Southeast Asia.',
    },
  ],
};
