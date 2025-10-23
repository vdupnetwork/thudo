/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, DownloadIcon, Trash2Icon, LibraryIcon } from './icons';
import { LibraryImage, getAllLibraryImages, deleteLibraryImage } from '../lib/db';
import Spinner from './Spinner';

interface LibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose }) => {
    const [images, setImages] = useState<LibraryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchImages = useCallback(async () => {
        setIsLoading(true);
        try {
            const storedImages = await getAllLibraryImages();
            setImages(storedImages);
        } catch (error) {
            console.error("Failed to fetch library images:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchImages();
        }
    }, [isOpen, fetchImages]);

    const handleDelete = async (id: number) => {
        try {
            await deleteLibraryImage(id);
            setImages(prevImages => prevImages.filter(img => img.id !== id));
        } catch (error) {
            console.error("Failed to delete image:", error);
        }
    };

    const handleDownload = (dataUrl: string, id: number) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `thu-vien-anh-${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    aria-labelledby="library-modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl"
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 id="library-modal-title" className="text-2xl font-serif text-gray-800">Thư viện ảnh</h2>
                            <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800" aria-label="Đóng thư viện">
                                <XIcon className="w-6 h-6"/>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Spinner />
                                </div>
                            ) : images.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {images.map((image) => (
                                        <div key={image.id} className="group relative aspect-[2/3] border rounded-lg overflow-hidden animate-fade-in">
                                            <img src={image.dataUrl} alt={`Saved image ${image.id}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-2 gap-2">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleDownload(image.dataUrl, image.id)} className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40" aria-label="Tải ảnh xuống">
                                                        <DownloadIcon className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(image.id)} className="p-2 bg-white/20 text-white rounded-full hover:bg-red-500/80" aria-label="Xóa ảnh">
                                                        <Trash2Icon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <p className="text-white text-xs">{new Date(image.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center h-64 text-gray-500">
                                    <LibraryIcon className="w-16 h-16 mb-4" />
                                    <h3 className="text-xl font-serif text-gray-700">Thư viện của bạn trống</h3>
                                    <p className="mt-2">Lưu ảnh đã tạo để xem lại chúng ở đây.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LibraryModal;
