import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  AVATARS_BUCKET,
  deleteProfilePhotoInput,
  uploadUserProfilePhotoInput,
} from "./storage-schema";

export const storageRouter = createTRPCRouter({
  deleteProfilePhoto: protectedProcedure
    .input(deleteProfilePhotoInput)
    .mutation(async ({ ctx, input }) => {
      const bucket = ctx.supabase.storage.from(AVATARS_BUCKET);
      const fileName = input.url.split("/").pop()?.split("?")[0];

      if (!fileName) {
        return;
      }

      return bucket.remove([fileName]);
    }),
  uploadUserProfilePhoto: protectedProcedure
    .input(uploadUserProfilePhotoInput)
    .mutation(async ({ ctx, input }) => {
      const bytes = await input.photoFile.arrayBuffer();
      const bucket = ctx.supabase.storage.from(AVATARS_BUCKET);
      const extension = input.photoFile.name.split(".").pop();
      const fileName = await getAvatarFileName(input.userId, extension);

      const response = await bucket.upload(fileName, bytes);

      if (response.error) {
        throw response.error;
      }

      return bucket.getPublicUrl(fileName).data.publicUrl;
    }),
});

const getAvatarFileName = async (
  userId: string,
  extension: string | undefined,
) => {
  const { nanoid } = await import("nanoid");
  const uniqueId = nanoid(16);

  return `${userId}.${extension}?v=${uniqueId}`;
};
