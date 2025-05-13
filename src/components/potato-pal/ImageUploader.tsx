"use client";

import { useState, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageSelect: (file: File, imageDataUrl: string) => void;
  disabled?: boolean;
}

export function ImageUploader({ onImageSelect, disabled }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (e.g., JPG, PNG).",
          variant: "destructive",
        });
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-upload" className="text-lg font-semibold">Upload Potato Leaf Image</Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          disabled={disabled}
        />
      </div>
      {preview ? (
        <div className="mt-4 p-4 border border-dashed border-border rounded-lg aspect-video relative bg-muted/50 flex items-center justify-center overflow-hidden">
          <Image src={preview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
        </div>
      ) : (
        <div className="mt-4 p-4 border border-dashed border-border rounded-lg aspect-video bg-muted/50 flex flex-col items-center justify-center text-muted-foreground">
          <UploadCloud className="h-16 w-16 mb-2" />
          <p>Image preview will appear here</p>
          <p className="text-sm">Max file size: 5MB</p>
        </div>
      )}
    </div>
  );
}
