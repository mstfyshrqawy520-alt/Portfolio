export interface DriveRawFile {
  id: string;
  name: string;
  mimeType: string;
  description?: string;
  createdTime?: string;
  modifiedTime?: string;
  thumbnailLink?: string;
  videoMediaMetadata?: {
    width?: number;
    height?: number;
    durationMillis?: string;
  };
  shortcutDetails?: {
    targetId?: string;
    targetMimeType?: string;
  };
  parents?: string[];
}

export interface DriveVideoItem {
  id: string;
  title: string;
  originalName: string;
  orderPrefix: number | null;
  isFeatured: boolean;
  isHidden: boolean;
  category: string;
  categorySlug: string;
  description: string;
  customCoverUrl: string | null;
  thumbnailUrl: string;
  previewUrl: string;
  youtubeFallbackUrl: string | null;
  vimeoFallbackUrl: string | null;
  orientation: "vertical" | "horizontal" | "unknown";
  aspectRatio: "9:16" | "16:9" | "unknown";
  width?: number;
  height?: number;
  durationMillis?: number;
  formattedDuration: string;
  isProcessing: boolean;
  createdTime: string;
  modifiedTime: string;
}

export interface CategoryGroup {
  name: string;
  slug: string;
  count: number;
  order: number;
  emoji?: string;
}

export interface DriveAuditWarning {
  type: "empty_folder" | "processing" | "missing_thumbnail" | "duplicate_name" | "inaccessible" | "info";
  message: string;
  targetId?: string;
  targetName?: string;
}

export interface DriveCMSData {
  categories: CategoryGroup[];
  videos: DriveVideoItem[];
  featuredVideos: DriveVideoItem[];
  profileImage: string | null;
  cvUrl: string | null;
  lastSyncTime: string;
  isMock: boolean;
  warnings: DriveAuditWarning[];
  stats: {
    totalVideos: number;
    totalCategories: number;
    verticalCount: number;
    horizontalCount: number;
    featuredCount: number;
  };
}
