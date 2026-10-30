import { Category, Artifact, QuizQuestion } from '../types';

export const PRESENT_CATEGORIES: Category[] = [
  {
    id: 'cultural',
    name: 'CULTURAL',
    summary: 'Explore the music, television, fashion, entertainment, and trends shaping Filipino popular culture in 2026.',
    fullDescription:
      'The Cultural Archive explores the music, television, fashion, entertainment, and trends shaping Filipino popular culture in 2026. Filipino artists continue to influence local entertainment while global platforms make international music, films, and fashion more accessible. Social media also helps new trends spread quickly among Filipino audiences.',
    accentColor: '#F59E0B',
    bannerImageUrl: '', // Left blank for present time as requested
    referenceLinks: [
      {
        id: 'ref-pres-cult-1',
        title: 'SAGE Journals (Media International Australia Article on Philippine Pop Culture & P-Pop)',
        url: 'https://journals.sagepub.com/doi/10.1177/1329878X20985960',
      },
      {
        id: 'ref-pres-cult-2',
        title: 'Billboard Philippines (P-Pop Feature Article)',
        url: 'https://billboardphilippines.com/music/features/p-pop-groups-sb19-bini-alamat-filipino-music-industry/',
      },
    ],
  },
  {
    id: 'economic',
    name: 'ECONOMIC',
    summary: 'Explore how digital payments, online shopping, employment, and content creation influence the Philippine economy in 2026.',
    fullDescription:
      'The Economic Archive explores how digital payments, online shopping, employment, and content creation influence the Philippine economy in 2026. Technology allows businesses to reach customers online and gives consumers more ways to purchase products and services. These changes also create new opportunities and challenges for Filipino workers and entrepreneurs.',
    accentColor: '#10B981',
    bannerImageUrl: '', // Left blank for present time as requested
    referenceLinks: [
      {
        id: 'ref-pres-econ-1',
        title: 'Philippine Statistics Authority (Digital Economy Satellite Accounts Report)',
        url: 'https://psa.gov.ph/system/files/sad/Press%20Release%2C%202024%20Philippine%20Digital%20Economy%20Satellite%20Account.pdf',
      },
      {
        id: 'ref-pres-econ-2',
        title: 'Bangko Sentral ng Pilipinas (Digital Payments Transformation Roadmap)',
        url: 'https://www.bsp.gov.ph/Media_And_Research/Primers%20Faqs/Digital%20Payments%20Transformation%20Roadmap%20Report.pdf',
      },
    ],
  },
  {
    id: 'environmental',
    name: 'ENVIRONMENTAL',
    summary: 'Explore environmental issues affecting Filipino communities in 2026.',
    fullDescription:
      'The Environmental Archive explores environmental issues affecting Filipino communities in 2026. Climate change, flooding, waste management, and pollution remain important concerns. Communities, government agencies, and environmental groups use public campaigns and digital platforms to share information and encourage environmental action.',
    accentColor: '#84CC16',
    bannerImageUrl: '', // Left blank for present time as requested
    referenceLinks: [
      {
        id: 'ref-pres-env-1',
        title: 'DENR (Ecological Solid Waste Management Act RA 9003 Guidelines)',
        url: 'https://faspselib.denr.gov.ph/Materials/Detail/5b0a2f72-1bfa-4176-955b-822f90429ca6',
      },
      {
        id: 'ref-pres-env-2',
        title: 'PAGASA-DOST (Flood Learning and Preparedness Tools)',
        url: 'https://pagasa.dost.gov.ph/learning-tools/floods',
      },
    ],
  },
  {
    id: 'political',
    name: 'POLITICAL',
    summary: 'Explore how Filipinos receive political information, discuss public issues, and participate in civic activities in 2026.',
    fullDescription:
      'The Political Archive explores how Filipinos receive political information, discuss public issues, and participate in civic activities in 2026. Social media and digital communication allow politicians, organizations, and citizens to share information quickly. These platforms also create challenges involving misinformation, misleading content, and responsible media use.',
    accentColor: '#EF4444',
    bannerImageUrl: '', // Left blank for present time as requested
    referenceLinks: [
      {
        id: 'ref-pres-pol-1',
        title: 'Commission on Elections (COMELEC Resolution No. 11064-A on Digital Campaign Guidelines, AI, & Disinformation)',
        url: 'https://www.comelec.gov.ph/index.html?r=2025NLE/Resolutions/res11064A',
      },
      {
        id: 'ref-pres-pol-2',
        title: 'Rappler Investigative & Fact-Check Hub',
        url: 'https://www.rappler.com/section/newsbreak/fact-check/',
      },
    ],
  },
  {
    id: 'social',
    name: 'SOCIAL',
    summary: 'Explore how Filipinos communicate, build relationships, study, and spend their free time in 2026.',
    fullDescription:
      'The Social Archive explores how Filipinos communicate, build relationships, study, and spend their free time in 2026. Smartphones, messaging apps, social media, and online communities influence everyday interactions. These technologies make communication easier but also raise concerns about privacy, screen time, and online behavior.',
    accentColor: '#06B6D4',
    bannerImageUrl: '', // Left blank for present time as requested
    referenceLinks: [
      {
        id: 'ref-pres-soc-1',
        title: 'DataReportal (Digital 2026 Philippines Overview)',
        url: 'https://datareportal.com/reports/digital-2026-philippines',
      },
      {
        id: 'ref-pres-soc-2',
        title: 'GSMA Intelligence Report (Mobile Connectivity & Social Media in Developing Asia)',
        url: 'https://www.gsmaintelligence.com/blogs/universal-connectivity-in-asia-pacific-the-230-billion-opportunity',
      },
    ],
  },
];

