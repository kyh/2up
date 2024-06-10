import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createAuthCallbackService } from "@2up/api/auth/auth-callback-service";
import { getSupabaseServerClient } from "@2up/db/supabase-server-client";

export const GET = async (request: NextRequest) => {
  const service = createAuthCallbackService(getSupabaseServerClient());

  const url = await service.verifyTokenHash(request, {
    joinTeamPath: "/join",
    redirectPath: "/dashboard",
  });

  return NextResponse.redirect(url);
};
