import Markdoc from "@markdoc/markdoc";

import type { Cms, CmsClient } from "./cms-client";
import { createKeystaticReader } from "./keystatic-reader";

export function createKeystaticClient() {
  return new KeystaticClient();
}

class KeystaticClient implements CmsClient {
  async getContentItems(options: Cms.GetContentItemsOptions) {
    const reader = await createKeystaticReader();

    const collection =
      options.collection as keyof (typeof reader)["collections"];

    if (!reader.collections[collection]) {
      throw new Error(`Collection ${collection} not found`);
    }

    const docs = await reader.collections[collection].all();

    const startOffset = options?.offset ?? 0;
    const endOffset = startOffset + (options?.limit ?? 10);

    const filtered = docs
      .filter((item) => {
        const categoryMatch = options?.categories?.length
          ? options.categories.find((category) =>
              item.entry.categories.includes(category),
            )
          : true;

        if (!categoryMatch) {
          return false;
        }

        if (options.language) {
          if (item.entry.language && item.entry.language !== options.language) {
            return false;
          }
        }

        const tagMatch = options?.tags?.length
          ? options.tags.find((tag) => item.entry.tags.includes(tag))
          : true;

        if (!tagMatch) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const direction = options.sortDirection ?? "asc";
        const sortBy = options.sortBy ?? "publishedAt";

        const transform = (value: string | number | undefined | null) => {
          if (typeof value === "string") {
            return new Date(value).getTime();
          }

          return value ?? 0;
        };

        const left = transform(a.entry[sortBy]);
        const right = transform(b.entry[sortBy]);

        if (direction === "asc") {
          return left - right;
        }

        return right - left;
      });

    const items = await Promise.all(
      filtered.slice(startOffset, endOffset).map(async (item) => {
        const children = docs.filter((item) => item.entry.parent === item.slug);

        return this.mapPost(item, children);
      }),
    );

    return {
      total: filtered.length,
      items,
    };
  }

  async getContentItemBySlug(params: { slug: string; collection: string }) {
    const reader = await createKeystaticReader();

    const collection =
      params.collection as keyof (typeof reader)["collections"];

    if (!reader.collections[collection]) {
      throw new Error(`Collection ${collection} not found`);
    }

    const doc = await reader.collections[collection].read(params.slug);

    if (!doc) {
      return Promise.resolve(undefined);
    }

    const allPosts = await reader.collections[collection].all();

    const children = allPosts.filter(
      (item) => item.entry.parent === params.slug,
    );

    return this.mapPost({ entry: doc, slug: params.slug }, children);
  }

  async getCategories() {
    return Promise.resolve([]);
  }

  async getTags() {
    return Promise.resolve([]);
  }

  async getTagBySlug() {
    return Promise.resolve(undefined);
  }

  async getCategoryBySlug() {
    return Promise.resolve(undefined);
  }

  private async mapPost<
    Type extends {
      entry: PostEntryProps;
      slug: string;
    },
  >(item: Type, children: Type[] = []): Promise<Cms.ContentItem> {
    const publishedAt = item.entry.publishedAt
      ? new Date(item.entry.publishedAt)
      : new Date();

    const markdoc = await item.entry.content();
    const content = Markdoc.transform(markdoc.node);
    const html = Markdoc.renderers.html(content);

    return {
      id: item.slug,
      title: item.entry.title,
      url: item.slug,
      slug: item.slug,
      description: item.entry.description,
      publishedAt: publishedAt.toISOString(),
      content: html,
      image: item.entry.image ?? undefined,
      categories:
        item.entry.categories.map((item) => {
          return {
            id: item,
            name: item,
            slug: item,
          };
        }) ?? [],
      tags: item.entry.tags.map((item) => {
        return {
          id: item,
          name: item,
          slug: item,
        };
      }),
      parentId: item.entry.parent ?? undefined,
      order: item.entry.order ?? 1,
      children: await Promise.all(
        children.map(async (child) => this.mapPost(child, [])),
      ),
    };
  }
}
