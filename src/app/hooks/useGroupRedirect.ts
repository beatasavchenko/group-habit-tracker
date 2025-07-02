import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "~/trpc/react";

export function useGroupRedirect(groupUsername: string) {
  const router = useRouter();

  const {
    data: group,
    isFetched,
    isLoading,
  } = api.group.getGroupByUsername.useQuery({
    groupUsername,
  });

  useEffect(() => {
    if (isFetched && !group) {
      router.push("/app/dashboard");
    }
  }, [isFetched, group, router]);

  return { group, isFetched, isLoading };
}
