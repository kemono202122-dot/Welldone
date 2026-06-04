
import { 
  User, Group, Challenge, Event, FriendRequest, Conversation, Notification, 
  HeroSlide, TravelPlan, Booking, AdCampaign, MeetingSpot 
} from './types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    interests: ['Yoga', 'Hiking', 'Meditation'],
    goals: [],
    bio: 'Love to travel and find peace.',
    friends: ['user2', 'user3'],
    moodHistory: [],
    role: 'user',
    status: 'active',
    hasCompletedOnboarding: true,
    virtualBalance: 500,
    occupation: 'Graphic Designer',
    gallery: [],
    socialMediaLinks: {},
    preferences: {
        language: 'English',
        currency: 'USD',
        units: 'metric',
        timezone: 'UTC',
        fontSize: 'medium',
        reducedMotion: false
    }
  },
  {
    id: 'user2',
    name: 'Mike Ross',
    email: 'mike@example.com',
    avatar: 'https://picsum.photos/seed/mike/200/200',
    interests: ['Running', 'Cooking'],
    goals: [],
    bio: 'Always on the run.',
    friends: ['user1'],
    moodHistory: [],
    role: 'user',
    status: 'active',
    hasCompletedOnboarding: true,
    virtualBalance: 200,
    occupation: 'Chef',
    gallery: []
  },
  {
    id: 'user3',
    name: 'Emma Watson',
    email: 'emma@example.com',
    avatar: 'https://picsum.photos/seed/emma/200/200',
    interests: ['Reading', 'Yoga'],
    goals: [],
    bio: 'Books are magic.',
    friends: ['user1'],
    moodHistory: [],
    role: 'user',
    status: 'active',
    hasCompletedOnboarding: true,
    virtualBalance: 800,
    occupation: 'Writer',
    gallery: []
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@welldone.com',
    avatar: 'https://picsum.photos/seed/admin/200/200',
    interests: [],
    goals: [],
    bio: 'System Administrator',
    friends: [],
    moodHistory: [],
    role: 'admin',
    status: 'active',
    hasCompletedOnboarding: true,
    virtualBalance: 9999,
    occupation: 'Admin',
    gallery: []
  }
];

export const mockGroups: Group[] = [
  {
    id: 'group1',
    name: 'Morning Yoga Circle',
    image: 'https://picsum.photos/seed/yoga_group/400/300',
    description: 'Start your day with zen and gentle movement. We meet every morning to flow, breathe, and ground ourselves before the day begins.',
    interests: ['Yoga', 'Meditation', 'Breathwork'],
    members: ['user1', 'user3', 'user2']
  },
  {
    id: 'group2',
    name: 'Mindful Hikers',
    image: 'https://picsum.photos/seed/hiking_group/400/300',
    description: 'Explore nature trails while practicing mindfulness. We hike with intention, leaving phones behind and connecting with the earth.',
    interests: ['Hiking', 'Nature', 'Wellness'],
    members: ['user2', 'user4', 'user5', 'user1']
  },
  {
    id: 'group3',
    name: 'Plant-Based Kitchen',
    image: 'https://picsum.photos/seed/cooking_group/400/300',
    description: 'Share plant-based recipes, cooking tips, and meal prep strategies. From beginners to seasoned cooks, all are welcome.',
    interests: ['Cooking', 'Nutrition', 'Sustainability'],
    members: ['user3', 'user5']
  },
  {
    id: 'group4',
    name: 'Runner\'s Sanctuary',
    image: 'https://picsum.photos/seed/running_group/400/300',
    description: 'Whether you\'re training for a marathon or just starting your running journey, find your pace and your people here.',
    interests: ['Running', 'Fitness', 'Goals'],
    members: ['user1', 'user2', 'user4']
  },
  {
    id: 'group5',
    name: 'Digital Detox Collective',
    image: 'https://picsum.photos/seed/detox_group/400/300',
    description: 'Weekly challenges to unplug, be present, and rediscover offline joys. Monthly retreats and accountability check-ins.',
    interests: ['Mindfulness', 'Wellness', 'Reading'],
    members: ['user3', 'user5', 'user1', 'user2']
  },
  {
    id: 'group6',
    name: 'Sound Healers',
    image: 'https://picsum.photos/seed/sound_group/400/300',
    description: 'Explore the healing power of sound through gong baths, singing bowls, and vocal toning sessions. Open to all experience levels.',
    interests: ['Meditation', 'Music', 'Healing'],
    members: ['user4', 'user5']
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: 'chal1',
    name: '30 Days of Gratitude',
    image: 'https://picsum.photos/seed/gratitude/400/300',
    description: 'Write one thing you are grateful for every day.',
    reward: 'Gratitude Badge',
    participants: ['user1', 'user2']
  }
];

