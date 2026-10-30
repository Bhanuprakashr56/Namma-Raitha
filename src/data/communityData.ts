import { ChatMessage, FarmerExperience } from '../types/nammaraitha';

export interface ChatChannel {
  id: string;
  name: string;
  nameKn: string;
  icon: string;
  description: string;
  activeCount: number;
}

export const CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'queries',
    name: 'Farmer Queries & Solutions',
    nameKn: 'ರೈತರ ಪ್ರಶ್ನೋತ್ತರ & ಪರಿಹಾರ ವೇದಿಕೆ',
    icon: '❓',
    description: 'Post any urgent farming doubts, crop ailments, seed queries, and get answers from fellow farmers & specialists.',
    activeCount: 164
  },
  {
    id: 'general',
    name: 'General Farm Talk & Gossip',
    nameKn: 'ಸಾಮಾನ್ಯ ಕೃಷಿ ಹರಟೆ & ಸಮಾಚಾರ',
    icon: '🌾',
    description: 'Share daily farm updates, crop progress, and general village discussions.',
    activeCount: 148
  },
  {
    id: 'pest-alert',
    name: 'Pest & Disease Alert Hub',
    nameKn: 'ಕೀಟ ಬಾಧೆ & ರೋಗ ಎಚ್ಚರಿಕೆ',
    icon: '🐛',
    description: 'Urgent warnings on bollworms, blast, borers, and sudden field infestations.',
    activeCount: 92
  },
  {
    id: 'market-trade',
    name: 'Mandi Rates & Direct Trading',
    nameKn: 'ಮಾರುಕಟ್ಟೆ ದರ & ನೇರ ವ್ಯಾಪಾರ',
    icon: '💰',
    description: 'Bargain produce rates, discuss APMC auctions, and find direct bulk buyers.',
    activeCount: 115
  },
  {
    id: 'machinery',
    name: 'Tractor & Harvester Sharing',
    nameKn: 'ಯಂತ್ರೋಪಕರಣ & ಬಾಡಿಗೆ ಹಂಚಿಕೆ',
    icon: '🚜',
    description: 'Rent power tillers, sprayers, rotavators, and combine harvesters locally.',
    activeCount: 64
  },
  {
    id: 'organic',
    name: 'ZBNF & Natural Organic Care',
    nameKn: 'ಸಾವಯವ & ನೈಸರ್ಗಿಕ ಕೃಷಿ',
    icon: '🌿',
    description: 'Formulations of Jeevamrutha, Beejamrutha, bio-fungicides and mulching.',
    activeCount: 81
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'query-1',
    channelId: 'queries',
    senderName: 'Manjunath Gowda',
    senderRole: 'Farmer',
    senderLocation: 'Maddur, Mandya',
    text: 'QUERY: My sugarcane leaves are showing reddish-brown lesions and yellowing from the midrib. What fertilizer or bio-spray will stop this spreading before next watering?',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a56?auto=format&fit=crop&w=600&q=80',
    timestamp: '10:05 AM',
    likes: 14,
    isQuery: true,
    queryCrop: 'Sugarcane',
    queryStatus: 'answered'
  },
  {
    id: 'query-reply-1',
    channelId: 'queries',
    senderName: 'Dr. Savitha Patil',
    senderRole: 'Agri Specialist',
    senderLocation: 'KVK Mandya',
    text: 'Manjunath avare, this is early red rot / fungal leaf scald triggered by stagnant furrow moisture. Immediately stop overhead flood irrigation and drench with Carbendazim 50% WP @ 1g/L or Trichoderma viride @ 5kg/acre enriched with farmyard manure.',
    timestamp: '10:12 AM',
    likes: 21,
    replyToId: 'query-1',
    replyToAuthor: 'Manjunath Gowda',
    replyToText: 'My sugarcane leaves are showing reddish-brown lesions...'
  },
  {
    id: 'query-2',
    channelId: 'queries',
    senderName: 'Shivanna',
    senderRole: 'Farmer',
    senderLocation: 'Chikballapur',
    text: 'QUERY: Can anyone suggest the best sowing time for hybrid tomato nursery seedlings this month? Will the morning dew affect flower fruit-set in Kolar/Chikballapur belt?',
    timestamp: '10:30 AM',
    likes: 9,
    isQuery: true,
    queryCrop: 'Tomato',
    queryStatus: 'open'
  },
  {
    id: 'msg-1',
    channelId: 'general',
    senderName: 'Somashekar Gowda',
    senderRole: 'Farmer',
    senderLocation: 'Pandavapura, Mandya',
    text: 'Namaskara brothers! Just started transplanting Sona Masoori paddy seedling today. Water release from KRS dam canal is steady this week.',
    timestamp: '10:15 AM',
    likes: 8
  },
  {
    id: 'msg-2',
    channelId: 'general',
    senderName: 'Dr. Savitha Patil',
    senderRole: 'Agri Specialist',
    senderLocation: 'KVK Shimoga',
    text: 'Farmers in Mandya and Hassan: remember to keep water depth below 2-3 inches during initial 10 days of transplanting to encourage vigorous tillering.',
    timestamp: '10:22 AM',
    likes: 19
  },
  {
    id: 'msg-3',
    channelId: 'pest-alert',
    senderName: 'Basavaraj Hiremath',
    senderRole: 'Progressive Grower',
    senderLocation: 'Ranebennur, Haveri',
    text: 'Alert for Byadgi chilli farmers: Thrips attack observed in 3 taluks due to dry humidity. Spray Neem oil (10,000 ppm) with blue sticky traps immediately before flower drop begins!',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    timestamp: '09:40 AM',
    likes: 27
  },
  {
    id: 'msg-4',
    channelId: 'pest-alert',
    senderName: 'Malleshappa',
    senderRole: 'Farmer',
    senderLocation: 'Davanagere',
    text: 'Thanks Basavaraj! What is the dosage per 16-liter knapsack sprayer tank?',
    timestamp: '09:55 AM',
    likes: 5
  },
  {
    id: 'msg-5',
    channelId: 'pest-alert',
    senderName: 'Basavaraj Hiremath',
    senderRole: 'Progressive Grower',
    senderLocation: 'Ranebennur, Haveri',
    text: 'Add 40ml of 10,000 PPM neem oil per 16L tank + 2 spoons of mild detergent/shampoo as sticker. Spray early morning before sun gets hot.',
    timestamp: '10:02 AM',
    likes: 31
  },
  {
    id: 'msg-6',
    channelId: 'market-trade',
    senderName: 'Venkatesh Rao',
    senderRole: 'Farmer',
    senderLocation: 'Kolar APMC',
    text: 'Today tomato 15kg crate trading at ₹320 - ₹380 for hybrid Grade-A in Kolar market. Delhi and Chennai merchant lorries are loading aggressively.',
    timestamp: '08:30 AM',
    likes: 22
  },
  {
    id: 'msg-7',
    channelId: 'machinery',
    senderName: 'Anand Kumar',
    senderRole: 'Farmer',
    senderLocation: 'Channarayapatna, Hassan',
    text: 'Have a 45HP John Deere tractor with 7-tine cultivator and laser leveler available for rent this weekend around CR Patna. Contact me if anyone needs field preparation.',
    timestamp: 'Yesterday',
    likes: 12
  },
  {
    id: 'msg-8',
    channelId: 'organic',
    senderName: 'Gururaj Kulkarni',
    senderRole: 'Progressive Grower',
    senderLocation: 'Dharwad',
    text: 'Prepared 200 liters of Ghana Jeevamrutha with Desi cow dung and jaggery. Applied as basal dose for sugarcane; soil earthworm count doubled within 30 days!',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Yesterday',
    likes: 34
  }
];

