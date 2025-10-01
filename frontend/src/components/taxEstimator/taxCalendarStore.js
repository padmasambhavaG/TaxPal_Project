let listeners = [];

// Starts with no events
export const calendarStore = {
  events: [],
  subscribe(fn) {
    listeners.push(fn);
    return () => (listeners = listeners.filter((x) => x !== fn));
  },
  addEvent(evt) {
    const id =
      (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    this.events = [...this.events, { ...evt, id }];
    listeners.forEach((fn) => fn(this.events));
  },
  getEvents() {
    return this.events;
  },
};
