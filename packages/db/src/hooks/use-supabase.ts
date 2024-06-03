import { useMemo } from "react";

import { getSupabaseBrowserClient } from "../clients/browser.client";

export const useSupabase = () => useMemo(() => getSupabaseBrowserClient(), []);
