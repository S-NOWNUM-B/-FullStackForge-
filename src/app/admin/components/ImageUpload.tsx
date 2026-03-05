"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove: () => void;
  value?: string;
  label?: string;
  folder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onRemove,
  value,
  label = "Изображение",
  folder = "projects",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      setIsUploading(true);
      setProgress(0);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(p));
        },
        (error) => {
          console.error("Upload error:", error);
          toast.error("Ошибка при загрузке изображения");
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUpload(downloadURL);
          setIsUploading(false);
          toast.success("Изображение успешно загружено");
        },
      );
    },
    [onUpload, folder],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading || !!value,
  });

  if (value) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <div className="relative group aspect-video w-full overflow-hidden rounded-xl border-2 border-gray-700">
          <Image
            src={value}
            alt="Uploaded"
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="rounded-full bg-red-500 p-3 text-white shadow-lg transition-transform hover:scale-110 hover:bg-red-600 active:scale-95"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <div
        {...getRootProps()}
        className={`relative flex min-h-48 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-all duration-200 ${
          isDragActive
            ? "border-red-500 bg-red-500/10"
            : "border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50"
        } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-red-500" />
              <span className="absolute text-[10px] font-bold text-white">
                {progress}%
              </span>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-white">Загрузка...</p>
              <p className="text-xs text-gray-500">Пожалуйста, подождите</p>
            </div>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-gray-700/50 p-4">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-300">
                {isDragActive
                  ? "Отпустите файл"
                  : "Нажмите или перетащите файл"}
              </p>
              <p className="text-xs text-gray-500">
                Макс. размер файла 10МБ (JPEG, PNG, WebP)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
