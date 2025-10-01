let listeners = [];

export const txStore = {
  items: [], // { id, title, type: 'income'|'expense', amount:number, at: ISO, category?, notes? }

  subscribe(fn) {
    listeners.push(fn);
    return () => (listeners = listeners.filter((x) => x !== fn));
  },

  add(tx) {
    const id =
      (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // normalize and push
    const item = {
      id,
      title: tx.description?.trim() || tx.title?.trim() || "(untitled)",
      type: tx.type,                // 'income' or 'expense'
      amount: Number(tx.amount || 0),
      at: tx.date ? `${tx.date}T00:00:00` : new Date().toISOString(), // ensure ISO
      category: tx.category || "",
      notes: tx.notes || "",
    };

    this.items = [item, ...this.items];
    listeners.forEach((fn) => fn(this.items));
  },

  getAll() {
    return this.items;
  }
};