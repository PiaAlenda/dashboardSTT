import { useState, useEffect, useRef } from 'react';
import { Download, Loader2, AlertCircle, ChevronLeft, ChevronRight, FileSearch, ZoomIn, X, RotateCw } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { enrollmentService } from '../../../services/enrollmentService';

interface EnrollmentFilePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    dni: string;
    fullName: string;
}

interface FileData {
    url: string;
    mimeType: string;
    fileName?: string;
}

export const EnrollmentFilePreview = ({ isOpen, onClose, dni, fullName }: EnrollmentFilePreviewProps) => {
    const [files, setFiles] = useState<FileData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(0);
    const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
    const [rotation, setRotation] = useState(0);
    const imgRef = useRef<HTMLImageElement>(null);

    // Bloquear scroll al hacer zoom
    useEffect(() => {
        if (isZoomed) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isZoomed]);

    useEffect(() => {
        if (isOpen && dni) {
            loadFile();
        }
        return () => {
            files.forEach(f => URL.revokeObjectURL(f.url));
        };
    }, [isOpen, dni]);

    const loadFile = async () => {
        setIsLoading(true);
        setError(null);
        setFiles([]);
        setCurrentIndex(0);
        try {
            const blob = await enrollmentService.getFileBlob(dni);

            if (!blob || blob.size < 100) {
                setFiles([]);
                return;
            }

            if (blob.type === 'application/json' || blob.type === 'text/plain') {
                const text = await blob.text();
                try {
                    let json = JSON.parse(text);
                    const fileArray = Array.isArray(json) ? json : [json];

                    const processedFiles: FileData[] = fileArray.map((item: any): FileData | null => {
                        if (item.base64Data) {
                            const b64 = item.base64Data;
                            const contentType = item.contentType || 'application/pdf';
                            const byteCharacters = atob(b64);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const newBlob = new Blob([byteArray], { type: contentType });
                            return {
                                url: URL.createObjectURL(newBlob),
                                mimeType: contentType,
                                fileName: item.fileName
                            };
                        }
                        return null;
                    }).filter((f): f is FileData => f !== null);

                    if (processedFiles.length > 0) {
                        setFiles(processedFiles);
                        return;
                    }
                } catch (e) {
                    console.error("Error parsing JSON base64", e);
                }
            }

            const url = URL.createObjectURL(blob);
            setFiles([{ url, mimeType: blob.type }]);
        } catch (err) {
            console.error("Error loading file:", err);
            setFiles([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        const currentFile = files[currentIndex];
        if (!currentFile) return;
        const extension = currentFile.mimeType.includes('image') ? 'jpg' : 'pdf';
        const link = document.createElement('a');
        link.href = currentFile.url;
        link.download = currentFile.fileName || `documentacion_${dni}_${currentIndex + 1}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const nextFile = () => {
        resetControls();
        setIsZoomed(false);
        setCurrentIndex((prev) => (prev + 1) % files.length);
    };
    const prevFile = () => {
        resetControls();
        setIsZoomed(false);
        setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
    };

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        e.stopPropagation();
        if (!imgRef.current) return;

        const nextLevel = (zoomLevel + 1) % 4;
        setZoomLevel(nextLevel);

        if (nextLevel === 1) {
            const rect = imgRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomOrigin({ x, y });
        }
    };

    const handleRotate = (e: React.MouseEvent) => {
        e.stopPropagation();
        setRotation((prev) => (prev + 90) % 360);
    };

    const resetControls = () => {
        setZoomLevel(0);
        setRotation(0);
        setZoomOrigin({ x: 50, y: 50 });
    };

    const renderPreview = () => {
        if (files.length === 0) {
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white">
                    <div className="relative mb-4 md:mb-6">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-100">
                            <FileSearch className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                            <AlertCircle size={14} fill="currentColor" className="text-amber-500 fill-white" />
                        </div>
                    </div>
                    <h4 className="text-base md:text-xl font-black text-slate-800 mb-1 uppercase tracking-tighter">
                        Sin Documentación
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 max-w-[200px] leading-relaxed uppercase tracking-widest">
                        No se detectaron archivos para este usuario.
                    </p>
                </div>
            );
        }

        const currentFile = files[currentIndex];
        if (currentFile.mimeType.startsWith('image/')) {
            return (
                <div className="w-full h-full flex items-center justify-center p-2 md:p-6 bg-slate-200/30 relative">
                    <img src={currentFile.url} alt="Doc" className="max-w-full max-h-full object-contain rounded-lg shadow-xl border border-white" />
                    <button
                        onClick={() => {
                            setIsZoomed(true);
                            resetControls();
                        }}
                        className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg text-slate-800 hover:bg-white hover:scale-110 active:scale-95 transition-all z-10 border border-slate-200"
                        title="Ampliar imagen"
                    >
                        <ZoomIn size={20} />
                    </button>
                </div>
            );
        }

        return <iframe src={`${currentFile.url}#toolbar=0&navpanes=0`} className="w-full h-full border-none" title="Preview" />;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Legajo - ${fullName}`} maxWidth="4xl">
            <div className="flex flex-col gap-3 md:gap-5 h-[70vh] md:h-[78vh]">
                <div className="flex-1 bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative border border-slate-200 group shadow-inner">
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md z-30">
                            <Loader2 className="w-10 h-10 text-[#ff8200] animate-spin" />
                        </div>
                    )}

                    {!isLoading && !error && renderPreview()}
                    {files.length > 1 && (
                        <>
                            <button onClick={prevFile} className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-2 md:p-4 bg-white/90 rounded-xl shadow-xl text-slate-800 z-20 active:scale-90 md:opacity-0 md:group-hover:opacity-100 transition-all">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={nextFile} className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-2 md:p-4 bg-white/90 rounded-xl shadow-xl text-slate-800 z-20 active:scale-90 md:opacity-0 md:group-hover:opacity-100 transition-all">
                                <ChevronRight size={20} />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-lg text-white text-[9px] font-black uppercase tracking-widest z-20 border border-white/10">
                                {currentIndex + 1} / {files.length}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 px-1 pb-1">
                    <div className="hidden sm:flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Titular</span>
                        <span className="text-xs font-bold text-slate-700">{dni}</span>
                    </div>

                    <div className="flex w-full sm:w-auto gap-2 md:gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-4 md:px-8 py-3 md:py-4 bg-slate-100 text-slate-500 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={!files.length || isLoading}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 bg-[#ff8200] text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg 
                                ${(!files.length || isLoading) ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:bg-orange-600 active:scale-95'}`}
                        >
                            <Download size={14} />
                            <span className="hidden xs:inline">Descargar</span>
                            <span className="xs:hidden">Bajar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Zoom Overlay con seguimiento de mouse/touch */}
            {isZoomed && files[currentIndex] && (
                <div
                    className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 overflow-hidden touch-none"
                    onClick={() => { setIsZoomed(false); resetControls(); }}
                    onMouseMove={(e) => {
                        if (zoomLevel > 0 && imgRef.current) {
                            const rect = imgRef.current.getBoundingClientRect();
                            const x = ((e.clientX - rect.left) / rect.width) * 100;
                            const y = ((e.clientY - rect.top) / rect.height) * 100;
                            setZoomOrigin({ x, y });
                        }
                    }}
                >
                    {/* Botones de Control Arriba a la Derecha */}
                    <div className="absolute top-6 right-6 flex items-center gap-3 z-[220]" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={handleRotate}
                            className="w-10 h-10 bg-white/10 hover:bg-[#ff8200] text-white rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md transition-all active:scale-90"
                            title="Rotar imagen"
                        >
                            <RotateCw size={18} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsZoomed(false);
                                resetControls();
                            }}
                            className="w-10 h-10 bg-white/10 hover:bg-red-500 text-white rounded-full flex items-center justify-center border border-white/20 transition-all active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                        <div 
                            style={{ 
                                transform: `rotate(${rotation}deg)`, 
                                transition: 'transform 0.3s ease' 
                            }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <img
                                ref={imgRef}
                                src={files[currentIndex].url}
                                alt="Zoom"
                                className={`max-w-full max-h-full object-contain shadow-2xl rounded-sm pointer-events-auto transition-transform duration-200 ease-out
                                    ${zoomLevel === 1 ? 'scale-[2.5]' : zoomLevel === 2 ? 'scale-[4.5]' : zoomLevel === 3 ? 'scale-[7]' : 'scale-100'}`}
                                style={{
                                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                                    cursor: zoomLevel > 0 ? 'crosshair' : 'zoom-in'
                                }}
                                onClick={handleImageClick}
                                onTouchMove={(e) => {
                                    if (zoomLevel > 0 && imgRef.current) {
                                        const touch = e.touches[0];
                                        const rect = imgRef.current.getBoundingClientRect();
                                        const x = ((touch.clientX - rect.left) / rect.width) * 100;
                                        const y = ((touch.clientY - rect.top) / rect.height) * 100;
                                        setZoomOrigin({ x, y });
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};