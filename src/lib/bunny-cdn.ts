import type { StorageObject, ApiResponse } from "@/types/bunny_cdn_type";

// This wrapper keeps Bunny CDN upload logic out of the API routes so post
// creation can focus on validation and persistence.
const BUNNY_STORAGE_ZONE_NAME =
  process.env.BUNNY_STORAGE_ZONE_NAME || "fullstackdev";
const BUNNY_STORAGE_REGION_HOSTNAME =
  process.env.BUNNY_STORAGE_REGION_HOSTNAME || "sg.storage.bunnycdn.com";
const BUNNY_STORAGE_API_KEY =
  process.env.BUNNY_STORAGE_API_KEY ||
  "0769c8e5-40f5-4a9e-82e06657cde9-80a6-4996";

export class BunnyStorageService {
  private apiKey: string;
  private storageZoneName: string;
  private regionHostname: string;

  constructor() {
    this.apiKey = BUNNY_STORAGE_API_KEY;
    this.storageZoneName = BUNNY_STORAGE_ZONE_NAME;
    this.regionHostname = BUNNY_STORAGE_REGION_HOSTNAME;

    if (!this.apiKey || !this.storageZoneName || !this.regionHostname) {
      throw new Error(
        "Bunny Storage environment variables are not configured. Please set BUNNY_STORAGE_API_KEY, BUNNY_STORAGE_ZONE_NAME, and BUNNY_STORAGE_REGION_HOSTNAME."
      );
    }
  }

  /**
   * Constructs the full API URL for a given path in the storage zone.
   * @param path - The relative path to the file or directory.
   * @returns The full API endpoint URL.
   */
  private getApiUrl(path: string = ""): string {
    return `https://${this.regionHostname}/${this.storageZoneName}/${path}`;
  }

  /**
   * Handles the response from the Bunny API, throwing an error for non-successful responses.
   * @param response - The raw fetch response object.
   */
  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData: ApiResponse = await response.json();
      throw new Error(
        `Bunny API Error (${errorData.HttpCode}): ${errorData.Message}`
      );
    }
    return response.json();
  }

  /**
   * Lists all files and subdirectories within a specific path.
   * @param path - The directory path to list. MUST end with a '/' to list a directory.
   *               Omit to list the root directory.
   * @returns A promise that resolves to an array of storage objects.
   */
  async listFiles(path: string = ""): Promise<StorageObject[]> {
    const bunnyPath = path.endsWith("/") || path === "" ? path : `${path}/`;

    const response = await fetch(this.getApiUrl(bunnyPath), {
      method: "GET",
      headers: {
        AccessKey: this.apiKey,
      },
    });

    return this.handleResponse(response) as Promise<StorageObject[]>;
  }

  /**
   * Downloads a file from the storage zone.
   * @param filePath - The full path to the file you want to download (e.g., 'images/logo.png').
   * @returns A promise that resolves to the raw fetch Response object. The consumer is responsible
   *          for processing the body (e.g., with .buffer(), .blob(), or streaming it).
   */
  async downloadFile(filePath: string): Promise<Response> {
    const response = await fetch(this.getApiUrl(filePath), {
      method: "GET",
      headers: {
        AccessKey: this.apiKey,
      },
    });

    if (!response.ok) {
      const errorData: ApiResponse = await response.json();
      throw new Error(
        `Bunny API Error (${errorData.HttpCode}): ${errorData.Message}`
      );
    }

    return response;
  }

  /**
   * Uploads a file to a specified path. Creates directory structure if it doesn't exist.
   * @param destinationPath - The full path where the file will be saved (e.g., 'uploads/new-file.jpg').
   * @param fileData - The file content as a Buffer.
   * @param fileMimeType - The MIME type of the file (e.g., 'image/jpeg').
   * @param checksum - (Optional) An uppercase SHA256 checksum for integrity validation.
   * @returns A promise that resolves to a success response object.
   */
  async uploadFile(
    destinationPath: string,
    fileData: ArrayBuffer | ArrayLike<number>,
    fileMimeType: string = "application/octet-stream",
    checksum?: string
  ): Promise<ApiResponse> {
    const headers: { [key: string]: string } = {
      AccessKey: this.apiKey,
      "Content-Type": fileMimeType,
    };

    if (checksum) {
      headers["Checksum"] = checksum;
    }

    const blobPart =
      fileData instanceof ArrayBuffer
        ? fileData
        : Uint8Array.from(fileData).buffer;

    const response = await fetch(this.getApiUrl(destinationPath), {
      method: "PUT",
      headers: headers,
      body: new Blob([blobPart], { type: fileMimeType }),
    });

    return this.handleResponse(response);
  }

  /**
   * Deletes an object (a file or a directory) from the storage zone.
   * If the target is a directory, all of its contents will be deleted recursively.
   * @param objectPath - The path to the file or directory to delete. To delete a directory,
   *                     ensure the path ends with a '/'. (e.g., 'old-file.txt' or 'temp-uploads/').
   * @returns A promise that resolves to a success response object.
   */
  async deleteObject(objectPath: string): Promise<ApiResponse> {
    const response = await fetch(this.getApiUrl(objectPath), {
      method: "DELETE",
      headers: {
        AccessKey: this.apiKey,
      },
    });

    return this.handleResponse(response);
  }
}

export const bunnyStorageService = new BunnyStorageService();
