import { z } from "zod";

const STORAGE_KIND = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND ?? "local";

/**
 * Create a KeyStatic reader based on the storage kind.
 */
export async function createKeystaticReader() {
  switch (STORAGE_KIND) {
    case "local": {
      if (process.env.NEXT_RUNTIME === "nodejs") {
        const { default: config } = await import("./keystatic.config");
        const { createReader } = await import("@keystatic/core/reader");

        return createReader(process.cwd(), config);
      } else {
        // we should never get here but the compiler requires the check
        // to ensure we don't parse the package at build time
        throw new Error();
      }
    }

    case "github":
    case "cloud": {
      const { default: config } = await import("./keystatic.config");

      const githubConfig = z
        .object({
          token: z.string(),
          repo: z.custom<`${string}/${string}`>(),
          pathPrefix: z.string().optional(),
        })
        .parse({
          token: process.env.KEYSTATIC_GITHUB_TOKEN,
          repo: process.env.KEYSTATIC_STORAGE_REPO,
          pathPrefix: process.env.KEYSTATIC_PATH_PREFIX,
        });

      const { createGitHubReader } = await import(
        "@keystatic/core/reader/github"
      );

      return createGitHubReader(config, githubConfig);
    }

    default:
      throw new Error(`Unknown storage kind`);
  }
}
