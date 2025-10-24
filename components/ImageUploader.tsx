
import React, { useState, useCallback } from 'react';

interface ImageUploaderProps {
    onImageUpload: (base64Image: string, mimeType: string) => void;
}

const fileToBase64 = (file: File): Promise<{base64: string, mimeType: string}> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve({ base64, mimeType: file.type });
        };
        reader.onerror = error => reject(error);
    });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = useCallback(async (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setPreview(URL.createObjectURL(file));
            const { base64, mimeType } = await fileToBase64(file);
            onImageUpload(base64, mimeType);
        }
    }, [onImageUpload]);

    const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    
    const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await handleFileChange(files[0]);
        }
    };

    return (
        <div className="w-full">
            <label
                htmlFor="image-upload"
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-linkedin-blue bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {preview ? (
                    <img src={preview} alt="Image preview" className="object-contain h-full w-full rounded-lg" />
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
                    </div>
                )}
            </label>
            <input 
                id="image-upload" 
                type="file" 
                className="hidden" 
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            />
        </div>
    );
};
