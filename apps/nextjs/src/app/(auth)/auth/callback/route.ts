import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createAuthCallbackService } from "@init/api/auth/auth-callback-service";
import { getSupabaseServerClient } from "@init/db/supabase-server-client";

export const GET = async (request: NextRequest) => {
  const service = createAuthCallbackService(getSupabaseServerClient());

  const { nextPath } = await service.exchangeCodeForSession(request, {
    joinTeamPath: "/join",
    redirectPath: "/dashboard",
  });

  return redirect(nextPath);
};
