import { DaySchedule, TraditionInfo, VenueInfo, WeddingDetails } from '../types';

export const defaultWeddingDetails: WeddingDetails = {
  brideName: "Priya",
  groomName: "Rohan",
  tagline: "Together with their families, invite you to celebrate their union in love and tradition.",
  weddingDateIso: "2026-11-14T09:00:00", // Default upcoming wedding date
  displayDateRange: "Saturday, November 14 & Sunday, November 15, 2026",
  primaryLocation: "The Grand Royal Palace & Gardens, San Jose, CA",
  googleSheetRsvpUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_GUJARATI_WEDDING_RSVP/viewform",
};

export const defaultVenues: { day1: VenueInfo; day2: VenueInfo } = {
  day1: {
    name: "The Royal Ballroom & Courtyard",
    address: "450 Grand Heritage Way",
    city: "San Jose, CA 95110",
    googleMapsUrl: "https://maps.google.com/?q=San+Jose+CA",
    description: "An elegant outdoor courtyard for Pithi (Haldi) followed by the grand indoor ballroom for Grah Shanti and Sangeet.",
    parkingInfo: "Complimentary valet parking available at the main courtyard entrance.",
    hotelInfo: "Group rate available at San Jose Marriott under 'Priya & Rohan Wedding'."
  },
  day2: {
    name: "The Grand Palace Pavilion & Gardens",
    address: "1000 Palace Pavilion Boulevard",
    city: "San Jose, CA 95112",
    googleMapsUrl: "https://maps.google.com/?q=San+Jose+CA",
    description: "Serene glass pavilion surrounded by lush gardens, featuring an ornate traditional Mandap overlooking the reflecting pool.",
    parkingInfo: "Dedicated self-parking garage adjacent to Pavilion Entrance B.",
    hotelInfo: "Shuttle services provided continuously between partner hotels and venue."
  }
};

export const defaultSchedules: DaySchedule[] = [
  {
    dayNumber: 1,
    date: "Saturday, November 14, 2026",
    title: "Day 1: Auspicious Beginnings & Celebration",
    subtitle: "Grah Shanti, Pithi & Garba",
    tagline: "Seeking divine peace, turmeric radiance, and evening folk dance festivities.",
    events: [
      {
        id: "d1-e1",
        time: "09:00 AM - 11:30 AM",
        title: "Grah Shanti & Mandap Muhurat",
        gujaratiName: "ગ્રહ શાંતિ અને મંડપ મુહૂર્ત",
        location: "The Royal Ballroom",
        description: "A sacred Vedic ceremony invoking Lord Ganesha and nine planets (Navagraha) to seek blessings for peace, harmony, and prosperity before the wedding.",
        dressCode: "Traditional Indian Attire (Kurtas, Sarees, Salwar Kameez - Soft Pastels or Yellows)",
        iconName: "Sun"
      },
      {
        id: "d1-e2",
        time: "11:30 AM - 01:30 PM",
        title: "Pithi (Haldi Ceremony)",
        gujaratiName: "પીઠી રસમ",
        location: "The Outdoor Courtyard",
        description: "A joyful ritual where family and friends apply yellow turmeric paste (Pithi) onto the bride and groom for a natural glowing skin and good luck. Be ready for fun and smiles!",
        dressCode: "Bright Yellows, Saffron, or casual ethnic wear (Turmeric stains are badge of honor!)",
        iconName: "Sparkles"
      },
      {
        id: "d1-e3",
        time: "01:30 PM - 03:00 PM",
        title: "Traditional Gujarati Lunch",
        gujaratiName: "રસોઈ બોજન",
        location: "Courtyard Dining Area",
        description: "Authentic Gujarati vegetarian feast including Puri, Aloo Rasawala, Undhiyu, Kadhi, Dhokla, and Fresh Jalebi.",
        iconName: "Utensils"
      },
      {
        id: "d1-e4",
        time: "06:30 PM - 11:00 PM",
        title: "Raas Garba & Sangeet Evening",
        gujaratiName: "રાસ ગરબા અને સંગીત",
        location: "Grand Ballroom",
        description: "An energetic evening of traditional Gujarati folk dances (Garba & Dandiya Raas), musical performances, live band, and dinner buffet. Sticks will be provided!",
        dressCode: "Colorful Chaniya Cholis, Kurta Pajamas with Bandhani/Koti vests",
        iconName: "Music"
      }
    ]
  },
  {
    dayNumber: 2,
    date: "Sunday, November 15, 2026",
    title: "Day 2: The Sacred Wedding Day",
    subtitle: "Lagna Ceremony & Grand Reception",
    tagline: "The main wedding rituals, Mangal Pheras, Saptapadi, and celebratory evening banquet.",
    events: [
      {
        id: "d2-e1",
        time: "09:30 AM",
        title: "Baraat Procession (Groom's Arrival)",
        gujaratiName: "જાનનું સ્વાગત / વરઘોડો",
        location: "Palace Main Entrance",
        description: "Rohan arrives in style accompanied by family and friends dancing to dhol drums and upbeat music. Bride's family welcomes the wedding party with dhol and garba!",
        dressCode: "Formal Indian Regal / Royal Attire (Sherwanis, Lehenga Cholis, Kanjivaram Sarees)",
        iconName: "Flame"
      },
      {
        id: "d2-e2",
        time: "10:15 AM",
        title: "Pokhna Ritual (Welcoming Groom)",
        gujaratiName: "પોંખણું",
        location: "Mandap Entrance",
        description: "Bride's mother welcomes the groom with a traditional aarti, playful nose-pinching, and blessings before entering the sacred Mandap.",
        iconName: "Heart"
      },
      {
        id: "d2-e3",
        time: "10:45 AM - 01:15 PM",
        title: "Holy Wedding Ceremony (Lagna)",
        gujaratiName: "હસ્ત મેળાપ અને મંગળ ફેરા",
        location: "The Glass Pavilion Mandap",
        description: "The core Hindu ceremony featuring Ganesh Puja, Kanyadaan (giving away of bride), Hast Melap (joining of hands), Mangal Pheras (4 circles around sacred fire), and Saptapadi (7 Vows).",
        iconName: "Sun"
      },
      {
        id: "d2-e4",
        time: "01:15 PM - 02:45 PM",
        title: "Wedding Mahaprasad Lunch",
        gujaratiName: "લગ્ન ભોજન",
        location: "Grand Garden Pavilion",
        description: "A rich celebratory Indian lunch spread for all wedding guests.",
        iconName: "Utensils"
      },
      {
        id: "d2-e5",
        time: "06:30 PM - Late",
        title: "Grand Wedding Reception",
        gujaratiName: "રીસેપ્શન અને ડિનર",
        location: "Palace Grand Ballroom",
        description: "Cocktail hour, speeches, formal dinner, cake cutting, and non-stop dancing on the dance floor to celebrate the newlyweds!",
        dressCode: "Black Tie / Formal Western Evening Wear or Indo-Western Royal Attire",
        iconName: "GlassWater"
      }
    ]
  }
];

