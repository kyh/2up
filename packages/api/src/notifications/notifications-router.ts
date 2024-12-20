// import { createTRPCRouter, protectedProcedure } from "../trpc";
// import {
//   createNotificationInput,
//   dismissNotificationInput,
//   fetchNotificationsInput,
// } from "./notifications-schema";

// export const notificationsRouter = createTRPCRouter({
//   createNotification: protectedProcedure
//     .input(createNotificationInput)
//     .mutation(async ({ ctx, input }) => {
//       const response = await ctx.adminSupabase
//         .from("Notifications")
//         .insert(input);

//       if (response.error) {
//         throw response.error;
//       }

//       return response.data;
//     }),
//   dismissNotification: protectedProcedure
//     .input(dismissNotificationInput)
//     .mutation(async ({ ctx, input }) => {
//       const response = await ctx.supabase
//         .from("Notifications")
//         .update({ dismissed: true })
//         .eq("id", input.notification);

//       if (response.error) {
//         throw response.error;
//       }

//       return response.data;
//     }),
//   fetchNotifications: protectedProcedure
//     .input(fetchNotificationsInput)
//     .query(async ({ ctx, input }) => {
//       const now = new Date().toISOString();

//       const response = await ctx.supabase
//         .from("Notifications")
//         .select(
//           `id,
//            body,
//            dismissed,
//            type,
//            createdAt,
//            link
//            `,
//         )
//         .in("accountId", input.accountIds)
//         .eq("dismissed", false)
//         .gt("expiresAt", now)
//         .order("createdAt", { ascending: false })
//         .limit(10);

//       if (response.error) {
//         throw response.error;
//       }

//       return response.data;
//     }),
// });
