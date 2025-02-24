"use client";

import { cn } from "@/lib/utils";
import { ImageIcon, Loader2 } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { getR2ImageSrc } from "@/utils";

const Dropzone = ({
  value,
  onChange,
  className,
}: {
  value?: string;
  onChange: (src?: string) => void;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append("file", acceptedFiles[0]);

      if (value) {
        try {
          await axios.delete(`/api/images/${value}`);
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error(e.response?.data ? e.response.data : e.message);
            toast.error("Nie udało się usunąć poprzedniego obrazka");
          }
        }
      }

      try {
        const res = await axios.post("/api/images", formdata);
        onChange(res.data.id);
      } catch (e) {
        if (e instanceof AxiosError) {
          console.error(e.response?.data ? e.response.data : e.message);
          toast.error("Nie udało się przesłać obrazka");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [onChange, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".avif", ".webp"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "p-6 rounded-xl overflow-hidden border border-dashed text-center cursor-pointer hover:bg-accent transition-colors relative flex flex-col items-center justify-center",
        {
          "border-emerald-700": isDragActive,
          "opacity-50 animate-pulse": isLoading,
        },
        className
      )}
    >
      <input {...getInputProps()} />
      {value ? (
        <Image
          height={400}
          width={400}
          alt=""
          src={getR2ImageSrc(value)}
          unoptimized
          className="mx-auto max-w-xs w-full rounded-lg aspect-[4/3] object-cover mb-4"
        />
      ) : (
        <ImageIcon className="mx-auto mb-2 text-muted-foreground" />
      )}
      {isDragActive ? (
        <p className="text-emerald-700 font-medium text-sm">Upuść tutaj...</p>
      ) : (
        <p className="text-muted-foreground text-sm">
          <span className="text-emerald-700 font-medium">
            Kliknij aby {value ? "zmienić" : "dodać"}
          </span>
          <span> lub przeciągnij i upuść</span>
        </p>
      )}
      {!value && (
        <p className="text-xs text-muted-foreground">
          PNG, JPG, AVIF lub WEBP (max 5MB)
        </p>
      )}
      {isLoading && (
        <div className="size-full absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-sm">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Dropzone;
