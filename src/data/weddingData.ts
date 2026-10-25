import { DaySchedule, VenueInfo, WeddingDetails } from '../types';

export const defaultWeddingDetails: WeddingDetails = {
  brideName: "Fenny",
  groomName: "Neh",
  weddingDateIso: "2027-06-05T12:15:00",
  displayDateRange: "Friday, June 4 & Saturday, June 5, 2027",
  primaryLocation: "Bridlewood of Madison, Madison, MS",
};

export const defaultVenues: { day1: VenueInfo; day2: VenueInfo } = {
  day1: {
    name: "Bridlewood of Madison",
    address: "3024 MS-22",
    city: "Madison, MS 39110",
    googleMapsUrl: "https://www.google.com/maps/place/Bridlewood+of+Madison/@32.5683555,-90.17173,862m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8629c51690047989:0xac5b7cfebfbff463!8m2!3d32.5683555!4d-90.17173!16s%2Fg%2F11fxvfjkmq?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D",
    description: "The venue for the Day 1 wedding ceremonies and celebrations.",
    parkingInfo: "Complimentary valet parking available at the main courtyard entrance.",
    hotelInfo: "Group rate available at San Jose Marriott under 'Neh & Fenny Wedding'."
  },
  day2: {
    name: "Bridlewood of Madison",
    address: "3024 MS-22",
    city: "Madison, MS 39110",
    googleMapsUrl: "https://www.google.com/maps/place/Bridlewood+of+Madison/@32.5683555,-90.17173,862m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8629c51690047989:0xac5b7cfebfbff463!8m2!3d32.5683555!4d-90.17173!16s%2Fg%2F11fxvfjkmq?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D",
    description: "Serene glass pavilion surrounded by lush gardens, featuring an ornate traditional Mandap overlooking the reflecting pool.",
    parkingInfo: "Dedicated self-parking garage adjacent to Pavilion Entrance B.",
    hotelInfo: "Shuttle services provided continuously between partner hotels and venue."
  }
};

export const defaultSchedules: DaySchedule[] = [
  {
    dayNumber: 1,
    date: "Friday, June 4, 2027",
    title: "",
    subtitle: "Ganesh Sthapana, Mandap Muhurat & Grah Shanti",
    tagline: "",
    events: [
      {
        id: "d1-e1",
        time: "7:30 AM",
        title: "Ganesh Sthapana",
        location: "Bridlewood of Madison",
        description: "Ganesh Sthapana ceremony.",
        iconName: "Sun"
      },
      {
        id: "d1-e2",
        time: "8:15 AM",
        title: "Mandap Muhurat",
        location: "Bridlewood of Madison",
        description: "Mandap Muhurat ceremony.",
        iconName: "Sparkles"
      },
      {
        id: "d1-e3",
        time: "9:15 AM",
        title: "Grah Shanti",
        location: "Bridlewood of Madison",
        description: "Grah Shanti ceremony.",
        iconName: "Sun"
      },
      {
        id: "d1-e4",
        time: "12:00 PM",
        title: "Lunch",
        location: "Bridlewood of Madison",
        description: "Lunch.",
        iconName: "Utensils"
      },
      {
        id: "d1-e5",
        time: "5:30 PM",
        title: "Haldi",
        location: "Bridlewood of Madison",
        description: "Haldi ceremony.",
        iconName: "Sparkles"
      },
      {
        id: "d1-e6",
        time: "7:00 PM",
        title: "Dinner",
        location: "Bridlewood of Madison",
        description: "Dinner.",
        iconName: "Utensils"
      },
    ]
  },
  {
    dayNumber: 2,
    date: "Saturday, June 5, 2027",
    title: "",
    subtitle: "Jaan Aagman, Hast Melap & Vidaai",
    tagline: "",
    events: [
      {
        id: "d2-e1",
        time: "9:15 AM",
        title: "Jaan Aagman",
        location: "Bridlewood of Madison",
        description: "Jaan Aagman.",
        iconName: "Flame"
      },
      {
        id: "d2-e2",
        time: "12:15 PM",
        title: "Hast Melap",
        location: "Bridlewood of Madison",
        description: "Hast Melap ceremony.",
        iconName: "Sun"
      },
      {
        id: "d2-e3",
        time: "12:30 PM",
        title: "Lunch",
        location: "Bridlewood of Madison",
        description: "Lunch.",
        iconName: "Utensils"
      },
      {
        id: "d2-e4",
        time: "3:00 PM",
        title: "Vidaai",
        location: "Bridlewood of Madison",
        description: "Vidaai.",
        iconName: "Heart"
      },
    ]
  }
];

export const guestFaqs = [
  {
    question: "What should I wear to the Gujarati wedding ceremonies?",
    answer: "Please wear attire appropriate for the wedding ceremonies. No specific dress code has been provided."
  },
  {
    question: "Is the food vegetarian?",
    answer: "Yes! In traditional Gujarati Hindu custom, all meals throughout the 2-day celebration will be 100% vegetarian, delicious, and cooked fresh. Jain and vegan options will also be clearly labeled."
  },
  {
    question: "What events are planned?",
    answer: "Please see the schedule for the listed ceremonies and meals."
  },
  {
    question: "How do I submit my RSVP?",
    answer: "Click the 'RSVP' button anywhere on this page and submit the form."
  }
];
