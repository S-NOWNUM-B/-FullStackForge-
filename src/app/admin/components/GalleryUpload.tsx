"use client";

import React, { useState, useCallback } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GalleryImage } from "@/types/api";

interface GalleryUploadProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  folder?: string;
}

export const GalleryUpload: React.FC<GalleryUploadProps> = ({
  images,
  onChange,
  folder = "projects/gallery",
}) => {
  const [uploadingCount, setUploadingCount] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploadingCount((prev) => prev + acceptedFiles.length);

      const uploadPromises = acceptedFiles.map(async (file) => {
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const storageRef = ref(storage, `${folder}/${fileName}`);

        try {
          const uploadTask = await uploadBytesResumable(storageRef, file);
          const url = await getDownloadURL(uploadTask.ref);
          const newImage: GalleryImage = {
            url,
            description: "",
            title: file.name,
            type: "screenshot",
          };
          return newImage;
        } catch (error) {
          console.error("Upload error:", error);
          toast.error(`Ошибка при загрузке ${file.name}`);
          return null;
        }
      });

      const newImages = (await Promise.all(uploadPromises)).filter(
        (img): img is GalleryImage => img !== null,
      );

      onChange([...images, ...newImages]);
      setUploadingCount((prev) => Math.max(0, prev - acceptedFiles.length));
      if (newImages.length > 0) {
        toast.success(`Загружено ${newImages.length} изображений`);
      }
    },
    [images, onChange, folder],
  );

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const updateDescription = (index: number, description: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], description };
    onChange(newImages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
    multiple: true,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {images.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800/30 transition-all hover:border-red-500/50"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={image.url}
                alt={image.title || "Gallery image"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 z-10 rounded-md bg-red-500 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 shadow-lg"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            <div className="p-1.5 flex items-center bg-gray-900/40">
              <input
                type="text"
                placeholder="Описание..."
                value={image.description}
                onChange={(e) => updateDescription(index, e.target.value)}
                className="w-full bg-transparent text-[10px] text-gray-300 outline-none placeholder:text-gray-600"
              />
            </div>
          </div>
        ))}

        {uploadingCount > 0 &&
          Array.from({ length: uploadingCount }).map((_, i) => (
            <div
              key={`uploading-${i}`}
              className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-800/50"
            >
              <Loader2 className="h-5 w-5 animate-spin text-red-500" />
            </div>
          ))}

        <div
          {...getRootProps()}
          className={`flex aspect-video cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed transition-all ${
            isDragActive
              ? "border-red-500 bg-red-500/10"
              : "border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50"
          }`}
        >
          <input {...getInputProps()} />
          <Plus className="h-5 w-5 text-gray-500" />
          <span className="text-[10px] font-medium text-gray-500">
            {isDragActive ? "Отпустите" : "Добавить"}
          </span>
        </div>
      </div>
      <p className="text-[10px] text-gray-500">
        Вы можете загрузить несколько файлов одновременно. Рекомендуемый размер:
        1920x1080.
      </p>
    </div>
  );
};
