import {
  DriveRawFile,
  DriveVideoItem,
  CategoryGroup,
  DriveAuditWarning,
  DriveCMSData,
} from "@/types/drive";
import sampleData from "@/data/sample.json";

// In-memory cache for fallback when Google Drive API throws or hits quota
let lastGoodDriveData: DriveCMSData | null = null;
let lastSyncTimestamp: number = 0;

/**
 * Strips order prefix (e.g. "01 - ", "02_ ", "01. "), star markers ("⭐", "*"), and extension
 */
export function cleanTitle(fileName: string): string {
  // Remove file extension
  let clean = fileName.replace(/\.[^/.]+$/, "");
  // Remove leading star emoji or asterisk
  clean = clean.replace(/^[⭐*]\s*/u, "");
  // Remove numeric order prefixes like "01 - ", "02_ ", "03. ", "04 "
  clean = clean.replace(/^\d+[\s\-_.]+\s*/, "");
  return clean.trim();
}

/**
 * Extracts numeric order prefix if present at the start of filename (e.g. "01 - " -> 1)
 */
export function extractOrderPrefix(fileName: string): number | null {
  const match = fileName.replace(/^[⭐*]\s*/u, "").match(/^(\d+)[\s\-_.]/);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    return isNaN(num) ? null : num;
  }
  return null;
}

/**
 * Checks if a file or folder is marked as featured (starts with ⭐ or *)
 */
export function isFeaturedFile(fileName: string): boolean {
  return /^[⭐*]/u.test(fileName.trim());
}

/**
 * Checks if a file or folder is hidden (starts with _)
 */
export function isHiddenFile(fileName: string): boolean {
  return fileName.trim().startsWith("_");
}

/**
 * Generates URL-safe slug supporting Arabic and Latin characters
 */
export function slugifyCategory(name: string): string {
  // Strip emojis for slug
  const noEmoji = name.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/gu, "").trim();
  const base = noEmoji || name;
  return (
    base
      .toLowerCase()
      .trim()
      .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, " ")
      .replace(/[\s\-_]+/g, "-")
      .replace(/[^\w\u0600-\u06FF\-]/g, "")
      .replace(/^-+|-+$/g, "") || "category"
  );
}

/**
 * Formats duration in milliseconds to MM:SS or HH:MM:SS
 */
