import type { Friend } from "~/lib/types";
import { Badge } from "./ui/badge";

const friends: Friend[] = [
  {
    id: 1,
    name: "Alice",
    image: "https://example.com/images/alice.jpg",
  },
  {
    id: 2,
    name: "Bob",
    image: "https://example.com/images/bob.jpg",
  },
];

type SelectedFriendsProps = {
  selectedFriends?: number[];
  friendEmails?: string[];
};

export function SelectedFriends(props: SelectedFriendsProps) {
  const { selectedFriends, friendEmails } = props;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {[
        ...friends
          .filter((friend) => selectedFriends?.includes(friend.id))
          .map((friend) => ({
            key: friend.id,
            label: friend.name,
          })),
        ...(friendEmails?.map((email) => ({
          key: email,
          label: email,
        })) || []),
      ].map(({ key, label }) => (
        <Badge key={key}>{label}</Badge>
      ))}
    </div>
  );
}