export const INITIAL_EXPERIENCES: FarmerExperience[] = [
  {
    id: 'exp-1',
    farmerName: 'Chennappa Gowda',
    village: 'Keragodu',
    district: 'Mandya (Karnataka)',
    phone: '+91 98451 88301',
    crop: 'Paddy (Sona Masoori & RNR 15048)',
    landAcreage: '4.5 Acres',
    technique: 'System of Rice Intensification (SRI) + Ghana Jeevamrutha',
    title: 'How I cut seed and water use by 60% and gained 34 Quintals/Acre yield',
    story: 'Four years ago I was spending ₹14,000 per acre on chemical urea, DAP, and repeated pesticide sprays for stem borer. My soil was hardening and yield stagnated at 24 quintals. In 2024 I shifted to SRI technique with single young seedling transplanting (12 days old) at 25cm square spacing with motorized cono-weeder. Every 15 days I applied 200 liters of liquid Jeevamrutha through irrigation water.',
    costSaved: '₹16,500 / Acre in chemical fertilizers',
    yieldGained: '+10 Quintals / Acre (Total 34 Quintals/Acre)',
    keyAdvice: 'Do not flood the field continuously. Alternate wetting and drying allows roots to breathe deeply and produce massive tillers.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    likes: 142,
    commentsCount: 28,
    date: '3 days ago',
    category: 'organic'
  },
  {
    id: 'exp-2',
    farmerName: 'Sunita & Mahadev Patil',
    village: 'Nippani',
    district: 'Belagavi (Karnataka)',
    phone: '+91 97410 44219',
    crop: 'Sugarcane (Co-86032)',
    landAcreage: '6 Acres',
    technique: 'Sub-Surface Drip Irrigation & Trash Mulching',
    title: 'Trash mulching doubled our drought survival during summer canal closure',
    story: 'During peak May heat when canal was shut for repair, neighboring sugarcane fields were drying. We had retained all previous harvest dry cane leaves (trash mulching 4 inches thick) and laid inline drip lines beneath. Soil temperature remained 8 degrees cooler, and evaporation was practically zero.',
    costSaved: 'Saved 65% power and water bills',
    yieldGained: 'Maintained 85 tons/acre without drought loss',
    keyAdvice: 'Never burn sugarcane trash! Spreading it between rows suppresses 90% of weeds and converts into rich organic carbon manure.',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
    likes: 189,
    commentsCount: 34,
    date: '5 days ago',
    category: 'water'
  },
  {
    id: 'exp-3',
    farmerName: 'Shankarappa K',
    village: 'Srinivaspur',
    district: 'Kolar (Karnataka)',
    phone: '+91 94482 12908',
    crop: 'Tomato (Arka Rakshak F1 Hybrid)',
    landAcreage: '2.5 Acres',
    technique: 'Trellis Staking with Fermented Dashaparni Spray',
    title: 'Controlled Leaf Curl and Fruit Rot without costly systemic chemicals',
    story: 'Heavy monsoon rains usually wiped out our tomato crop with buckeye rot. By installing GI wire trellising to keep plants elevated off the wet soil, air circulation improved dramatically. We sprayed Dashaparni Kashaya (made from 10 bitter plant leaves + cow urine) every 10 days. Leaf curl was negligible and fruit quality was export-grade.',
    costSaved: '₹22,000 saved on fungicide spray cocktails',
    yieldGained: 'Harvested 38 tons/acre with zero fruit rotting',
    keyAdvice: 'Staking tomatoes on wire trellis is 100% worth the initial investment. Sun reaches every cluster evenly.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    likes: 215,
    commentsCount: 41,
    date: '1 week ago',
    category: 'pest'
  }
];
