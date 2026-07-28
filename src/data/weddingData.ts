import { DaySchedule, VenueInfo, WeddingDetails } from '../types';

export const defaultWeddingDetails: WeddingDetails = {
  brideName: "Fenny",
  groomName: "Neh",
  tagline: "Together with their families, invite you to celebrate their union in love and tradition.",
  weddingDateIso: "2027-07-04T09:00:00", // Default upcoming wedding date
  displayDateRange: "Friday, June 7 & Saturday, June 8, 2027",
  primaryLocation: "Bridlewood of Madison, Madison, MS",
  googleSheetRsvpUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_GUJARATI_WEDDING_RSVP/viewform",
};

export const defaultVenues: { day1: VenueInfo; day2: VenueInfo } = {
  day1: {
    name: "Bridlewood of Madison",
    address: "3024 MS-22",
    city: "Madison, MS 39110",
    googleMapsUrl: "https://www.google.com/maps/place/Bridlewood+of+Madison",
    description: "An elegant outdoor courtyard for Pithi (Haldi) followed by the grand indoor ballroom for Grah Shanti and Sangeet.",
    parkingInfo: "Complimentary valet parking available at the main courtyard entrance.",
    hotelInfo: "Group rate available at San Jose Marriott under 'Priya & Rohan Wedding'."
  },
  day2: {
    name: "Bridlewood of Madison",
    address: "3024 MS-22",
    city: "Madison, MS 39110",
    googleMapsUrl: "https://www.google.com/maps/place/Bridlewood+of+Madison",
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
        title: "Grah Shanti",
        gujaratiName: "ગ્રહ શાંતિ અને મંડપ મુહૂર્ત",
        location: "Bridlewood of Madison - Ballroom",
        description: "A sacred Vedic ceremony invoking Lord Ganesha and nine planets (Navagraha) to seek blessings for peace, harmony, and prosperity before the wedding.",
        dressCode: "Traditional Indian Attire (Kurtas, Sarees, Salwar Kameez - Soft Pastels or Yellows)",
        iconName: "Sun"
      },
      {
        id: "d1-e2",
        time: "6:00 PM - 7:00 PM",
        title: "Pithi (Haldi Ceremony)",
        gujaratiName: "પીઠી રસમ",
        location: "Bridlewood of Madison - Courtyard",
        description: "A joyful ritual where family and friends apply yellow turmeric paste (Pithi) onto the bride and groom for a natural glowing skin and good luck. Be ready for fun and smiles!",
        dressCode: "Bright Yellows, Saffron, or casual ethnic wear",
        iconName: "Sparkles"
      },
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
        location: "Main Entrance",
        description: "Neh arrives in style accompanied by family and friends dancing to dhol drums and upbeat music. Bride's family welcomes the wedding party with dhol and garba!",
        dressCode: "Formal Indian Regal / Royal Attire (Sherwanis, Lehenga Cholis, Kanjivaram Sarees)",
        iconName: "Flame"
      },
      {
        id: "d2-e3",
        time: "10:45 AM - 01:15 PM",
        title: "Wedding Ceremony (Lagna)",
        gujaratiName: "હસ્ત મેળાપ અને મંગળ ફેરા",
        location: "Bridlewood of Madison - Ballroom",
        description: "The core Hindu ceremony featuring Ganesh Puja, Kanyadaan (giving away of bride), Hast Melap (joining of hands), Mangal Pheras (4 circles around sacred fire), and Saptapadi (7 Vows).",
        iconName: "Sun"
      },
      {
        id: "d2-e4",
        time: "12:30 PM - 01:00 PM",
        title: "Wedding Mahaprasad Lunch",
        gujaratiName: "લગ્ન ભોજન",
        location: "Bridlewood of Madison - Ballroom",
        description: "A rich celebratory Indian lunch spread for all wedding guests.",
        iconName: "Utensils"
      },
    ]
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
