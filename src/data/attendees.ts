export type Attendee = {
  id: string;
  name: string;
  email: string;
  ticketId: string;
  isCheckedIn: boolean;
};

export const mockAttendees: { [eventId: string]: Attendee[] } = {
  "1": [
    { id: "a1", name: "Alice Johnson", email: "alice@example.com", ticketId: "t-aj-1", isCheckedIn: true },
    { id: "a2", name: "Bob Williams", email: "bob@example.com", ticketId: "t-bw-1", isCheckedIn: false },
    { id: "a3", name: "Charlie Brown", email: "charlie@example.com", ticketId: "t-cb-1", isCheckedIn: false },
    { id: "a4", name: "Diana Miller", email: "diana@example.com", ticketId: "t-dm-1", isCheckedIn: true },
  ],
  "2": [
    { id: "b1", name: "Eve Davis", email: "eve@example.com", ticketId: "t-ed-2", isCheckedIn: false },
    { id: "b2", name: "Frank White", email: "frank@example.com", ticketId: "t-fw-2", isCheckedIn: true },
  ],
};