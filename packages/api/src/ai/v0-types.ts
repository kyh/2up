export type ChatDetail = {
  id: string;
  object: "chat";
  shareable: boolean;
  privacy: "public" | "private" | "team" | "team-edit" | "unlisted";
  name?: string;
  /** @deprecated */
  title?: string;
  createdAt: string;
  updatedAt?: string;
  favorite: boolean;
  authorId: string;
  projectId?: string;
  webUrl: string;
  apiUrl: string;
  latestVersion?: {
    id: string;
    object: "version";
    status: "pending" | "completed" | "failed";
    demoUrl?: string;
    createdAt: string;
    updatedAt?: string;
    files: {
      object: "file";
      name: string;
      content: string;
      locked: boolean;
    }[];
  };
  /** @deprecated */
  url: string;
  messages: {
    id: string;
    object: "message";
    content: string;
    createdAt: string;
    updatedAt?: string;
    type:
      | "message"
      | "forked-block"
      | "forked-chat"
      | "open-in-v0"
      | "refinement"
      | "added-environment-variables"
      | "added-integration"
      | "deleted-file"
      | "moved-file"
      | "renamed-file"
      | "edited-file"
      | "replace-src"
      | "reverted-block"
      | "fix-with-v0"
      | "auto-fix-with-v0"
      | "sync-git";
    role: "user" | "assistant";
    apiUrl: string;
  }[];
  files?: {
    lang: string;
    meta: Record<string, any>;
    source: string;
  }[];
  /** @deprecated */
  demo?: string;
  text: string;
  modelConfiguration: {
    modelId: "v0-1.5-sm" | "v0-1.5-md" | "v0-1.5-lg";
    imageGenerations?: boolean;
    thinking?: boolean;
  };
};
export type ChatSummary = {
  id: string;
  object: "chat";
  shareable: boolean;
  privacy: "public" | "private" | "team" | "team-edit" | "unlisted";
  name?: string;
  /** @deprecated */
  title?: string;
  createdAt: string;
  updatedAt?: string;
  favorite: boolean;
  authorId: string;
  projectId?: string;
  webUrl: string;
  apiUrl: string;
  latestVersion?: {
    id: string;
    object: "version";
    status: "pending" | "completed" | "failed";
    demoUrl?: string;
    createdAt: string;
    updatedAt?: string;
  };
};
export type DeploymentDetail = {
  id: string;
  object: "deployment";
  inspectorUrl: string;
  chatId: string;
  projectId: string;
  versionId: string;
  apiUrl: string;
  webUrl: string;
};
export type FileDetail = {
  object: "file";
  name: string;
  content: string;
  locked: boolean;
};
export type HookDetail = {
  id: string;
  object: "hook";
  name: string;
  events: (
    | "chat.created"
    | "chat.updated"
    | "chat.deleted"
    | "message.created"
    | "message.updated"
    | "message.deleted"
    | "project.created"
    | "project.updated"
    | "project.deleted"
  )[];
  chatId?: string;
  projectId?: string;
  url: string;
};
export type HookSummary = {
  id: string;
  object: "hook";
  name: string;
};
export type MessageDetail = {
  id: string;
  object: "message";
  content: string;
  createdAt: string;
  updatedAt?: string;
  type:
    | "message"
    | "forked-block"
    | "forked-chat"
    | "open-in-v0"
    | "refinement"
    | "added-environment-variables"
    | "added-integration"
    | "deleted-file"
    | "moved-file"
    | "renamed-file"
    | "edited-file"
    | "replace-src"
    | "reverted-block"
    | "fix-with-v0"
    | "auto-fix-with-v0"
    | "sync-git";
  role: "user" | "assistant";
  apiUrl: string;
  chatId: string;
};
export type MessageSummary = {
  id: string;
  object: "message";
  content: string;
  createdAt: string;
  updatedAt?: string;
  type:
    | "message"
    | "forked-block"
    | "forked-chat"
    | "open-in-v0"
    | "refinement"
    | "added-environment-variables"
    | "added-integration"
    | "deleted-file"
    | "moved-file"
    | "renamed-file"
    | "edited-file"
    | "replace-src"
    | "reverted-block"
    | "fix-with-v0"
    | "auto-fix-with-v0"
    | "sync-git";
  role: "user" | "assistant";
  apiUrl: string;
};
export type ProjectDetail = {
  id: string;
  object: "project";
  name: string;
  vercelProjectId?: string;
  createdAt: string;
  updatedAt?: string;
  apiUrl: string;
  webUrl: string;
  description?: string;
  instructions?: string;
  chats: {
    id: string;
    object: "chat";
    shareable: boolean;
    privacy: "public" | "private" | "team" | "team-edit" | "unlisted";
    name?: string;
    /** @deprecated */
    title?: string;
    createdAt: string;
    updatedAt?: string;
    favorite: boolean;
    authorId: string;
    projectId?: string;
    webUrl: string;
    apiUrl: string;
    latestVersion?: {
      id: string;
      object: "version";
      status: "pending" | "completed" | "failed";
      demoUrl?: string;
      createdAt: string;
      updatedAt?: string;
    };
  }[];
};
export type ProjectSummary = {
  id: string;
  object: "project";
  name: string;
  vercelProjectId?: string;
  createdAt: string;
  updatedAt?: string;
  apiUrl: string;
  webUrl: string;
};
export type ScopeSummary = {
  id: string;
  object: "scope";
  name?: string;
};
export type UserDetail = {
  id: string;
  object: "user";
  name?: string;
  email: string;
  avatar: string;
};
export type VercelProjectDetail = {
  id: string;
  object: "vercel_project";
  name: string;
};
export type VersionDetail = {
  id: string;
  object: "version";
  status: "pending" | "completed" | "failed";
  demoUrl?: string;
  createdAt: string;
  updatedAt?: string;
  files: {
    object: "file";
    name: string;
    content: string;
    locked: boolean;
  }[];
};
export type VersionSummary = {
  id: string;
  object: "version";
  status: "pending" | "completed" | "failed";
  demoUrl?: string;
  createdAt: string;
  updatedAt?: string;
};
export type ChatsCreateRequest = {
  message: string;
  attachments?: {
    url: string;
  }[];
  system?: string;
  chatPrivacy?: "public" | "private" | "team-edit" | "team" | "unlisted";
  projectId?: string;
  modelConfiguration?: {
    modelId: "v0-1.5-sm" | "v0-1.5-md" | "v0-1.5-lg";
    imageGenerations?: boolean;
    thinking?: boolean;
  };
  responseMode?: "sync" | "async";
};
export type ChatsCreateResponse = ChatDetail;
export type ChatsFindResponse = {
  object: "list";
  data: ChatSummary[];
};
export type ChatsInitRequest = {
  name?: string;
  chatPrivacy?: "public" | "private" | "team-edit" | "team" | "unlisted";
  projectId?: string;
} & (
  | {
      type: "files";
      files: (
        | {
            name: string;
            url: string;
            locked?: boolean;
            content?: never;
          }
        | {
            name: string;
            content: string;
            locked?: boolean;
            url?: never;
          }
      )[];
      repo?: never;
      lockAllFiles?: never;
      registry?: never;
      zip?: never;
    }
  | {
      type: "repo";
      repo: {
        url: string;
        branch?: string;
      };
      lockAllFiles?: boolean;
      files?: never;
      registry?: never;
      zip?: never;
    }
  | {
      type: "registry";
      registry: {
        url: string;
      };
      lockAllFiles?: boolean;
      files?: never;
      repo?: never;
      zip?: never;
    }
  | {
      type: "zip";
      zip: {
        url: string;
      };
      lockAllFiles?: boolean;
      files?: never;
      repo?: never;
      registry?: never;
    }
);
export type ChatsInitResponse = {
  id: string;
  object: "chat";
  shareable: boolean;
  privacy: "public" | "private" | "team" | "team-edit" | "unlisted";
  name?: string;
  /** @deprecated */
  title?: string;
  createdAt: string;
  updatedAt?: string;
  favorite: boolean;
  authorId: string;
  projectId?: string;
  webUrl: string;
  apiUrl: string;
  latestVersion?: {
    id: string;
    object: "version";
    status: "pending" | "completed" | "failed";
    demoUrl?: string;
    createdAt: string;
    updatedAt?: string;
    files: FileDetail[];
  };
  /** @deprecated */
  url: string;
  messages: MessageSummary[];
  files?: {
    lang: string;
    meta: Record<string, any>;
    source: string;
  }[];
  /** @deprecated */
  demo?: string;
  text: string;
};
export type ChatsDeleteResponse = {
  id: string;
  object: "chat";
  deleted: true;
};
export type ChatsGetByIdResponse = {
  id: string;
  object: "chat";
  shareable: boolean;
  privacy: "public" | "private" | "team" | "team-edit" | "unlisted";
  name?: string;
  /** @deprecated */
  title?: string;
  createdAt: string;
  updatedAt?: string;
  favorite: boolean;
  authorId: string;
  projectId?: string;
  webUrl: string;
  apiUrl: string;
  latestVersion?: {
    id: string;
    object: "version";
    status: "pending" | "completed" | "failed";
    demoUrl?: string;
    createdAt: string;
    updatedAt?: string;
    files: FileDetail[];
  };
  /** @deprecated */
  url: string;
  messages: MessageSummary[];
  files?: {
    lang: string;
    meta: Record<string, any>;
    source: string;
  }[];
  /** @deprecated */
  demo?: string;
  text: string;
};
export type ChatsUpdateRequest = {
  name?: string;
  privacy?: "public" | "private" | "team" | "team-edit" | "unlisted";
};
export type ChatsUpdateResponse = {
  id: string;
  object: "chat";
  shareable: boolean;
  privacy: "public" | "private" | "team" | "team-edit" | "unlisted";
  name?: string;
  /** @deprecated */
  title?: string;
  createdAt: string;
  updatedAt?: string;
  favorite: boolean;
  authorId: string;
  projectId?: string;
  webUrl: string;
  apiUrl: string;
  latestVersion?: {
    id: string;
    object: "version";
    status: "pending" | "completed" | "failed";
    demoUrl?: string;
    createdAt: string;
    updatedAt?: string;
    files: FileDetail[];
  };
  /** @deprecated */
  url: string;
  messages: MessageSummary[];
  files?: {
    lang: string;
    meta: Record<string, any>;
    source: string;
  }[];
  /** @deprecated */
  demo?: string;
  text: string;
};
export type ChatsFavoriteRequest = {
  isFavorite: boolean;
};
export type ChatsFavoriteResponse = {
  id: string;
  object: "chat";
  favorited: boolean;
};
export type ChatsForkRequest = {
  versionId?: string;
};
export type ChatsForkResponse = {
  id: string;
  object: "chat";
  shareable: boolean;
  privacy: "public" | "private" | "team" | "team-edit" | "unlisted";
  name?: string;
  /** @deprecated */
  title?: string;
  createdAt: string;
  updatedAt?: string;
  favorite: boolean;
  authorId: string;
  projectId?: string;
  webUrl: string;
  apiUrl: string;
  latestVersion?: {
    id: string;
    object: "version";
    status: "pending" | "completed" | "failed";
    demoUrl?: string;
    createdAt: string;
    updatedAt?: string;
    files: FileDetail[];
  };
  /** @deprecated */
  url: string;
  messages: MessageSummary[];
  files?: {
    lang: string;
    meta: Record<string, any>;
    source: string;
  }[];
  /** @deprecated */
  demo?: string;
  text: string;
};
export type ProjectsGetByChatIdResponse = ProjectDetail;
export type ChatsFindMessagesResponse = {
  object: "list";
  data: MessageSummary[];
  pagination: {
    hasMore: boolean;
    nextCursor?: string;
    nextUrl?: string;
  };
};
export type ChatsSendMessageRequest = {
  message: string;
  attachments?: {
    url: string;
  }[];
  modelConfiguration?: {
    modelId: "v0-1.5-sm" | "v0-1.5-md" | "v0-1.5-lg";
    imageGenerations?: boolean;
    thinking?: boolean;
  };
  responseMode?: "sync" | "async";
};
export type ChatsSendMessageResponse = {
  id: string;
  object: "chat";
  shareable: boolean;
  privacy: "public" | "private" | "team" | "team-edit" | "unlisted";
  name?: string;
  /** @deprecated */
  title?: string;
  createdAt: string;
  updatedAt?: string;
  favorite: boolean;
  authorId: string;
  projectId?: string;
  webUrl: string;
  apiUrl: string;
  latestVersion?: {
    id: string;
    object: "version";
    status: "pending" | "completed" | "failed";
    demoUrl?: string;
    createdAt: string;
    updatedAt?: string;
    files: FileDetail[];
  };
  /** @deprecated */
  url: string;
  messages: MessageSummary[];
  files?: {
    lang: string;
    meta: Record<string, any>;
    source: string;
  }[];
  /** @deprecated */
  demo?: string;
  text: string;
  modelConfiguration: {
    modelId: "v0-1.5-sm" | "v0-1.5-md" | "v0-1.5-lg";
    imageGenerations?: boolean;
    thinking?: boolean;
  };
  chatId: string;
};
export type ChatsGetMessageResponse = MessageDetail;
export type ChatsFindVersionsResponse = {
  object: "list";
  data: VersionSummary[];
  pagination: {
    hasMore: boolean;
    nextCursor?: string;
    nextUrl?: string;
  };
};
export type ChatsGetVersionResponse = VersionDetail;
export type ChatsUpdateVersionRequest = {
  files: {
    name: string;
    content: string;
    locked?: boolean;
  }[];
};
export type ChatsUpdateVersionResponse = VersionDetail;
export type ChatsResumeResponse = MessageDetail;
export type DeploymentsFindResponse = {
  object: "list";
  data: DeploymentDetail[];
};
export type DeploymentsCreateRequest = {
  projectId: string;
  chatId: string;
  versionId: string;
};
export type DeploymentsCreateResponse = DeploymentDetail;
export type DeploymentsGetByIdResponse = DeploymentDetail;
export type DeploymentsDeleteResponse = {
  id: string;
  object: "deployment";
  deleted: true;
};
export type DeploymentsFindLogsResponse = {
  error?: string;
  logs: string[];
  nextSince?: number;
};
export type DeploymentsFindErrorsResponse = {
  error?: string;
  fullErrorText?: string;
  errorType?: string;
  formattedError?: string;
};
export type HooksFindResponse = {
  object: "list";
  data: HookSummary[];
};
export type HooksCreateRequest = {
  name: string;
  events: (
    | "chat.created"
    | "chat.updated"
    | "chat.deleted"
    | "message.created"
    | "message.updated"
    | "message.deleted"
    | "project.created"
    | "project.updated"
    | "project.deleted"
  )[];
  chatId?: string;
  projectId?: string;
  url: string;
};
export type HooksCreateResponse = HookDetail;
export type HooksGetByIdResponse = HookDetail;
export type HooksUpdateRequest = {
  name?: string;
  events?: (
    | "chat.created"
    | "chat.updated"
    | "chat.deleted"
    | "message.created"
    | "message.updated"
    | "message.deleted"
    | "project.created"
    | "project.updated"
    | "project.deleted"
  )[];
  url?: string;
};
export type HooksUpdateResponse = HookDetail;
export type HooksDeleteResponse = {
  id: string;
  object: "hook";
  deleted: true;
};
export type IntegrationsVercelProjectsFindResponse = {
  object: "list";
  data: VercelProjectDetail[];
};
export type IntegrationsVercelProjectsCreateRequest = {
  projectId: string;
  name: string;
};
export type IntegrationsVercelProjectsCreateResponse = VercelProjectDetail;
export type ProjectsFindResponse = {
  object: "list";
  data: ProjectSummary[];
};
export type ProjectsCreateRequest = {
  name: string;
  description?: string;
  icon?: string;
  environmentVariables?: {
    key: string;
    value: string;
  }[];
  instructions?: string;
};
export type ProjectsCreateResponse = ProjectDetail;
export type ProjectsGetByIdResponse = ProjectDetail;
export type ProjectsUpdateRequest = {
  name?: string;
  description?: string;
  instructions?: string;
};
export type ProjectsUpdateResponse = ProjectDetail;
export type ProjectsAssignRequest = {
  chatId: string;
};
export type ProjectsAssignResponse = {
  object: "project";
  id: string;
  assigned: true;
};
export type RateLimitsFindResponse = {
  remaining?: number;
  reset?: number;
  limit: number;
};
export type UserGetResponse = UserDetail;
export type UserGetBillingResponse =
  | {
      billingType: "token";
      data: {
        plan: string;
        billingMode?: "test";
        role: string;
        billingCycle: {
          start: number;
          end: number;
        };
        balance: {
          remaining: number;
          total: number;
        };
        onDemand: {
          balance: number;
          blocks?: {
            expirationDate?: number;
            effectiveDate: number;
            originalBalance: number;
            currentBalance: number;
          }[];
        };
      };
    }
  | {
      billingType: "legacy";
      data: {
        remaining?: number;
        reset?: number;
        limit: number;
      };
    };
export type UserGetPlanResponse = {
  object: "plan";
  plan: string;
  billingCycle: {
    start: number;
    end: number;
  };
  balance: {
    remaining: number;
    total: number;
  };
};
export type UserGetScopesResponse = {
  object: "list";
  data: ScopeSummary[];
};
export type V0ClientConfig = {
  apiKey?: string;
  baseUrl?: string;
};
