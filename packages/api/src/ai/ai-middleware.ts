// import fs from "fs";
// import path from "path";
// import type {
//   LanguageModelV1,
//   LanguageModelV1Middleware,
//   LanguageModelV1Prompt,
//   LanguageModelV1StreamPart,
// } from "ai";
// import { simulateReadableStream, wrapLanguageModel } from "ai";

// const CACHE_FILE = path.join(process.cwd(), ".cache/ai-cache.json");

// export const cached = (model: LanguageModelV1) =>
//   wrapLanguageModel({
//     middleware: cacheMiddleware,
//     model,
//   });

// const ensureCacheFile = () => {
//   const cacheDir = path.dirname(CACHE_FILE);
//   if (!fs.existsSync(cacheDir)) {
//     fs.mkdirSync(cacheDir, { recursive: true });
//   }
//   if (!fs.existsSync(CACHE_FILE)) {
//     fs.writeFileSync(CACHE_FILE, "{}");
//   }
// };

// const getCachedResult = (key: string | object) => {
//   ensureCacheFile();
//   const cacheKey = typeof key === "object" ? JSON.stringify(key) : key;
//   try {
//     const cacheContent = fs.readFileSync(CACHE_FILE, "utf-8");

//     const cache = JSON.parse(cacheContent);

//     const result = cache[cacheKey];

//     return result ?? null;
//   } catch (error) {
//     console.error("Cache error:", error);
//     return null;
//   }
// };

// const updateCache = (key: string, value: any) => {
//   ensureCacheFile();
//   try {
//     const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
//     const updatedCache = { ...cache, [key]: value };
//     fs.writeFileSync(CACHE_FILE, JSON.stringify(updatedCache, null, 2));
//     console.log("Cache updated for key:", key);
//   } catch (error) {
//     console.error("Failed to update cache:", error);
//   }
// };
// const cleanPrompt = (prompt: LanguageModelV1Prompt) => {
//   return prompt.map((m) => {
//     if (m.role === "assistant") {
//       return m.content.map((part) =>
//         part.type === "tool-call" ? { ...part, toolCallId: "cached" } : part,
//       );
//     }
//     if (m.role === "tool") {
//       return m.content.map((tc) => ({
//         ...tc,
//         toolCallId: "cached",
//         result: {},
//       }));
//     }

//     return m;
//   });
// };

// export const cacheMiddleware: LanguageModelV1Middleware = {
//   wrapGenerate: async ({ doGenerate, params }) => {
//     const cacheKey = JSON.stringify({
//       ...cleanPrompt(params.prompt),
//       _function: "generate",
//     });
//     console.log("Cache Key:", cacheKey);

//     const cached = getCachedResult(cacheKey) as Awaited<
//       ReturnType<LanguageModelV1["doGenerate"]>
//     > | null;

//     if (cached && cached !== null) {
//       console.log("Cache Hit");
//       return {
//         ...cached,
//         response: {
//           ...cached.response,
//           timestamp: cached.response?.timestamp
//             ? new Date(cached.response.timestamp)
//             : undefined,
//         },
//       };
//     }

//     console.log("Cache Miss");
//     const result = await doGenerate();

//     updateCache(cacheKey, result);

//     return result;
//   },
//   wrapStream: async ({ doStream, params }) => {
//     const cacheKey = JSON.stringify({
//       ...cleanPrompt(params.prompt),
//       _function: "stream",
//     });
//     console.log("Cache Key:", cacheKey);

//     // Check if the result is in the cache
//     const cached = getCachedResult(cacheKey);

//     // If cached, return a simulated ReadableStream that yields the cached result
//     if (cached && cached !== null) {
//       console.log("Cache Hit");
//       // Format the timestamps in the cached response
//       const formattedChunks = (cached as LanguageModelV1StreamPart[]).map(
//         (p) => {
//           if (p.type === "response-metadata" && p.timestamp) {
//             return { ...p, timestamp: new Date(p.timestamp) };
//           } else return p;
//         },
//       );
//       return {
//         stream: simulateReadableStream({
//           initialDelayInMs: 0,
//           chunkDelayInMs: 10,
//           chunks: formattedChunks,
//         }),
//         rawCall: { rawPrompt: null, rawSettings: {} },
//       };
//     }

//     console.log("Cache Miss");
//     // If not cached, proceed with streaming
//     const { stream, ...rest } = await doStream();

//     const fullResponse: LanguageModelV1StreamPart[] = [];

//     const transformStream = new TransformStream<
//       LanguageModelV1StreamPart,
//       LanguageModelV1StreamPart
//     >({
//       transform(chunk, controller) {
//         fullResponse.push(chunk);
//         controller.enqueue(chunk);
//       },
//       flush() {
//         // Store the full response in the cache after streaming is complete
//         updateCache(cacheKey, fullResponse);
//       },
//     });

//     return {
//       stream: stream.pipeThrough(transformStream),
//       ...rest,
//     };
//   },
// };
