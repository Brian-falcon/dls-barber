export type User = {
  id: string;
  name: string;
  email: string;
};

export type Booking = {
  id: string;
  userId: string;
  date: string;
  time: string;
  service: string;
};