export const PRESENT_ARTIFACTS: Artifact[] = [
  // 1. Cultural Archive (2026)
  {
    id: 'pres-cult-ppop',
    categoryId: 'cultural',
    title: 'P-Pop and Filipino Music',
    description:
      'P-pop has become a visible part of modern Filipino entertainment. Filipino pop groups use music releases, choreography, performances, and social media to connect with local and international audiences. Fan communities also help promote songs and support their favorite artists.',
    notes:
      'P-pop represents how Filipino artists combine local identity with modern pop music and digital promotion.',
    imageUrl: 'https://img.youtube.com/vi/DnMS8qnPFEo/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/DnMS8qnPFEo',
    videoTitle: 'P-Pop and Filipino Music',
    videos: [
      {
        id: 'vid-pres-cult-1',
        url: 'https://www.youtube.com/embed/DnMS8qnPFEo',
        title: 'P-Pop and Filipino Music',
      },
    ],
  },
  {
    id: 'pres-cult-streaming',
    categoryId: 'cultural',
    title: 'Streaming Platforms',
    description:
      'Streaming platforms allow Filipinos to watch films, television series, and listen to music through internet-connected devices. People can access entertainment at different times instead of depending only on television schedules or physical media.',
    notes:
      'Streaming reflects how technology has changed the way Filipinos discover and enjoy entertainment.',
    imageUrl: 'https://img.youtube.com/vi/aDatQSELa9c/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/aDatQSELa9c',
    videoTitle: 'Streaming Platforms',
    videos: [
      {
        id: 'vid-pres-cult-2',
        url: 'https://www.youtube.com/embed/aDatQSELa9c',
        title: 'Streaming Platforms',
      },
    ],
  },
  {
    id: 'pres-cult-memes',
    categoryId: 'cultural',
    title: 'Filipino Internet Memes',
    description:
      'Memes are a popular way for Filipinos to share humor, reactions, and opinions online. They often use Filipino expressions, relatable experiences, and current events. Social media allows these jokes to spread quickly across different online communities.',
    notes:
      'Internet memes show how humor and language continue to shape Filipino popular culture in digital spaces.',
    imageUrl: 'https://img.youtube.com/vi/MBM6hrF0CAI/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/MBM6hrF0CAI',
    videoTitle: 'Filipino Internet Memes',
    videos: [
      {
        id: 'vid-pres-cult-3',
        url: 'https://www.youtube.com/embed/MBM6hrF0CAI',
        title: 'Filipino Internet Memes',
      },
    ],
  },
  {
    id: 'pres-cult-fashion',
    categoryId: 'cultural',
    title: 'Digital Fashion Trends',
    description:
      'Fashion trends spread through social media creators, online stores, celebrity outfits, and international influences. Filipinos use clothing and accessories to express their interests, personalities, and identities.',
    notes:
      'Digital fashion trends show how online platforms influence modern clothing choices and self-expression.',
    imageUrl: 'https://img.youtube.com/vi/LESxHdCYJgU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/LESxHdCYJgU',
    videoTitle: 'Digital Fashion Trends',
    videos: [
      {
        id: 'vid-pres-cult-4',
        url: 'https://www.youtube.com/embed/LESxHdCYJgU',
        title: 'Digital Fashion Trends',
      },
    ],
  },

  // 2. Economic Archive (2026)
  {
    id: 'pres-econ-ewallets',
    categoryId: 'economic',
    title: 'E-Wallets and QR Payments',
    description:
      'Digital wallets and QR payments allow Filipinos to pay for purchases using mobile devices. These methods are used in stores, restaurants, online shops, and other businesses that support digital transactions.',
    notes:
      'Digital payments show how technology is changing everyday financial transactions in the Philippines.',
    imageUrl: 'https://img.youtube.com/vi/1fu6SbNypds/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/1fu6SbNypds',
    videoTitle: 'E-Wallets and QR Payments',
    videos: [
      {
        id: 'vid-pres-econ-1',
        url: 'https://www.youtube.com/embed/1fu6SbNypds',
        title: 'E-Wallets and QR Payments',
      },
    ],
  },
  {
    id: 'pres-econ-online-shopping',
    categoryId: 'economic',
    title: 'Online Shopping and Livestream Selling',
    description:
      'Online shopping platforms allow customers to browse and purchase products without visiting physical stores. Livestream selling adds live demonstrations and real-time interaction between sellers and buyers.',
    notes:
      'Online shopping gives businesses more ways to reach customers and changes how Filipinos discover and buy products.',
    imageUrl: 'https://img.youtube.com/vi/LbUYo_5I16s/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/LbUYo_5I16s',
    videoTitle: 'Online Shopping and Livestream Selling',
    videos: [
      {
        id: 'vid-pres-econ-2',
        url: 'https://www.youtube.com/embed/LbUYo_5I16s',
        title: 'Online Shopping and Livestream Selling',
      },
    ],
  },
  {
    id: 'pres-econ-content-creation',
    categoryId: 'economic',
    title: 'Content Creation as Income',
    description:
      'Some Filipinos earn income by producing online videos, livestreaming, promoting products, or working with brands. Social media platforms have created new opportunities for people to build audiences and offer digital content.',
    notes:
      'Content creation demonstrates how online entertainment can also become a source of income.',
    imageUrl: 'https://img.youtube.com/vi/PlLdbVGHx7Q/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/PlLdbVGHx7Q',
    videoTitle: 'Content Creation as Income',
    videos: [
      {
        id: 'vid-pres-econ-3',
        url: 'https://www.youtube.com/embed/PlLdbVGHx7Q',
        title: 'Content Creation as Income',
      },
    ],
  },
  {
    id: 'pres-econ-ai-work',
    categoryId: 'economic',
    title: 'Artificial Intelligence at Work',
    description:
      'AI tools can help workers and businesses with writing, research, customer support, and organizing information. Their use is changing how some tasks are completed while raising questions about accuracy, employment, and the skills people need.',
    notes:
      'AI in the workplace represents the growing relationship between technology, productivity, and employment.',
    imageUrl: 'https://img.youtube.com/vi/Zyl_f4Hqb8Y/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/Zyl_f4Hqb8Y',
    videoTitle: 'Artificial Intelligence at Work',
    videos: [
      {
        id: 'vid-pres-econ-4',
        url: 'https://www.youtube.com/embed/Zyl_f4Hqb8Y',
        title: 'Artificial Intelligence at Work',
      },
    ],
  },

  // 3. Environmental Archive (2026)
  {
    id: 'pres-env-climate-awareness',
    categoryId: 'environmental',
    title: 'Online Climate Change Awareness',
    description:
      'Social media helps spread information about climate change, environmental protection, and sustainable living. Videos, infographics, and online campaigns allow organizations and individuals to reach wider audiences.',
    notes:
      'Digital environmental campaigns show how online communication can support public awareness.',
    imageUrl: 'https://img.youtube.com/vi/yNhoWv2IJrU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/yNhoWv2IJrU',
    videoTitle: 'Online Climate Change Awareness',
    videos: [
      {
        id: 'vid-pres-env-1',
        url: 'https://www.youtube.com/embed/yNhoWv2IJrU',
        title: 'Online Climate Change Awareness',
      },
    ],
  },
  {
    id: 'pres-env-flood-prep',
    categoryId: 'environmental',
    title: 'Flooding and Disaster Preparedness',
    description:
      'Flooding and severe weather affect many communities in the Philippines. Weather updates, emergency alerts, and preparedness guides help people understand possible risks and take precautions during dangerous conditions.',
    notes:
      'Disaster preparedness highlights the importance of timely information and community readiness.',
    imageUrl: 'https://img.youtube.com/vi/WkP_C09CoPA/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/WkP_C09CoPA',
    videoTitle: 'Flooding and Disaster Preparedness',
    videos: [
      {
        id: 'vid-pres-env-2',
        url: 'https://www.youtube.com/embed/WkP_C09CoPA',
        title: 'Flooding and Disaster Preparedness',
      },
    ],
  },
  {
    id: 'pres-env-plastic-waste',
    categoryId: 'environmental',
    title: 'Plastic Waste and Sustainable Living',
    description:
      'Plastic waste remains an environmental concern in the Philippines. Waste segregation, reusable products, recycling, and reducing single-use plastics are among the practices promoted to reduce waste.',
    notes:
      'Sustainable living encourages people to consider how their everyday choices affect the environment.',
    imageUrl: 'https://img.youtube.com/vi/WzotakTAbAo/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/WzotakTAbAo',
    videoTitle: 'Plastic Waste and Sustainable Living',
    videos: [
      {
        id: 'vid-pres-env-3',
        url: 'https://www.youtube.com/embed/WzotakTAbAo',
        title: 'Plastic Waste and Sustainable Living',
      },
    ],
  },
  {
    id: 'pres-env-cleanup-projects',
    categoryId: 'environmental',
    title: 'Community Clean-Up Projects',
    description:
      'Community clean-ups, tree planting, and local environmental projects encourage people to take part in protecting their surroundings. These activities can bring residents, schools, and organizations together to address environmental concerns.',
    notes:
      'Community projects show how local participation can support environmental protection.',
    imageUrl: 'https://img.youtube.com/vi/W2VHpI0wx5c/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/W2VHpI0wx5c',
    videoTitle: 'Community Clean-Up Projects',
    videos: [
      {
        id: 'vid-pres-env-4',
        url: 'https://www.youtube.com/embed/W2VHpI0wx5c',
        title: 'Community Clean-Up Projects',
      },
    ],
  },

  // 4. Political Archive (2026)
  {
    id: 'pres-pol-social-media',
    categoryId: 'political',
    title: 'Political Communication on Social Media',
    description:
      'Politicians and public officials use social media to share announcements, discuss policies, and communicate with citizens. People can respond through comments, shares, and online discussions.',
    notes:
      'Social media has become an important space for public communication and political discussion.',
    imageUrl: 'https://img.youtube.com/vi/b72kJMlFeqU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/b72kJMlFeqU',
    videoTitle: 'Political Communication on Social Media',
    videos: [
      {
        id: 'vid-pres-pol-1',
        url: 'https://www.youtube.com/embed/b72kJMlFeqU',
        title: 'Political Communication on Social Media',
      },
    ],
  },
  {
    id: 'pres-pol-fake-news-ai',
    categoryId: 'political',
    title: 'Fake News and AI-Generated Content',
    description:
      'Misleading posts, edited images, and AI-generated videos can make false information appear believable. People need to examine sources, check evidence, and compare reports before sharing information online.',
    notes:
      'Misinformation highlights the importance of critical thinking and responsible digital participation.',
    imageUrl: 'https://img.youtube.com/vi/hY7tG4qB8DU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/hY7tG4qB8DU',
    videoTitle: 'Fake News and AI-Generated Content',
    videos: [
      {
        id: 'vid-pres-pol-2',
        url: 'https://www.youtube.com/embed/hY7tG4qB8DU',
        title: 'Fake News and AI-Generated Content',
      },
    ],
  },
  {
    id: 'pres-pol-online-activism',
    categoryId: 'political',
    title: 'Online Activism',
    description:
      'Online activism uses social media posts, hashtags, digital petitions, and online communities to raise awareness about public issues. These tools allow people to share concerns and encourage others to participate in discussions or activities.',
    notes:
      'Digital activism shows how technology can help citizens express opinions and organize around shared causes.',
    imageUrl: 'https://img.youtube.com/vi/1RdBXhpd2nw/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/1RdBXhpd2nw',
    videoTitle: 'Online Activism',
    videos: [
      {
        id: 'vid-pres-pol-3',
        url: 'https://www.youtube.com/embed/1RdBXhpd2nw',
        title: 'Online Activism',
      },
    ],
  },
  {
    id: 'pres-pol-fact-checking',
    categoryId: 'political',
    title: 'Fact-Checking and Media Literacy',
    description:
      'Fact-checking involves examining claims and comparing them with reliable evidence. Media literacy helps people identify misleading information, understand different perspectives, and make informed decisions about what they read online.',
    notes:
      'These skills are important when people encounter political news and public claims on digital platforms.',
    imageUrl: 'https://img.youtube.com/vi/vaQVzfhJdEc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/vaQVzfhJdEc',
    videoTitle: 'Fact-Checking and Media Literacy',
    videos: [
      {
        id: 'vid-pres-pol-4',
        url: 'https://www.youtube.com/embed/vaQVzfhJdEc',
        title: 'Fact-Checking and Media Literacy',
      },
    ],
  },

  // 5. Social Archive (2026)
  {
    id: 'pres-soc-tiktok',
    categoryId: 'social',
    title: 'TikTok and Short-Form Videos',
    description:
      'Short-form videos allow Filipinos to share entertainment, humor, daily experiences, and personal interests. Trends can spread quickly as users create their own versions of popular sounds, challenges, and video formats.',
    notes:
      'Short videos demonstrate how digital platforms influence communication and everyday entertainment.',
    imageUrl: 'https://img.youtube.com/vi/8xD0gtSo41w/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/8xD0gtSo41w',
    videoTitle: 'TikTok and Short-Form Videos',
    videos: [
      {
        id: 'vid-pres-soc-1',
        url: 'https://www.youtube.com/embed/8xD0gtSo41w',
        title: 'TikTok and Short-Form Videos',
      },
    ],
  },
  {
    id: 'pres-soc-group-chats',
    categoryId: 'social',
    title: 'Group Chats and Messaging Apps',
    description:
      'Messaging apps help families, classmates, coworkers, and friends communicate through text, calls, photos, and group conversations. They are also used for school announcements, work coordination, and community updates.',
    notes:
      'Messaging apps show how digital communication has become part of daily life.',
    imageUrl: 'https://img.youtube.com/vi/_oi6VwggYAU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/_oi6VwggYAU',
    videoTitle: 'Group Chats and Messaging Apps',
    videos: [
      {
        id: 'vid-pres-soc-2',
        url: 'https://www.youtube.com/embed/_oi6VwggYAU',
        title: 'Group Chats and Messaging Apps',
      },
    ],
  },
  {
    id: 'pres-soc-gaming',
    categoryId: 'social',
    title: 'Online Gaming Communities',
    description:
      'Online games connect Filipino players through team activities, competitions, and shared interests. Players can communicate during games and participate in communities that extend beyond the game itself.',
    notes:
      'Gaming communities combine entertainment, teamwork, and social interaction.',
    imageUrl: 'https://img.youtube.com/vi/XQ4lJqZHDGM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/XQ4lJqZHDGM',
    videoTitle: 'Online Gaming Communities',
    videos: [
      {
        id: 'vid-pres-soc-3',
        url: 'https://www.youtube.com/embed/XQ4lJqZHDGM',
        title: 'Online Gaming Communities',
      },
    ],
  },
  {
    id: 'pres-soc-digital-identity',
    categoryId: 'social',
    title: 'Digital Identity and Influencers',
    description:
      'Filipinos use social media profiles to express their interests, share experiences, and interact with others. Influencers can affect trends, product choices, and how audiences think about lifestyle and self-presentation.',
    notes:
      'Digital identity shows how people manage their public image and relationships in online spaces.',
    imageUrl: 'https://img.youtube.com/vi/itEpFhEFF4I/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/itEpFhEFF4I',
    videoTitle: 'Digital Identity and Influencers',
    videos: [
      {
        id: 'vid-pres-soc-4',
        url: 'https://www.youtube.com/embed/itEpFhEFF4I',
        title: 'Digital Identity and Influencers',
      },
    ],
  },
];

