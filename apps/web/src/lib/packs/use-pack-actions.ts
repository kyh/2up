import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc/react";
import { useAlert } from "@/components";

export const useGetDiscover = (ref: string) => {
  const alert = useAlert();

  return api.pack.getDiscover.useQuery(
    { ref },
    {
      onError: (err) => {
        alert.show(err.message);
      },
    },
  );
};

export const useGetPacks = (filter: Record<string, unknown>) => {
  const alert = useAlert();
  return api.pack.getAll.useQuery(filter, {
    onError: (err) => {
      alert.show(err.message);
    },
  });
};

export const useGetPack = (packId: string, withScenes = false) => {
  const alert = useAlert();
  return api.pack.get.useQuery(
    { id: packId, withScenes },
    {
      onError: (err) => {
        alert.show(err.message);
      },
    },
  );
};

export const useCreatePack = () => {
  const alert = useAlert();
  const router = useRouter();
  const mutation = api.pack.create.useMutation();

  const createPack = async (pack: Parameters<typeof mutation.mutate>[0]) => {
    await mutation.mutate(pack, {
      onSuccess: (pack) => {
        alert.show("Pack created");
        router.push(`/packs/${pack.id}/edit`);
      },
      onError: (err) => {
        alert.show(err.message);
      },
    });
  };

  return { ...mutation, createPack };
};

export const useUpdatePack = () => {
  const alert = useAlert();
  const mutation = api.pack.update.useMutation();

  const updatePack = async (
    packId: string,
    pack: Parameters<typeof mutation.mutate>[0],
  ) => {
    await mutation.mutate(
      {
        ...pack,
        id: packId,
      },
      {
        onError: (err) => {
          alert.show(err.message);
        },
      },
    );
  };

  return { ...mutation, updatePack };
};

export const useDeletePack = () => {
  const alert = useAlert();
  const mutation = api.pack.delete.useMutation();

  const deletePack = async (packId: string) => {
    await mutation.mutate(
      { id: packId },
      {
        onError: (err) => {
          alert.show(err.message);
        },
      },
    );
  };

  return { ...mutation, deletePack };
};
