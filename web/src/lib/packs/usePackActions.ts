import { trpc } from "~/utils/trpc";
import { useAlert } from "~/components";

export const useGetPack = (packId: string) => {
  const alert = useAlert();
  return trpc.pack.getPack.useQuery(
    { packId },
    {
      onError: (err) => {
        alert.show(err.message);
      },
    }
  );
};

export const useGetDiscover = (ref: string) => {
  const alert = useAlert();
  return trpc.pack.getDiscover.useQuery(
    { ref },
    {
      onError: (err) => {
        alert.show(err.message);
      },
    }
  );
};
