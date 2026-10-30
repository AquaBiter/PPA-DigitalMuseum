import { Category, Artifact, QuizQuestion } from '../types';

export const FUTURE_CATEGORIES: Category[] = [
  {
    id: 'cultural',
    name: 'CULTURAL',
    summary:
      'Explore how AI, immersive media, virtual performers, and new fashion technologies could influence Filipino popular culture between 2030 and 2040.',
    fullDescription:
      'The Cultural Archive explores how AI, immersive media, virtual performers, and new fashion technologies could influence Filipino popular culture between 2030 and 2040. Filipino artists may use these tools to reach global audiences while preserving local languages, music, textiles, and cultural identity.',
    accentColor: '#8B5CF6',
    bannerImageUrl: '',
    referenceLinks: [
      {
        id: 'ref-fut-cult-1',
        title: 'Pagtanaw 2050: Philippine Science and Technology Foresight',
        url: 'https://nast.dost.gov.ph/index.php/pagtanaw-2050',
      },
      {
        id: 'ref-fut-cult-2',
        title: 'Philippine pop culture research – SAGE Journals',
        url: 'https://journals.sagepub.com/doi/10.1177/1329878X20985960',
      },
    ],
  },
  {
    id: 'economic',
    name: 'ECONOMIC',
    summary:
      'Explore how digital money, automated delivery, AI-assisted work, and virtual employment could change the Philippine economy between 2030 and 2040.',
    fullDescription:
      'The Economic Archive imagines how digital money, automated delivery, AI-assisted work, and virtual employment could change the Philippine economy between 2030 and 2040. These technologies may create new opportunities while requiring workers and businesses to develop new skills.',
    accentColor: '#10B981',
    bannerImageUrl: '',
    referenceLinks: [
      {
        id: 'ref-fut-econ-1',
        title: 'AmBisyon Natin 2040 – Philippine long-term vision document',
        url: 'https://2040.neda.gov.ph/',
      },
      {
        id: 'ref-fut-econ-2',
        title: 'World Economic Forum – Future of Jobs Report 2025',
        url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',
      },
    ],
  },
  {
    id: 'environmental',
    name: 'ENVIRONMENTAL',
    summary:
      'Explore how climate adaptation, renewable energy, smart infrastructure, and improved waste systems could help Filipino communities between 2030 and 2040.',
    fullDescription:
      'The Environmental Archive explores how climate adaptation, renewable energy, smart infrastructure, and improved waste systems could help Filipino communities between 2030 and 2040. These technologies may help reduce risks, but they will not completely prevent disasters or eliminate pollution.',
    accentColor: '#059669',
    bannerImageUrl: '',
    referenceLinks: [
      {
        id: 'ref-fut-env-1',
        title: 'UNEP – Turning off the Tap: How the World Can End Plastic Pollution and Create a Circular Economy',
        url: 'https://www.unep.org/resources/turning-off-tap-how-world-can-end-plastic-pollution-and-create-circular-economy',
      },
      {
        id: 'ref-fut-env-2',
        title: 'PAGASA – Flood Learning and Preparedness Tools',
        url: 'https://bagong.pagasa.dost.gov.ph/',
      },
    ],
  },
  {
    id: 'political',
    name: 'POLITICAL',
    summary:
      'Explore how digital governance, AI-generated misinformation, online activism, and automated fact-checking could affect Philippine civic life between 2030 and 2040.',
    fullDescription:
      'The Political Archive explores how digital governance, AI-generated misinformation, online activism, and automated fact-checking could affect Philippine civic life between 2030 and 2040. These tools may improve access to information, but they also raise concerns about privacy, accuracy, and accountability.',
    accentColor: '#3B82F6',
    bannerImageUrl: '',
    referenceLinks: [
      {
        id: 'ref-fut-pol-1',
        title: 'COMELEC Resolution No. 11064-A – official PDF on digital campaigning and AI',
        url: 'https://comelec.gov.ph/?r=Resolutions/11064A',
      },
      {
        id: 'ref-fut-pol-2',
        title: 'Rappler – Fact-check articles',
        url: 'https://www.rappler.com/newsbreak/fact-check/',
      },
    ],
  },
  {
    id: 'social',
    name: 'SOCIAL',
    summary:
      'Explore how communication, family relationships, gaming, and online identity could change in the Philippines between 2030 and 2040.',
    fullDescription:
      'The Social Archive explores how communication, family relationships, gaming, and online identity could change in the Philippines between 2030 and 2040. More immersive digital tools may help people connect across distances, while creating new questions about privacy, screen time, and personal relationships.',
    accentColor: '#EC4899',
    bannerImageUrl: '',
    referenceLinks: [
      {
        id: 'ref-fut-soc-1',
        title: 'DataReportal – Digital 2026: The Philippines',
        url: 'https://datareportal.com/reports/digital-2026-philippines',
      },
      {
        id: 'ref-fut-soc-2',
        title: 'GSMA – The Mobile Economy Asia Pacific 2026',
        url: 'https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/asia-pacific/',
      },
    ],
  },
];

