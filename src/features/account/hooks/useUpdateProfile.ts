import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfile } from "../services/account.service";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["account", "profile"], updatedProfile);
    },
  });
}
