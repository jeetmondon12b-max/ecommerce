import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { FiCrop, FiX } from 'react-icons/fi';

const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }
            ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
            canvas.toBlob((blob) => {
                if (!blob) {
                    return reject(new Error('Canvas is empty'));
                }
                blob.name = 'cropped_banner.jpeg';
                resolve(blob);
            }, 'image/jpeg', 0.95);
        };
        image.onerror = (error) => reject(error);
    });
};

const ImageCropModal = ({ image, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSaveCrop = async () => {
        if (image && croppedAreaPixels) {
            try {
                const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
                // ✅ সমাধান: এখন শুধু ছবিটি প্যারেন্টকে ফেরত পাঠানো হবে।
                // মডাল বন্ধ করার দায়িত্ব প্যারেন্টের।
                onCropComplete(croppedImageBlob);
                // onClose(); // ❌ এই লাইনটি এখান থেকে সরানো হয়েছে।
            } catch (e) {
                console.error('Error cropping image:', e);
                alert('Could not crop the image. Please try another image.');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Crop Your Banner</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <FiX size={24} />
                    </button>
                </div>
                <div className="relative flex-grow">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={16 / 7}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                    />
                </div>
                <div className="p-4 border-t space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Zoom</label>
                        <input
                            type="range"
                            value={zoom}
                            min={1} max={3} step={0.1}
                            onChange={(e) => setZoom(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <button
                        onClick={handleSaveCrop}
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
                    >
                        <FiCrop /> Crop & Save Image
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;