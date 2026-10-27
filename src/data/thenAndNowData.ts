export interface ThenAndNowItem {
  id: string; // e.g. 'cultural', 'economic', 'environmental', 'political', 'social'
  title: string; // e.g. 'Cultural Archive (Then & Now)'
  topicName: string; // e.g. 'Cultural'
  thenTitle: string; // 'Then (2000–2010):'
  thenContent: string;
  nowTitle: string; // 'Now (2026):'
  nowContent: string;
}

export const THEN_AND_NOW_DATA: Record<string, ThenAndNowItem> = {
  cultural: {
    id: 'cultural',
    title: 'Cultural Archive (Then & Now)',
    topicName: 'Cultural',
    thenTitle: 'Then (2000–2010):',
    thenContent:
      "Filipino popular culture was strongly influenced by television dramas, OPM, local rock bands, anime, fashion, and foreign entertainment. Many Filipinos watched scheduled TV programs, bought CDs, and listened to music on the radio. These forms of entertainment influenced people's interests, fashion, and childhood memories.",
    nowTitle: 'Now (2026):',
    nowContent:
      'Filipino popular culture spreads through streaming platforms, social media, and online videos. People can discover OPM, anime, international music, and new fashion trends through platforms like YouTube, TikTok, and Spotify. Traditional Filipino entertainment remains popular, but digital platforms make it easier to access and share.',
  },
  economic: {
    id: 'economic',
    title: 'Economic Archive (Then & Now)',
    topicName: 'Economic',
    thenTitle: 'Then (2000–2010):',
    thenContent:
      'Many Filipinos relied on sari-sari stores, shopping malls, cash payments, and traditional businesses for their daily needs. Overseas Filipino workers also supported their families through remittances. The BPO industry grew and provided employment opportunities connected to international businesses.',
    nowTitle: 'Now (2026):',
    nowContent:
      'Traditional businesses and overseas employment remain important, but digital technology has changed how people work and buy products. Online shopping, e-wallets, digital banking, and online businesses have become more common. These changes give people more ways to earn money and complete transactions.',
  },
  environmental: {
    id: 'environmental',
    title: 'Environmental Archive (Then & Now)',
    topicName: 'Environmental',
    thenTitle: 'Then (2000–2010):',
    thenContent:
      'Environmental concerns included flooding, pollution, improper waste disposal, and the effects of natural disasters. Events such as Typhoon Ondoy in 2009 showed how severe weather could affect communities. Schools and local organizations also promoted clean-up drives, recycling, and environmental awareness.',
    nowTitle: 'Now (2026):',
    nowContent:
      'Environmental protection continues to be important, especially as communities face flooding, plastic pollution, and other environmental challenges. People can now use social media and online platforms to spread awareness and organize environmental activities. Disaster alerts and weather updates are also easier to access through digital channels, although communities still face challenges in preparedness and response.',
  },
  political: {
    id: 'political',
    title: 'Political Archive (Then & Now)',
    topicName: 'Political',
    thenTitle: 'Then (2000–2010):',
    thenContent:
      'Political participation included elections, public rallies, television and radio news, newspapers, and community discussions. Events such as People Power II in 2001 showed how public protests could influence national politics. Mobile phones and text messaging also helped people share political information and coordinate with others.',
    nowTitle: 'Now (2026):',
    nowContent:
      'Filipinos can follow political news and discuss public issues through websites, social media, livestreams, and messaging apps. Online platforms make it easier to share opinions and organize activities, but misinformation and misleading content are also concerns. Checking sources and verifying information are important parts of political participation today.',
  },
  social: {
    id: 'social',
    title: 'Social Archive (Then & Now)',
    topicName: 'Social',
    thenTitle: 'Then (2000–2010):',
    thenContent:
      'Filipinos commonly communicated through face-to-face conversations, phone calls, text messages, and early social networking websites. Internet cafés provided access to online games, chat rooms, email, and social networking for people without internet access at home. These technologies changed how friends and families stayed connected.',
    nowTitle: 'Now (2026):',
    nowContent:
      'People use smartphones, messaging apps, video calls, and social media to communicate throughout the day. Online communities make it easier to maintain relationships and meet people with similar interests. However, digital communication also brings concerns such as online bullying, privacy, and spending too much time on screens.',
  },
};