export const mockEvents: Event[] = [
  {
    id: 'evt1',
    name: 'Sunset Meditation & Sound Bath',
    image: 'https://picsum.photos/seed/sunset_med/400/300',
    description: 'Join us for a guided meditation followed by a 45-minute sound bath at the hilltop. Bring a mat and an open heart.',
    date: '2026-07-15T18:00:00Z',
    location: 'Hilltop Sanctuary, City Park',
    attendees: ['user1', 'user3', 'user2']
  },
  {
    id: 'evt2',
    name: 'Wellness Retreat Weekend',
    image: 'https://picsum.photos/seed/retreat_event/400/300',
    description: 'A full weekend of yoga, workshops, farm-to-table meals, and deep rest. Limited spots available for this immersive experience.',
    date: '2026-07-22T09:00:00Z',
    location: 'Green Valley Retreat Center',
    attendees: ['user2', 'user4']
  },
  {
    id: 'evt3',
    name: 'Mindful Morning Run',
    image: 'https://picsum.photos/seed/morning_run/400/300',
    description: 'A community 5K run through the botanical gardens followed by a breathwork session. All paces welcome.',
    date: '2026-07-08T06:30:00Z',
    location: 'Botanical Gardens Entrance',
    attendees: ['user1', 'user5', 'user3', 'user2']
  },
  {
    id: 'evt4',
    name: 'Plant-Based Cooking Masterclass',
    image: 'https://picsum.photos/seed/cooking_event/400/300',
    description: 'Learn to create nourishing, vibrant meals with Chef Alana. Hands-on cooking, tasting, and recipe booklet included.',
    date: '2026-07-30T14:00:00Z',
    location: 'The Sanctuary Kitchen, Downtown',
    attendees: ['user3', 'user4']
  },
  {
    id: 'evt5',
    name: 'Yin Yoga & Journaling',
    image: 'https://picsum.photos/seed/yin_yoga/400/300',
    description: 'A slow, restorative yoga session paired with guided journaling prompts to release tension and set intentions.',
    date: '2026-08-05T17:30:00Z',
    location: 'Lotus Studio, Midtown',
    attendees: ['user1', 'user2']
  },
  {
    id: 'evt6',
    name: 'Community Garden Day',
    image: 'https://picsum.photos/seed/garden_event/400/300',
    description: 'Get your hands in the earth. Help tend our community wellness garden and take home fresh herbs and produce.',
    date: '2026-08-12T10:00:00Z',
    location: 'Cereen Community Garden',
    attendees: ['user3', 'user5', 'user4']
  }
];

export const mockFriendRequests: FriendRequest[] = [
  {
    id: 'req1',
    senderId: 'user2',
    receiverId: 'user3',
    status: 'pending'
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: ['user1', 'user2'],
    messages: [
      {
        id: 'm1',
        senderId: 'user1',
        senderName: 'Sarah',
        text: 'Hey Mike! How was your run?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read'
      },
      {
        id: 'm2',
        senderId: 'user2',
        senderName: 'Mike',
        text: 'It was great! Did 5k.',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        status: 'read'
      }
    ],
    lastMessageTimestamp: new Date().toISOString()
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'user1',
    type: 'friend_request',
    message: 'Mike sent you a friend request.',
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

export const mockInterests = [
  { id: 'i1', name: 'Yoga' },
  { id: 'i2', name: 'Hiking' },
  { id: 'i3', name: 'Meditation' },
  { id: 'i4', name: 'Running' },
  { id: 'i5', name: 'Cooking' },
  { id: 'i6', name: 'Reading' },
  { id: 'i7', name: 'Travel' }
];

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/hero1/1600/900',
    title: 'Find Your Balance',
    subtitle: 'Connect with your inner self and the world around you.',
    theme: 'text-white'
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/hero2/1600/900',
    title: 'Explore Together',
    subtitle: 'Journeys are better when shared.',
    theme: 'text-white'
  }
];

