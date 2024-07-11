"use client";

import { useCallback } from "react";
import { ImageUploader } from "@init/ui/image-uploader";
import { toast } from "@init/ui/toast";

import { api } from "@/trpc/react";

export function UpdateTeamAccountImage(props: {
  account: {
    id: string;
    name: string;
    pictureUrl: string | null;
  };
}) {
  const deleteProfilePhoto = api.storage.deleteProfilePhoto.useMutation();
  const uploadUserProfilePhoto =
    api.storage.uploadUserProfilePhoto.useMutation();
  const updatePicture = api.account.updatePicture.useMutation();

  const createToaster = useCallback((promise: () => Promise<unknown>) => {
    return toast.promise(promise, {
      success: "Team logo successfully updated",
      error: "Could not update Team logo. Please try again.",
      loading: "Updating Team logo...",
    });
  }, []);

  const onValueChange = useCallback(
    (file: File | null) => {
      const removeExistingStorageFile = () => {
        if (props.account.pictureUrl) {
          return (
            deleteProfilePhoto.mutateAsync({ url: props.account.pictureUrl }) ??
            Promise.resolve()
          );
        }

        return Promise.resolve();
      };

      if (file) {
        const formData = new FormData();
        formData.append("photoFile", file);
        formData.append("userId", props.account.id);

        const promise = () =>
          removeExistingStorageFile().then(() =>
            uploadUserProfilePhoto.mutateAsync(formData).then((pictureUrl) => {
              return updatePicture.mutateAsync({
                pictureUrl,
                accountId: props.account.id,
              });
            }),
          );

        createToaster(promise);
      } else {
        const promise = () =>
          removeExistingStorageFile().then(() => {
            return updatePicture.mutateAsync({
              pictureUrl: null,
              accountId: props.account.id,
            });
          });

        createToaster(promise);
      }
    },
    [createToaster, props],
  );

  return (
    <ImageUploader
      value={props.account.pictureUrl}
      onValueChange={onValueChange}
    >
      <div className={"flex flex-col space-y-1"}>
        <span className={"text-sm"}>Upload a Profile Picture</span>

        <span className={"text-xs"}>
          Choose a photo to upload as your profile picture.
        </span>
      </div>
    </ImageUploader>
  );
}
