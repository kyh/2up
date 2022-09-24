import { trpc } from "~/utils/trpc";
import { useAlert } from "~/components";

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

export const useGetPacks = (filter: Record<string, unknown>) => {
  const alert = useAlert();
  return trpc.pack.getAll.useQuery(filter, {
    onError: (err) => {
      alert.show(err.message);
    },
  });
};

export const useGetPack = (packId: string) => {
  const alert = useAlert();
  return trpc.pack.get.useQuery(
    { packId },
    {
      onError: (err) => {
        alert.show(err.message);
      },
    }
  );
};

export const useCreatePack = () => {
  const alert = useAlert();
  const mutation = trpc.pack.create.useMutation();

  const createPack = async (pack: Parameters<typeof mutation.mutate>[0]) => {
    await mutation.mutate(pack, {
      onError: (err) => {
        alert.show(err.message);
      },
    });
  };

  return { ...mutation, createPack };
};

export const useUpdatePack = () => {
  const alert = useAlert();
  const mutation = trpc.pack.update.useMutation();

  const updatePack = async (
    packId: string,
    pack: Parameters<typeof mutation.mutate>[0]
  ) => {
    await mutation.mutate(
      {
        ...pack,
        packId,
      },
      {
        onError: (err) => {
          alert.show(err.message);
        },
      }
    );
  };

  return { ...mutation, updatePack };
};

export const useDeletePack = () => {
  const alert = useAlert();
  const mutation = trpc.pack.delete.useMutation();

  const deletePack = async (packId: string) => {
    await mutation.mutate(
      { packId },
      {
        onError: (err) => {
          alert.show(err.message);
        },
      }
    );
  };

  return { ...mutation, deletePack };
};
