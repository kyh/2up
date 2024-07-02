import {
  CloudConfig,
  collection,
  config,
  fields,
  GitHubConfig,
  LocalConfig,
} from "@keystatic/core";
import { Entry } from "@keystatic/core/reader";
import { z } from "zod";

type ZodOutputFor<T> = z.ZodType<T, z.ZodTypeDef, unknown>;

const local = z.object({
  kind: z.literal("local"),
}) satisfies ZodOutputFor<LocalConfig["storage"]>;

const cloud = z.object({
  kind: z.literal("cloud"),
  project: z.string(),
  branchPrefix: z.string().optional(),
  pathPrefix: z.string().optional(),
}) satisfies ZodOutputFor<CloudConfig["storage"]>;

const github = z.object({
  kind: z.literal("github"),
  repo: z.custom<`${string}/${string}`>(),
  branchPrefix: z.string().optional(),
  pathPrefix: z.string().optional(),
}) satisfies ZodOutputFor<GitHubConfig["storage"]>;

const storage = z.union([local, cloud, github]).parse({
  kind: process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND ?? "local",
  project: process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_PROJECT,
  repo: process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_REPO,
  branchPrefix: process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_BRANCH_PREFIX,
  pathPrefix: process.env.NEXT_PUBLIC_KEYSTATIC_PATH_PREFIX,
});

const keyStaticConfig = createKeyStaticConfig(
  process.env.NEXT_PUBLIC_KEYSTATIC_CONTENT_PATH ?? "",
);

export default keyStaticConfig;

function getContentField() {
  return fields.markdoc({
    label: "Content",
    options: {
      link: true,
      blockquote: true,
      bold: true,
      divider: true,
      orderedList: true,
      unorderedList: true,
      strikethrough: true,
      heading: true,
      code: true,
      italic: true,
      image: {
        directory: "public/site/images",
        publicPath: "/site/images",
        schema: {
          title: fields.text({
            label: "Caption",
            description: "The text to display under the image in a caption.",
          }),
        },
      },
    },
  });
}

export type PostEntryProps = Entry<
  (typeof keyStaticConfig)["collections"]["posts"]
>;

function createKeyStaticConfig(path = "") {
  if (path && !path.endsWith("/")) {
    path += "/";
  }

  const collections = {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: `${path}posts/*`,
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        image: fields.image({
          label: "Image",
          directory: "public/site/images",
          publicPath: "/site/images",
        }),
        categories: fields.array(fields.text({ label: "Category" })),
        tags: fields.array(fields.text({ label: "Tag" })),
        description: fields.text({ label: "Description" }),
        publishedAt: fields.date({ label: "Published At" }),
        parent: fields.relationship({
          label: "Parent",
          collection: "posts",
        }),
        language: fields.text({ label: "Language" }),
        order: fields.number({ label: "Order" }),
        content: getContentField(),
      },
    }),
    documentation: collection({
      label: "Documentation",
      slugField: "title",
      path: `${path}documentation/**`,
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: getContentField(),
        image: fields.image({
          label: "Image",
          directory: "public/site/images",
          publicPath: "/site/images",
        }),
        description: fields.text({ label: "Description" }),
        publishedAt: fields.date({ label: "Published At" }),
        order: fields.number({ label: "Order" }),
        language: fields.text({ label: "Language" }),
        parent: fields.relationship({
          label: "Parent",
          collection: "documentation",
        }),
        categories: fields.array(fields.text({ label: "Category" })),
        tags: fields.array(fields.text({ label: "Tag" })),
      },
    }),
  };

  if (storage.kind === "cloud") {
    return config({
      storage: {
        kind: "cloud",
        pathPrefix: storage.pathPrefix,
        branchPrefix: storage.branchPrefix,
      },
      cloud: {
        project: storage.project,
      },
      collections,
    });
  }

  if (storage.kind === "github") {
    return config({
      storage: {
        kind: "github",
        repo: storage.repo,
        pathPrefix: storage.pathPrefix,
        branchPrefix: storage.branchPrefix,
      },
      collections,
    });
  }

  return config({
    storage: {
      kind: "local",
    },
    collections,
  });
}