export const defaultTraditions: TraditionInfo[] = [
  {
    id: "tradition-grahshanti",
    title: "Grah Shanti",
    gujaratiTitle: "ગ્રહ શાંતિ",
    day: "Day 1",
    shortDesc: "Sacred prayer asking the nine planets to bless the couple with harmony and remove obstacles.",
    fullDesc: "Before any major Hindu wedding, a priest conducts the Grah Shanti puja. It brings peace to the household and seeks the benign alignment of planets (Grahas) for the bride and groom's new life together.",
    guestTip: "Sit comfortably, relax, and soak in the soothing Sanskrit mantras and aromatic incense.",
    iconName: "Sparkles"
  },
  {
    id: "tradition-pithi",
    title: "Pithi (Haldi Ceremony)",
    gujaratiTitle: "પીઠી રસમ",
    day: "Day 1",
    shortDesc: "Turmeric paste application for radiant skin, good luck, and warding off evil spirits.",
    fullDesc: "Made from organic turmeric root, sandalwood powder, and rosewater, Pithi is lovingly applied to the bride and groom's face, hands, and feet by relatives and friends.",
    guestTip: "Wear yellow or clothes you don't mind getting a tiny golden turmeric smudge on!",
    iconName: "Sun"
  },
  {
    id: "tradition-garba",
    title: "Raas Garba & Dandiya",
    gujaratiTitle: "રાસ ગરબા",
    day: "Day 1",
    shortDesc: "Vibrant Gujarati folk dancing in circular formation with sticks (Dandiya).",
    fullDesc: "Garba represents the cyclical nature of life. Everyone joins in circular rhythmic clapping and dancing steps. Wooden sticks (Dandiyas) are hit together in pair formations.",
    guestTip: "Don't worry if you don't know the steps — Gujarati relatives love teaching newcomers!",
    iconName: "Music"
  },
  {
    id: "tradition-pokhna",
    title: "Baraat & Pokhna",
    gujaratiTitle: "પોંખણું",
    day: "Day 2",
    shortDesc: "The groom's celebratory entrance and affectionate welcome by the bride's mother.",
    fullDesc: "The groom arrives surrounded by dancing companions in a Baraat. At the entrance, the bride's mother performs a welcoming ritual called Pokhna, playfully attempting to catch the groom's nose as a lighthearted reminder of humility.",
    guestTip: "Join the Baraat dance outside! It's one of the highest energy moments of the wedding.",
    iconName: "Flame"
  },
  {
    id: "tradition-pheras",
    title: "Mangal Pheras & Saptapadi",
    gujaratiTitle: "મંગળ ફેરા અને સપ્તપદી",
    day: "Day 2",
    shortDesc: "4 rounds around the holy Agni fire and 7 sacred steps representing lifetime vows.",
    fullDesc: "In Gujarati tradition, the couple circles the holy fire 4 times representing Dharma (Duty), Artha (Prosperity), Kama (Love), and Moksha (Spiritual liberation). Then they take 7 steps (Saptapadi) swearing mutual devotion, respect, and companionship.",
    guestTip: "Throwing flower petals during the completion of Pheras is encouraged as a shower of blessings!",
    iconName: "Heart"
  }
];

export const guestFaqs = [
  {
    question: "What should I wear to the Gujarati wedding ceremonies?",
    answer: "Bright, joyful colors are highly encouraged! For Day 1 (Pithi), wear shades of yellow, saffron, or green. For Garba, colorful traditional clothes like Chaniya Choli or Kurta Pajamas. For Day 2 (Wedding), formal Indian ethnic wear like Sherwani, Kurta, Sarees, or Lehengas. *Cultural tip:* It is customary to avoid plain solid white or solid black during auspicious religious pujas."
  },
  {
    question: "Is the food vegetarian?",
    answer: "Yes! In traditional Gujarati Hindu custom, all meals throughout the 2-day celebration will be 100% vegetarian, delicious, and cooked fresh. Jain and vegan options will also be clearly labeled."
  },
  {
    question: "Do I need to know how to do Garba?",
    answer: "Not at all! Garba is friendly, repetitive, and super easy to learn on the spot. Just jump into the outer circle and follow the rhythm of the person in front of you."
  },
  {
    question: "How do I submit my RSVP?",
    answer: "Click the 'RSVP Now' button anywhere on this page to submit your response directly through our Google Sheet/Form. Please RSVP by October 1st, 2026."
  }
];