export const FUTURE_ARTIFACTS: Artifact[] = [
  {
    id: 'fut-cult-spatial-media',
    categoryId: 'cultural',
    title: 'Spatial Media and Interactive Holographic Streaming',
    description:
      'Between 2030 and 2040, viewers could use spatial computing headsets and 3D displays to experience interactive versions of Filipino films, sports, and live performances.',
    notes:
      'Spatial computing headsets and volumetric displays create immersive cultural performances and interactive entertainment for Filipino audiences worldwide.',
    videoUrl: 'https://www.youtube.com/watch?v=aDatQSELa9c&utm_source=chatgpt.com',
    videoTitle: 'Spatial Media and Interactive Holographic Streaming',
    videos: [
      {
        id: 'vid-fut-cult-1',
        url: 'https://www.youtube.com/watch?v=aDatQSELa9c&utm_source=chatgpt.com',
        title: 'Spatial Media and Interactive Holographic Streaming',
      },
    ],
  },
  {
    id: 'fut-econ-drone-commerce',
    categoryId: 'economic',
    title: 'Autonomous Delivery and Drone Commerce',
    description:
      'Drone delivery and automated warehouses could help businesses deliver products more quickly. These systems may eventually support online shopping across more Philippine communities, depending on cost, safety, and regulations.',
    notes:
      'Automated warehouses and drone flight systems streamline commercial logistics and remote island connectivity.',
    videoUrl: 'https://www.youtube.com/watch?v=xk0mLgs_72w&utm_source=chatgpt.com',
    videoTitle: 'Autonomous Delivery and Drone Commerce',
    videos: [
      {
        id: 'vid-fut-econ-1',
        url: 'https://www.youtube.com/watch?v=xk0mLgs_72w&utm_source=chatgpt.com',
        title: 'Autonomous Delivery and Drone Commerce',
      },
    ],
  },
  {
    id: 'fut-env-drone-reforestation',
    categoryId: 'environmental',
    title: 'Drone-Assisted Reforestation and Coastal Restoration',
    description:
      'Environmental groups could use drones to distribute seeds and monitor restoration projects. Technology could also help communities track mangroves, forests, and damaged marine habitats.',
    notes:
      'Autonomous drones seed degraded watersheds and monitor coastal mangrove recovery with high-resolution aerial mapping.',
    videoUrl: 'https://youtu.be/JYI1l-uAtXc',
    videoTitle: 'Drone-Assisted Reforestation and Coastal Restoration',
    videos: [
      {
        id: 'vid-fut-env-1',
        url: 'https://youtu.com/watch?v=JYI1l-uAtXc',
        title: 'Drone-Assisted Reforestation and Coastal Restoration',
      },
    ],
  },
  {
    id: 'fut-pol-deepfake-detection',
    categoryId: 'political',
    title: 'Deepfake Detection and Digital Authentication',
    description:
      'AI-generated videos and cloned voices could make misinformation harder to identify. News organizations and digital platforms may use verification tools to check the origin and authenticity of public content.',
    notes:
      'Cryptographic provenance and real-time deepfake detectors authenticate media in democratic discourse.',
    videoUrl: 'https://youtu.be/cBxaFILjzi8',
    videoTitle: 'Deepfake Detection and Digital Authentication',
    videos: [
      {
        id: 'vid-fut-pol-1',
        url: 'https://youtu.com/watch?v=cBxaFILjzi8',
        title: 'Deepfake Detection and Digital Authentication',
      },
    ],
  },
  {
    id: 'fut-soc-hologram-family',
    categoryId: 'social',
    title: 'Hologram Family Hubs and Overseas Connections',
    description:
      'Filipino families with members working overseas could use more advanced 3D communication and virtual meeting systems to create a stronger sense of presence during family conversations.',
    notes:
      'Volumetric telepresence and hologram family hubs connect overseas Filipino workers intimately with their loved ones back home.',
    videoUrl: 'https://youtu.be/3J0qc44Ak4o',
    videoTitle: 'Hologram Family Hubs and Overseas Connections',
    videos: [
      {
        id: 'vid-fut-soc-1',
        url: 'https://youtu.com/watch?v=3J0qc44Ak4o',
        title: 'Hologram Family Hubs and Overseas Connections',
      },
    ],
  },
];