export const mockTravelPlans: TravelPlan[] = [
  {
    id: 'tp1',
    name: 'Bali Retreat',
    description: 'A week of yoga and wellness in Ubud.',
    image: 'https://picsum.photos/seed/bali/400/300',
    location: 'Bali, Indonesia',
    dates: 'Aug 2024',
    wellnessFocus: ['Yoga', 'Detox']
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    userId: 'user1',
    userName: 'Sarah Jenkins',
    serviceName: 'Deep Tissue Massage',
    providerName: 'Mindful Soul Clinic',
    date: '2024-11-15',
    time: '14:00',
    status: 'confirmed',
    image: 'https://picsum.photos/seed/massage/100/100',
    price: '$80'
  }
];

export const mockAdCampaigns: AdCampaign[] = [
  {
    id: 'ad1',
    title: 'Summer Sale',
    image: 'https://picsum.photos/seed/summer_sale/400/200',
    link: '#'
  }
];

export const COUNTRIES = ['USA', 'Canada', 'UK', 'Australia', 'India', 'Japan', 'Germany', 'France', 'Brazil'];
export const CITIES_BY_COUNTRY: Record<string, string[]> = {
    'USA': ['New York', 'Los Angeles', 'Chicago', 'San Francisco'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal'],
    'UK': ['London', 'Manchester', 'Edinburgh'],
    'India': ['Mumbai', 'Delhi', 'Bangalore'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto'],
    'Germany': ['Berlin', 'Munich', 'Hamburg'],
    'France': ['Paris', 'Lyon', 'Marseille'],
    'Brazil': ['Sao Paulo', 'Rio de Janeiro']
};
export const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Hindi', 'Portuguese'];
export const RELIGIONS = ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Sikhism', 'Atheist', 'Agnostic', 'Spiritual'];
export const POLITICAL_VIEWS = ['Liberal', 'Conservative', 'Moderate', 'Libertarian', 'Green', 'Apolitical'];
export const PHILOSOPHIES = ['Stoicism', 'Existentialism', 'Nihilism', 'Utilitarianism', 'Humanism', 'Taoism'];
export const CURRENCIES = ['USD ($) - US Dollar', 'EUR (€) - Euro', 'GBP (£) - British Pound', 'JPY (¥) - Japanese Yen', 'CAD ($) - Canadian Dollar', 'AUD ($) - Australian Dollar', 'INR (₹) - Indian Rupee'];

export const MOCK_COMMUNITY_PULSE = [
    { id: 'cp1', user: 'Sarah', action: 'completed a 5k run', timeAgo: '2m ago', avatar: 'https://picsum.photos/seed/sarah/50/50' },
    { id: 'cp2', user: 'Mike', action: 'meditated for 20 mins', timeAgo: '15m ago', avatar: 'https://picsum.photos/seed/mike/50/50' },
    { id: 'cp3', user: 'Emma', action: 'joined "Book Club"', timeAgo: '1h ago', avatar: 'https://picsum.photos/seed/emma/50/50' }
];

export const MARKETPLACE_CATEGORIES: Record<string, string[]> = {
    'All': [],
    'Meditation & Yoga': ['Classes', 'Retreats', 'Equipment'],
    'Nutrition': ['Meal Plans', 'Supplements', 'Coaching'],
    'Services': ['Massage', 'Therapy', 'Life Coaching'],
    'Travel': ['Tours', 'Accommodations', 'Experiences']
};

export const SUCCESS_STORIES = [
    { id: 's1', couple: 'Jen & Mark', location: 'Kyoto', story: 'Met on Welldone and traveled Japan together.', image: 'https://picsum.photos/seed/couple1/400/300' },
    { id: 's2', couple: 'The Hiking Crew', location: 'Patagonia', story: 'A group of strangers became best friends on the trail.', image: 'https://picsum.photos/seed/group1/400/300' }
];

export const INITIAL_MEETING_SPOTS: MeetingSpot[] = [
  {
    id: 'spot1',
    name: 'The Alchemist',
    type: 'Cocktail Bar',
    location: 'London, UK',
    address: '63-66 St Martin\'s Ln',
    mapUrl: '#',
    vibe: 'Mystical',
    visualTheme: 'Mystical',
    image: 'https://picsum.photos/seed/alchemist/400/300',
    tags: ['Nightlife'],
    description: 'A dark, copper-walled bar serving theatrical cocktails.',
    rating: 4.5,
    approved: true,
    addedBy: 'admin'
  }
];
