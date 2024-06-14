import { z } from "zod";
import { zfd } from "zod-form-data";

export const AVATARS_BUCKET = "account_image";

export const deleteProfilePhotoInput = z.object({
  url: z.string(),
});

export const uploadUserProfilePhotoInput = zfd.formData({
  photoFile: zfd.file(),
  userId: zfd.text(),
});
