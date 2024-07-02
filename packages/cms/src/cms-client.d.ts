// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Cms {
  export interface ContentItem {
    id: string;
    title: string;
    url: string;
    description: string | undefined;
    content: unknown;
    publishedAt: string;
    image: string | undefined;
    slug: string;
    categories: Category[];
    tags: Tag[];
    order: number;
    children: ContentItem[];
    parentId: string | undefined;
  }

  export interface Category {
    id: string;
    name: string;
    slug: string;
  }

  export interface Tag {
    id: string;
    name: string;
    slug: string;
  }

  export interface GetContentItemsOptions {
    collection: string;
    limit?: number;
    offset?: number;
    categories?: string[];
    tags?: string[];
    parentIds?: string[];
    language?: string | undefined;
    sortDirection?: "asc" | "desc";
    sortBy?: "publishedAt" | "order" | "title";
  }

  export interface GetCategoriesOptions {
    slugs?: string[];
    limit?: number;
    offset?: number;
  }

  export interface GetTagsOptions {
    slugs?: string[];
    limit?: number;
    offset?: number;
  }
}

/**
 * Abstract class representing a CMS client.
 */
export abstract class CmsClient {
  /**
   * Retrieves content items based on the provided options.
   * @param options - Options for filtering and pagination.
   * @returns A promise that resolves to an array of content items.
   */
  abstract getContentItems(options?: Cms.GetContentItemsOptions): Promise<{
    total: number;
    items: Cms.ContentItem[];
  }>;

  /**
   * Retrieves a content item by its ID and type.
   * @returns A promise that resolves to the content item, or undefined if not found.
   */
  abstract getContentItemBySlug(params: {
    slug: string;
    collection: string;
  }): Promise<Cms.ContentItem | undefined>;

  /**
   * Retrieves categories based on the provided options.
   * @param options - Options for filtering and pagination.
   * @returns A promise that resolves to an array of categories.
   */
  abstract getCategories(
    options?: Cms.GetCategoriesOptions,
  ): Promise<Cms.Category[]>;

  /**
   * Retrieves a category by its slug.
   * @param slug - The slug of the category.
   * @returns A promise that resolves to the category, or undefined if not found.
   */
  abstract getCategoryBySlug(slug: string): Promise<Cms.Category | undefined>;

  /**
   * Retrieves tags based on the provided options.
   * @param options - Options for filtering and pagination.
   * @returns A promise that resolves to an array of tags.
   */
  abstract getTags(options?: Cms.GetTagsOptions): Promise<Cms.Tag[]>;

  /**
   * Retrieves a tag by its slug.
   * @param slug - The slug of the tag.
   * @returns A promise that resolves to the tag, or undefined if not found.
   */
  abstract getTagBySlug(slug: string): Promise<Cms.Tag | undefined>;
}
