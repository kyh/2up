import { tool } from "ai";
import { z } from "zod";

export const createFileSchema = z.object({
  filePath: z
    .string()
    .describe("The path where the new file should be created."),
  type: z.string().describe("The type of file (js, html, css, asset, etc.)."),
  content: z.string().describe("The content to be written to the new file."),
});
export type CreateFileSchema = z.infer<typeof createFileSchema>;

export const createFile = tool({
  description: "Create a new file with the specified content in the codebase.",
  parameters: createFileSchema,
  execute: async (props) => props,
});

export const updateFileSchema = z.object({
  filePath: z.string().describe("The path of the file to be updated."),
  content: z.string().describe("The new content for the file."),
});
export type UpdateFileSchema = z.infer<typeof updateFileSchema>;

export const updateFile = tool({
  description: "Update a specified file with the specified content.",
  parameters: updateFileSchema,
  execute: async (props) => props,
});

export const deleteFileSchema = z.object({
  filePath: z.string().describe("The path of the file to be deleted."),
});
export type DeleteFileSchema = z.infer<typeof deleteFileSchema>;

export const deleteFile = tool({
  description: "Delete a specified file from the codebase.",
  parameters: deleteFileSchema,
  execute: async (props) => props,
});

export const aiDeveloperTools = {
  createFile,
  updateFile,
  deleteFile,
};
