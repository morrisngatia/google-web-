export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  iconLink?: string;
  modifiedTime?: string;
}

/**
 * List files from the user's Google Drive.
 * Supports searching and listing.
 */
export async function listDriveFiles(token: string, q?: string): Promise<GoogleDriveFile[]> {
  let url = "https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,size,webViewLink,iconLink,modifiedTime)&orderBy=folder,modifiedTime desc";
  if (q) {
    url += `&q=${encodeURIComponent(q)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to list files: ${response.status}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Create a new folder on Google Drive.
 */
export async function createDriveFolder(token: string, name: string, parentId?: string): Promise<GoogleDriveFile> {
  const metadata = {
    name,
    mimeType: "application/vnd.google-apps.folder",
    parents: parentId ? [parentId] : undefined,
  };

  const response = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,webViewLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to create folder: ${response.status}`);
  }

  return response.json();
}

/**
 * Upload a local file (Blob/File) to Google Drive using a standard multipart request.
 */
export async function uploadDriveFile(
  token: string,
  file: Blob | File,
  name: string,
  mimeType: string,
  parentId?: string
): Promise<GoogleDriveFile> {
  const metadata = {
    name,
    mimeType,
    parents: parentId ? [parentId] : undefined,
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", file);

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,iconLink,modifiedTime",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to upload file: ${response.status}`);
  }

  return response.json();
}

/**
 * Delete a file or folder from Google Drive.
 * WARNING: Destructive operation. Always confirm with user before invoking.
 */
export async function deleteDriveFile(token: string, fileId: string): Promise<void> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to delete file: ${response.status}`);
  }
}