export function formatDurationMillis(millis?: string | number): string {
  if (!millis) return "00:00";
  const totalSeconds = Math.floor(Number(millis) / 1000);
  if (isNaN(totalSeconds) || totalSeconds <= 0) return "00:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Checks if a description begins with a YouTube or Vimeo URL
 */
export function extractExternalPlayerUrls(description?: string): {
  youtube: string | null;
  vimeo: string | null;
} {
  if (!description) return { youtube: null, vimeo: null };
  const firstWord = description.trim().split(/\s+/)[0];

  // YouTube match
  const ytMatch = firstWord.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_\-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      youtube: `https://www.youtube.com/embed/${ytMatch[1]}`,
      vimeo: null,
    };
  }

  // Vimeo match
  const vimeoMatch = firstWord.match(
    /(?:https?:\/\/)?(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      youtube: null,
      vimeo: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return { youtube: null, vimeo: null };
}

/**
 * Internal raw Google Drive fetcher with pagination
 */
async function fetchFolderFiles(
  folderId: string,
  apiKey: string
): Promise<DriveRawFile[]> {
  const allFiles: DriveRawFile[] = [];
  let pageToken: string | null = null;

  const fields =
    "nextPageToken, files(id,name,mimeType,description,createdTime,modifiedTime,thumbnailLink,videoMediaMetadata(width,height,durationMillis),shortcutDetails,parents)";

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      pageSize: "1000",
      fields,
      key: apiKey,
    });
    if (pageToken) {
      params.set("pageToken", pageToken);
    }

    const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
    const res = await fetch(url, {
      next: { revalidate: 300 }, // 5 minutes ISR
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Google Drive API error (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    if (Array.isArray(data.files)) {
      allFiles.push(...data.files);
    }
    pageToken = data.nextPageToken || null;
  } while (pageToken);

  return allFiles;
}

/**
 * Main Drive-as-CMS Data Provider
 * Fetches root folder, recurses to depth 2 for categories, processes custom covers,
 * detects metadata, generates audit warnings, and falls back to last good data or sample mock.
 */
export async function getDrivePortfolioData(forceFresh: boolean = false): Promise<DriveCMSData> {
  const apiKey = process.env.GOOGLE_API_KEY;
  const rootFolderId = process.env.DRIVE_FOLDER_ID;

  // If credentials are not supplied, return sample mock immediately
  if (!apiKey || !rootFolderId) {
    return sampleData as unknown as DriveCMSData;
  }

  try {
    // 1. Fetch Root Level Items
    const rootFiles = await fetchFolderFiles(rootFolderId, apiKey);

    // Resolve shortcuts
    const resolvedRootFiles: DriveRawFile[] = rootFiles.map((file) => {
      if (
        file.mimeType === "application/vnd.google-apps.shortcut" &&
        file.shortcutDetails?.targetId
      ) {
        return {
          ...file,
          id: file.shortcutDetails.targetId,
          mimeType: file.shortcutDetails.targetMimeType || file.mimeType,
        };
      }
      return file;
    });

    // Detect Root CV.pdf and profile.jpg/png
    let profileImageUrl: string | null = null;
    let cvDownloadUrl: string | null = null;

    for (const f of resolvedRootFiles) {
      const lower = f.name.toLowerCase();
      if (/^profile\.(jpe?g|png|webp)$/i.test(lower)) {
        profileImageUrl = f.thumbnailLink ? f.thumbnailLink.replace(/=s\d+/, "=s1000") : `https://drive.google.com/thumbnail?id=${f.id}&sz=w1000`;
      }
      if (/^cv\.pdf$/i.test(lower)) {
        cvDownloadUrl = `https://drive.google.com/file/d/${f.id}/view?usp=sharing`;
      }
    }

    // Identify category sub-folders (depth 1)
    const categoryFolders = resolvedRootFiles.filter(
      (f) =>
        f.mimeType === "application/vnd.google-apps.folder" &&
        !isHiddenFile(f.name)
    );

    // Collect all video files and image files across subfolders + root
    interface FolderContext {
      folderId: string;
      categoryName: string;
      categoryOrder: number;
    }

    const folderContexts: FolderContext[] = [
      // Root folder videos fall into "All" / "Featured"
      { folderId: rootFolderId, categoryName: "All Works", categoryOrder: 0 },
      ...categoryFolders.map((cf, idx) => ({
        folderId: cf.id,
        categoryName: cf.name,
        categoryOrder: extractOrderPrefix(cf.name) ?? idx + 1,
      })),
    ];

    // Fetch children for each category subfolder (depth 2)
    const allScannedFiles: { file: DriveRawFile; category: FolderContext }[] = [];

    // Add root files
    for (const rf of resolvedRootFiles) {
      if (rf.mimeType !== "application/vnd.google-apps.folder") {
        allScannedFiles.push({ file: rf, category: folderContexts[0] });
      }
    }

    // Fetch subfolders in parallel
    const subfolderPromises = categoryFolders.map(async (cf) => {
      try {
        const subFiles = await fetchFolderFiles(cf.id, apiKey);
        return { folderId: cf.id, files: subFiles };
      } catch (err) {
        console.error(`Failed to fetch subfolder ${cf.name} (${cf.id}):`, err);
        return { folderId: cf.id, files: [] };
      }
    });

    const subfolderResults = await Promise.all(subfolderPromises);
    const subfolderFilesMap = new Map<string, DriveRawFile[]>();
    for (const res of subfolderResults) {
      subfolderFilesMap.set(res.folderId, res.files);
    }

    for (const ctx of folderContexts.slice(1)) {
      const files = subfolderFilesMap.get(ctx.folderId) || [];
      for (const sf of files) {
        allScannedFiles.push({ file: sf, category: ctx });
      }
    }

    // Map custom cover images by folder + base name
    // e.g. folderId + "::" + baseName -> image url
    const customCoversMap = new Map<string, string>();
    for (const item of allScannedFiles) {
      const { file, category } = item;
      if (
        file.mimeType.startsWith("image/") &&
        !isHiddenFile(file.name)
      ) {
        const baseName = file.name.replace(/\.[^/.]+$/, "").trim().toLowerCase();
        const key = `${category.folderId}::${baseName}`;
        const highResUrl = file.thumbnailLink
          ? file.thumbnailLink.replace(/=s\d+/, "=s1920")
          : `https://drive.google.com/thumbnail?id=${file.id}&sz=w1920`;
        customCoversMap.set(key, highResUrl);
      }
    }

    // Filter, process, and sanitize video items
    const warnings: DriveAuditWarning[] = [];
    const videoItems: DriveVideoItem[] = [];
    const seenVideoIds = new Set<string>();
    const seenTitlesInFolder = new Map<string, Set<string>>();

    for (const item of allScannedFiles) {
      const { file, category } = item;

      // Ignore hidden files
      if (isHiddenFile(file.name)) continue;

      // Only process video mimeTypes
      const isVideo =
        file.mimeType.startsWith("video/") ||
        /\.(mp4|mov|mkv|webm|avi|m4v)$/i.test(file.name);

      if (!isVideo) continue;

      // Deduplicate by ID
      if (seenVideoIds.has(file.id)) continue;
      seenVideoIds.add(file.id);

      // Check duplicate titles in folder
      const folderKey = category.folderId;
      if (!seenTitlesInFolder.has(folderKey)) {
        seenTitlesInFolder.set(folderKey, new Set<string>());
      }
      const titleSet = seenTitlesInFolder.get(folderKey)!;
      const clean = cleanTitle(file.name);
      if (titleSet.has(clean.toLowerCase())) {
        warnings.push({
          type: "duplicate_name",
          message: `Duplicate video title "${clean}" in category "${category.categoryName}".`,
          targetId: file.id,
          targetName: file.name,
        });
      } else {
        titleSet.add(clean.toLowerCase());
      }

      // Check custom cover
      const baseName = file.name.replace(/\.[^/.]+$/, "").trim().toLowerCase();
      const customCoverKey = `${category.folderId}::${baseName}`;
      const customCover = customCoversMap.get(customCoverKey) || null;

      // Check external embeds in description (YouTube / Vimeo)
      const embeds = extractExternalPlayerUrls(file.description);

      // Orientation and aspect ratio
      const width = file.videoMediaMetadata?.width;
      const height = file.videoMediaMetadata?.height;
      let orientation: "vertical" | "horizontal" | "unknown" = "unknown";
      let aspectRatio: "9:16" | "16:9" | "unknown" = "unknown";
      const isProcessing = !width || !height;

      if (width && height) {
        if (height > width) {
          orientation = "vertical";
          aspectRatio = "9:16";
        } else {
          orientation = "horizontal";
          aspectRatio = "16:9";
        }
      }

      if (isProcessing) {
        warnings.push({
          type: "processing",
          message: `Video "${clean}" is still processing or has no video metadata from Google Drive yet.`,
          targetId: file.id,
          targetName: file.name,
        });
      }

      // High-resolution thumbnail
      let thumbUrl = customCover;
      if (!thumbUrl && file.thumbnailLink) {
        thumbUrl = file.thumbnailLink.replace(/=s\d+/, "=s1280");
      }
      if (!thumbUrl) {
        thumbUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1280`;
        warnings.push({
          type: "missing_thumbnail",
          message: `Video "${clean}" has no custom cover image or generated thumbnail.`,
          targetId: file.id,
          targetName: file.name,
        });
      }

      const order = extractOrderPrefix(file.name);
      const featured = isFeaturedFile(file.name);

      videoItems.push({
        id: file.id,
        title: clean,
        originalName: file.name,
        orderPrefix: order,
        isFeatured: featured,
        isHidden: false,
        category: category.categoryName,
        categorySlug: slugifyCategory(category.categoryName),
        description: file.description ? file.description.trim() : "",
        customCoverUrl: customCover,
        thumbnailUrl: thumbUrl,
        previewUrl: `https://drive.google.com/file/d/${file.id}/preview`,
        youtubeFallbackUrl: embeds.youtube,
        vimeoFallbackUrl: embeds.vimeo,
        orientation,
        aspectRatio,
        width,
        height,
        durationMillis: file.videoMediaMetadata?.durationMillis
          ? Number(file.videoMediaMetadata.durationMillis)
          : undefined,
        formattedDuration: formatDurationMillis(file.videoMediaMetadata?.durationMillis),
        isProcessing,
        createdTime: file.createdTime || new Date().toISOString(),
        modifiedTime: file.modifiedTime || new Date().toISOString(),
      });
    }

    // Sort videos: explicit numeric prefix first (ascending: 1, 2, 3), then newest createdTime first
    videoItems.sort((a, b) => {
      if (a.orderPrefix !== null && b.orderPrefix !== null) {
        return a.orderPrefix - b.orderPrefix;
      }
      if (a.orderPrefix !== null) return -1;
      if (b.orderPrefix !== null) return 1;
      return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
    });

    // Build category groups
    const categoryCounts = new Map<string, number>();
    for (const v of videoItems) {
      categoryCounts.set(v.category, (categoryCounts.get(v.category) || 0) + 1);
    }

    // Check for empty folders
    for (const cf of categoryFolders) {
      const count = categoryCounts.get(cf.name) || 0;
      if (count === 0) {
        warnings.push({
          type: "empty_folder",
          message: `Category folder "${cf.name}" contains no valid video files.`,
          targetId: cf.id,
          targetName: cf.name,
        });
      }
    }

    // Construct ordered category list
    const categoryGroups: CategoryGroup[] = [];
    const addedSlugs = new Set<string>();

    for (const ctx of folderContexts) {
      const count = categoryCounts.get(ctx.categoryName) || 0;
      // Do not list empty categories in public list unless it's root
      if (count === 0 && ctx.folderId !== rootFolderId) continue;

      const slug = slugifyCategory(ctx.categoryName);
      if (addedSlugs.has(slug)) continue;
      addedSlugs.add(slug);

      // Extract emoji if present in folder name
      const emojiMatch = ctx.categoryName.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u);

      categoryGroups.push({
        name: ctx.categoryName,
        slug,
        count,
        order: ctx.categoryOrder,
        emoji: emojiMatch ? emojiMatch[0] : undefined,
      });
    }

    // Sort categories by order prefix
    categoryGroups.sort((a, b) => a.order - b.order);

    const featuredVideos = videoItems.filter((v) => v.isFeatured);

    const result: DriveCMSData = {
      categories: categoryGroups,
      videos: videoItems,
      featuredVideos: featuredVideos.length > 0 ? featuredVideos : videoItems.slice(0, 4),
      profileImage: profileImageUrl || (sampleData as unknown as DriveCMSData).profileImage,
      cvUrl: cvDownloadUrl,
      lastSyncTime: new Date().toISOString(),
      isMock: false,
      warnings,
      stats: {
        totalVideos: videoItems.length,
        totalCategories: categoryGroups.length,
        verticalCount: videoItems.filter((v) => v.orientation === "vertical").length,
        horizontalCount: videoItems.filter((v) => v.orientation === "horizontal").length,
        featuredCount: featuredVideos.length,
      },
    };

    // Store in-memory cache for graceful fallback
    lastGoodDriveData = result;
    lastSyncTimestamp = Date.now();

    return result;
  } catch (error) {
    console.error("Error connecting to Google Drive API:", error);

    // If we have a previously cached good response, serve it to prevent site breakage
    if (lastGoodDriveData) {
      return {
        ...lastGoodDriveData,
        warnings: [
          ...lastGoodDriveData.warnings,
          {
            type: "inaccessible",
            message: `Serving cached data: Google Drive connection failed with "${(error as Error).message}".`,
          },
        ],
      };
    }

    // Otherwise fall back to rich local sample mock
    return {
      ...(sampleData as unknown as DriveCMSData),
      warnings: [
        {
          type: "inaccessible",
          message: `Drive API error: ${(error as Error).message}. Loaded local sample fallback.`,
        },
      ],
    };
  }
}

/**
 * Quick access to in-memory cached state without triggering fetch
 */
export function getCachedDriveData(): DriveCMSData | null {
  return lastGoodDriveData;
}

/**
 * Resets the in-memory cache (called on /api/revalidate)
 */
export function clearDriveDataCache(): void {
  lastGoodDriveData = null;
  lastSyncTimestamp = 0;
}
