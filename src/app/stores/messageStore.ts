import { create } from "zustand";

type MessageStore = {
  unreadGroups: Set<number>;
  addUnread: (groupId: number) => void;
  clearUnread: (groupId: number) => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  unreadGroups: new Set(),

  addUnread: (groupId) =>
    set((state) => ({
      unreadGroups: new Set(state.unreadGroups).add(groupId),
    })),

  clearUnread: (groupId) =>
    set((state) => {
      const updated = new Set(state.unreadGroups);
      updated.delete(groupId);
      return { unreadGroups: updated };
    }),
}));
