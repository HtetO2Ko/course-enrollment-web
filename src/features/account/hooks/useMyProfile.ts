import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../services/account.service";

export function useMyProfile() {
  return useQuery({
    queryKey: ["account", "profile"],
    queryFn: getMyProfile,
  });
}