export const PRESENT_QUESTIONS: QuizQuestion[] = [
  // 1. Cultural Archive (2026)
  {
    id: 'pres-q-cult-1',
    categoryId: 'cultural',
    artifactId: 'pres-cult-ppop',
    questionText: 'What helps P-pop groups connect with local and international audiences?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Music releases, performances, and social media' },
      { id: 'choice-B', letter: 'B', text: 'Avoiding online platforms' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Music releases, live performances, and active social media presence help P-pop artists connect with fans globally.',
  },
  {
    id: 'pres-q-cult-2',
    categoryId: 'cultural',
    artifactId: 'pres-cult-streaming',
    questionText: 'How do streaming platforms change entertainment?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'They require people to follow television schedules' },
      { id: 'choice-B', letter: 'B', text: 'They let people access music, films, and series through the internet' },
    ],
    correctChoiceId: 'choice-B',
    explanation: 'Streaming platforms allow users on-demand access to movies, series, and songs whenever they want.',
  },

  // 2. Economic Archive (2026)
  {
    id: 'pres-q-econ-1',
    categoryId: 'economic',
    artifactId: 'pres-econ-ewallets',
    questionText: 'How do e-wallets and QR payments help Filipinos?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'They allow people to pay digitally using mobile devices' },
      { id: 'choice-B', letter: 'B', text: 'They only allow payments using physical cash' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Digital wallets and QR codes make payments convenient, fast, and secure through smartphones.',
  },
  {
    id: 'pres-q-econ-2',
    categoryId: 'economic',
    artifactId: 'pres-econ-content-creation',
    questionText: 'How can content creation become a source of income?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'By avoiding audiences and online platforms' },
      { id: 'choice-B', letter: 'B', text: 'By creating videos, livestreaming, and promoting products' },
    ],
    correctChoiceId: 'choice-B',
    explanation: 'Online creators earn income through advertising, livestream gifts, and commercial brand collaborations.',
  },

  // 3. Environmental Archive (2026)
  {
    id: 'pres-q-env-1',
    categoryId: 'environmental',
    artifactId: 'pres-env-climate-awareness',
    questionText: 'How can social media help environmental protection?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'By spreading awareness about climate change and sustainable living' },
      { id: 'choice-B', letter: 'B', text: 'By preventing people from learning about environmental issues' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Social media reaches broad audiences with infographics, alerts, and sustainable living tips.',
  },
  {
    id: 'pres-q-env-2',
    categoryId: 'environmental',
    artifactId: 'pres-env-plastic-waste',
    questionText: 'What is one way to reduce plastic waste?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Using more single-use plastics' },
      { id: 'choice-B', letter: 'B', text: 'Using reusable products and practicing recycling' },
    ],
    correctChoiceId: 'choice-B',
    explanation: 'Using reusable alternatives and separating recyclables keeps plastic out of landfills and waterways.',
  },

  // 4. Political Archive (2026)
  {
    id: 'pres-q-pol-1',
    categoryId: 'political',
    artifactId: 'pres-pol-fact-checking',
    questionText: 'Why is fact-checking important when reading political information online?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'It helps people verify claims using reliable evidence' },
      { id: 'choice-B', letter: 'B', text: 'It encourages people to share information without checking it' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Fact-checking verifies information against credible sources, protecting the public from misinformation.',
  },
  {
    id: 'pres-q-pol-2',
    categoryId: 'political',
    artifactId: 'pres-pol-online-activism',
    questionText: 'What is online activism?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'Using digital platforms to raise awareness about public issues' },
      { id: 'choice-B', letter: 'B', text: 'Avoiding public discussions and community concerns' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Online activism uses social media, hashtags, and digital campaigns to advocate for social change.',
  },

  // 5. Social Archive (2026)
  {
    id: 'pres-q-soc-1',
    categoryId: 'social',
    artifactId: 'pres-soc-group-chats',
    questionText: 'How do messaging apps help Filipinos in daily life?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'They prevent communication between families and classmates' },
      { id: 'choice-B', letter: 'B', text: 'They allow people to exchange messages, photos, and calls' },
    ],
    correctChoiceId: 'choice-B',
    explanation: 'Messaging applications provide instant communication, group chats, and file sharing for daily coordination.',
  },
  {
    id: 'pres-q-soc-2',
    categoryId: 'social',
    artifactId: 'pres-soc-digital-identity',
    questionText: 'How can influencers affect Filipino audiences?',
    choices: [
      { id: 'choice-A', letter: 'A', text: 'They can influence trends, product choices, and lifestyle interests' },
      { id: 'choice-B', letter: 'B', text: 'They have no effect on people\'s interests or choices' },
    ],
    correctChoiceId: 'choice-A',
    explanation: 'Digital influencers shape purchasing choices, style trends, and online conversations among followers.',
  },
];
