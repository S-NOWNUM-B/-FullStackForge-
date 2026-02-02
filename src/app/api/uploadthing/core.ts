import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter для приложения
export const ourFileRouter = {
  // Загрузчик изображений проектов
  projectImageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("file url", file.url);
      return { uploadedBy: metadata };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
