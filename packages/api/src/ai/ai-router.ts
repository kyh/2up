import { v0 } from "v0-sdk";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { systemPrompt } from "./ai-prompt";
import {
  createChatInput,
  deleteChatInput,
  getChatInput,
  projectId,
  updateChatInput,
} from "./ai-schema";

export const aiRouter = createTRPCRouter({
  getChats: protectedProcedure.query(async () => {
    const project = await v0.projects.getById({
      projectId,
    });

    return {
      project: { ...project },
      chats: project.chats,
    };
  }),

  getChat: protectedProcedure.input(getChatInput).query(async ({ input }) => {
    const chat = await v0.chats.getById({
      chatId: input.chatId,
    });

    return {
      chat: { ...chat },
    };
  }),

  createChat: protectedProcedure
    .input(createChatInput)
    .mutation(async ({ input }) => {
      const created = await v0.chats.create({
        system: systemPrompt,
        message: input.message,
        chatPrivacy: "private",
        projectId: projectId,
        responseMode: "async",
      });

      return {
        chat: { ...created },
      };
    }),

  updateChat: protectedProcedure
    .input(updateChatInput)
    .mutation(async ({ input }) => {
      const created = await v0.chats.sendMessage({
        chatId: input.chatId,
        message: input.message,
        responseMode: "async",
      });

      return {
        message: { ...created },
      };
    }),

  deleteChat: protectedProcedure
    .input(deleteChatInput)
    .mutation(async ({ input }) => {
      const deleted = await v0.chats.delete({
        chatId: input.chatId,
      });

      return {
        chat: { ...deleted },
      };
    }),
});
