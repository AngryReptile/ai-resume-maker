
'use client';

import { useState, useEffect, useRef } from 'react';
import { Edit2, Check, X, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/useResumeStore';

interface EditableTextProps {
    value: string;
    onSave: (newValue: string) => void;
    placeholder?: string;
    className?: string;
    multiline?: boolean;
    label?: string;
}

export default function EditableText({
    value,
    onSave,
    placeholder = 'Click to edit...',
    className = '',
    multiline = false,
    label
}: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const setActiveField = useResumeStore((state) => state.setActiveField);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            if (label) {
                setActiveField({ section: label, field: 'content' });
            }
        }
    }, [isEditing, label, setActiveField]);

    const handleAI = async () => {
        if (!tempValue.trim() || isEnhancing) return;
        setIsEnhancing(true);
        try {
            const typeMap: Record<string, string> = {
                personalInfo: 'summary',
                skills: 'skills',
            };
            const aiType = label ? (typeMap[label] || 'experience') : 'experience';
            
            const response = await fetch('/api/ai/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    type: aiType, 
                    text: tempValue, 
                    action: 'enhance',
                    context: { position: useResumeStore.getState().data.personalInfo.jobTitle }
                })
            });
            const resData = await response.json();
            if (response.ok && resData.result) {
                setTempValue(resData.result);
            } else {
                alert('Failed to enhance text: ' + (resData.error || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            handleSave();
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const adjustTextareaHeight = () => {
        if (multiline && inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        if (isEditing) {
            adjustTextareaHeight();
        }
    }, [tempValue, isEditing]);

    const handleSave = () => {
        if (!isEditing) return; // Prevent double-save
        onSave(tempValue);
        setIsEditing(false);
    };

    // ... (rest of the logic)

    if (isEditing) {
        return (
            <div className={`relative group/edit w-full min-w-[20px] z-[60]`}>
                {multiline ? (
                    <textarea
                        ref={inputRef as any}
                        value={tempValue}
                        onChange={(e) => {
                            setTempValue(e.target.value);
                            adjustTextareaHeight();
                        }}
                        onBlur={(e) => {
                            // Only save if we didn't click one of our toolbar buttons
                            if (!e.relatedTarget || !(e.relatedTarget as HTMLElement).closest('.edit-toolbar')) {
                                handleSave();
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        className={`w-full bg-indigo-50/10 border-indigo-500/30 border-2 rounded-lg p-3 outline-none text-inherit font-inherit resize-none transition-all focus:bg-white focus:border-indigo-500 overflow-hidden ${className}`}
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        ref={inputRef as any}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={(e) => {
                            if (!e.relatedTarget || !(e.relatedTarget as HTMLElement).closest('.edit-toolbar')) {
                                handleSave();
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        className={`w-full bg-indigo-50/10 border-b-2 border-indigo-500/30 outline-none text-inherit font-inherit transition-all focus:bg-white focus:border-indigo-500 py-1 ${className}`}
                        placeholder={placeholder}
                    />
                )}

                <div className="edit-toolbar absolute -top-12 right-0 flex gap-1 bg-white shadow-2xl rounded-xl p-1.5 border border-indigo-100 z-[100]">
                    <button 
                        onMouseDown={(e) => { e.preventDefault(); handleAI(); }}
                        disabled={isEnhancing}
                        className="relative group/ai p-2 hover:bg-indigo-50 text-indigo-500 rounded-lg transition-colors disabled:opacity-50"
                        title="Enhance with AI"
                    >
                        {isEnhancing ? <Loader2 size={16} strokeWidth={2} className="animate-spin" /> : <Sparkles size={16} strokeWidth={2} />}
                    </button>
                    <div className="w-px h-5 bg-zinc-200 my-auto mx-1" />
                    <button 
                        onMouseDown={(e) => { e.preventDefault(); handleSave(); }}
                        className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                    >
                        <Check size={16} strokeWidth={3} />
                    </button>
                    <button 
                        onMouseDown={(e) => { e.preventDefault(); handleCancel(); }}
                        className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                    >
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div 
            onClick={() => setIsEditing(true)}
            className={`group/text relative cursor-text transition-all rounded px-1 -mx-1 hover:bg-indigo-50/30 ${!value && !isEditing ? 'text-zinc-300 italic print:hidden' : ''} ${className}`}
        >
            <span className="whitespace-pre-wrap">{value || placeholder}</span>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/text:opacity-100 transition-all pointer-events-none">
                <Edit2 size={12} className="text-indigo-400" />
            </div>
            
            {/* Contextual Glow on Hover */}
            <div className="absolute inset-0 border border-indigo-500/0 group-hover/text:border-indigo-500/20 rounded pointer-events-none transition-colors" />
        </div>
    );
}
