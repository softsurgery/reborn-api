export const STORAGE_FOLDER_SYSTEMATICS = {
  JOB_UPLOADS: 'folder:job-uploads',
  USER_PROFILE_PICTURES: 'folder:user-profile-pictures',
  USER_COVERS: 'folder:user-covers',
  USER_UPLOADS: 'folder:user-uploads',
  PUBLIC_RESOURCES: 'folder:public-resources',
  CHAT_ATTACHMENTS: 'folder:chat-attachments',
  TEMPORARY: 'folder:temporary',
} as const;

export const jobUploadFolderSystematic = (jobId: string): string =>
  `${STORAGE_FOLDER_SYSTEMATICS.JOB_UPLOADS}:${jobId}`;