export const FUTURE_QUESTIONS: QuizQuestion[] = [
  // 1. Cultural Archive (Future 2030-2040)
  {
    id: 'fut-q-cult-1',
    categoryId: 'cultural',
    artifactId: 'fut-cult-spatial-media',
    questionText: 'How could spatial media change the way Filipinos experience entertainment in the future?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'By making entertainment available only through traditional television.' },
      { id: 'choice-B', letter: 'B', text: 'By allowing viewers to experience interactive Filipino films, sports, and live performances through 3D displays.' },
    ],
    correctChoiceId: 'choice-B',
    explanation:
      'Spatial media allows viewers to step inside interactive 3D environments, bringing Filipino performances and storytelling to life.',
  },
  {
    id: 'fut-q-cult-2',
    categoryId: 'cultural',
    artifactId: 'fut-cult-spatial-media',
    questionText: 'What technology could support these future entertainment experiences?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Printed newspapers and radio broadcasts.' },
      { id: 'choice-B', letter: 'B', text: 'Traditional cable television systems.' },
      { id: 'choice-C', letter: 'C', text: 'Spatial computing headsets and 3D displays.' },
    ],
    correctChoiceId: 'choice-C',
    explanation:
      'Spatial computing headsets, volumetric rendering, and advanced 3D displays provide the immersive hardware for next-generation media.',
  },

  // 2. Economic Archive (Future 2030-2040)
  {
    id: 'fut-q-econ-1',
    categoryId: 'economic',
    artifactId: 'fut-econ-drone-commerce',
    questionText: 'How could autonomous delivery systems help businesses in the Philippines?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'By preventing businesses from accepting online orders.' },
      { id: 'choice-B', letter: 'B', text: 'By making all delivery services depend on manual labor.' },
      { id: 'choice-C', letter: 'C', text: 'By helping deliver products faster through drones and automated systems.' },
    ],
    correctChoiceId: 'choice-C',
    explanation:
      'Autonomous drones and automated logistics enable swift deliveries, particularly across archipelagic geography and remote islands.',
  },
  {
    id: 'fut-q-econ-2',
    categoryId: 'economic',
    artifactId: 'fut-econ-drone-commerce',
    questionText: 'What technologies could support autonomous delivery and drone commerce?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Automated warehouses and drone-assisted delivery systems.' },
      { id: 'choice-B', letter: 'B', text: 'Traditional handwritten order records.' },
      { id: 'choice-C', letter: 'C', text: 'Manual transportation without digital systems.' },
    ],
    correctChoiceId: 'choice-A',
    explanation:
      'Robotic fulfillment hubs, AI flight management, and drone fleets form the backbone of autonomous commercial logistics.',
  },

  // 3. Environmental Archive (Future 2030-2040)
  {
    id: 'fut-q-env-1',
    categoryId: 'environmental',
    artifactId: 'fut-env-drone-reforestation',
    questionText: 'How could drones help environmental restoration projects?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'By replacing natural forests with commercial buildings.' },
      { id: 'choice-B', letter: 'B', text: 'By distributing seeds and monitoring environmental restoration.' },
      { id: 'choice-C', letter: 'C', text: 'By increasing damage to forests and coastal areas.' },
    ],
    correctChoiceId: 'choice-B',
    explanation:
      'Seed-firing and sensor-equipped drones can replant steep deforested mountains and track seedling survival rates efficiently.',
  },
  {
    id: 'fut-q-env-2',
    categoryId: 'environmental',
    artifactId: 'fut-env-drone-reforestation',
    questionText: 'Which areas could benefit from drone-assisted restoration?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Shopping centers and industrial buildings only.' },
      { id: 'choice-B', letter: 'B', text: 'Indoor entertainment facilities.' },
      { id: 'choice-C', letter: 'C', text: 'Mangroves, forests, and damaged marine habitats.' },
    ],
    correctChoiceId: 'choice-C',
    explanation:
      'Coastal mangroves, upland watersheds, and coral reefs benefit from precision aerial mapping and ecological restoration missions.',
  },

  // 4. Political Archive (Future 2030-2040)
  {
    id: 'fut-q-pol-1',
    categoryId: 'political',
    artifactId: 'fut-pol-deepfake-detection',
    questionText: 'Why could deepfake detection become important in Philippine civic life?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Because AI-generated videos and cloned voices could make misinformation harder to identify.' },
      { id: 'choice-B', letter: 'B', text: 'Because all AI-generated content is automatically accurate.' },
      { id: 'choice-C', letter: 'C', text: 'Because digital platforms will no longer allow people to share information.' },
    ],
    correctChoiceId: 'choice-A',
    explanation:
      'Hyper-realistic AI synthetics can impersonate public officials or fabricate statements, requiring robust detection technologies.',
  },
  {
    id: 'fut-q-pol-2',
    categoryId: 'political',
    artifactId: 'fut-pol-deepfake-detection',
    questionText: 'What is the purpose of digital authentication?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'To make it easier to spread unverified videos and recordings.' },
      { id: 'choice-B', letter: 'B', text: 'To remove all digital content from online platforms.' },
      { id: 'choice-C', letter: 'C', text: 'To help verify the origin and authenticity of public content.' },
    ],
    correctChoiceId: 'choice-C',
    explanation:
      'Digital provenance signatures and cryptographic timestamps ensure citizens and journalists can verify authentic media origins.',
  },

  // 5. Social Archive (Future 2030-2040)
  {
    id: 'fut-q-soc-1',
    categoryId: 'social',
    artifactId: 'fut-soc-hologram-family',
    questionText: 'How could hologram family hubs help Filipino families with members working overseas?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'By replacing all family relationships with automated systems.' },
      { id: 'choice-B', letter: 'B', text: 'By preventing overseas family members from communicating.' },
      { id: 'choice-C', letter: 'C', text: 'By creating a stronger sense of presence during remote family conversations.' },
    ],
    correctChoiceId: 'choice-C',
    explanation:
      'Life-sized 3D holographic projection enables eye contact and spatial depth, making families feel like they are in the same room together.',
  },
  {
    id: 'fut-q-soc-2',
    categoryId: 'social',
    artifactId: 'fut-soc-hologram-family',
    questionText: 'What technology could make these future family connections possible?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Traditional letters and printed photographs only.' },
      { id: 'choice-B', letter: 'B', text: 'Advanced 3D communication and virtual meeting systems.' },
      { id: 'choice-C', letter: 'C', text: 'Radio communication without visual features.' },
    ],
    correctChoiceId: 'choice-B',
    explanation:
      'Volumetric video capture arrays, high-speed low-latency broadband, and 3D light-field displays power future holographic family hubs.',
  },
];
