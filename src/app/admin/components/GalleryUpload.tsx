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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-800/30 transition-all hover:border-red-500/50"
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
                className="absolute right-2 top-2 z-10 rounded-lg bg-red-500 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 shadow-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3">
              <input
                type="text"
                placeholder="Описание (например: Главный экран)"
                value={image.description}
                onChange={(e) => updateDescription(index, e.target.value)}
                className="w-full bg-transparent text-xs text-gray-300 outline-none placeholder:text-gray-500"
              />
            </div>
          </div>
        ))}

        {uploadingCount > 0 &&
          Array.from({ length: uploadingCount }).map((_, i) => (
            <div
              key={`uploading-${i}`}
              className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/50"
            >
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                <span className="text-xs text-gray-500">Загрузка...</span>
              </div>
            </div>
          ))}

        <div
          {...getRootProps()}
          className={`flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all ${
            isDragActive
              ? "border-red-500 bg-red-500/10"
              : "border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="rounded-full bg-gray-700/50 p-3">
            <Plus className="h-6 w-6 text-gray-400" />
          </div>
          <span className="text-xs font-medium text-gray-400">
            {isDragActive ? "Отпустите для загрузки" : "Добавить скриншоты"}
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
