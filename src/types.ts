export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  gujaratiName?: string;
  location: string;
  description: string;
  dressCode?: string;
  iconName: string;
}

export interface DaySchedule {
  dayNumber: number;
  date: string;
  title: string;
  subtitle: string;
  tagline: string;
  events: ScheduleItem[];
}

export interface VenueInfo {
  name: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  description: string;
  parkingInfo: string;
  hotelInfo?: string;
}

export interface TraditionInfo {
  id: string;
  title: string;
  gujaratiTitle: string;
  day: 'Day 1' | 'Day 2' | 'General';
  shortDesc: string;
  fullDesc: string;
  guestTip: string;
  iconName: string;
}

export interface WeddingDetails {
  brideName: string;
  groomName: string;
  weddingDateIso: string; // ISO format for countdown timer
  displayDateRange: string;
  primaryLocation: string;
}

export interface RsvpResponse {
  guestName: string;
  email: string;
  attendingDay1: boolean;
  attendingDay2: boolean;
  dietaryRestrictions: string;
  guestCount: number;
  messageToCouple: string;
}
