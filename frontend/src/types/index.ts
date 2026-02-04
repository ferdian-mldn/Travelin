export interface Tour {
  id: number;
  slug: string;
  name: string;
  location: string;
  description: string;
  price: string; // Laravel mengirim decimal sebagai string kadang, tapi kita handle nanti
  thumbnail: string;
  duration_days: number;
  rating: number;
}