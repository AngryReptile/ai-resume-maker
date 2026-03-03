import Link from 'next/link';
import { Plus, FileText, MoreVertical, Edit2, Trash2, Download } from 'lucide-react';

export default function Dashboard() {
    const mockResumes = [
        { id: 1, title: 'Software Engineer Resume', lastModified: '2 days ago' },
        { id: 2, title: 'Product Manager Resume', lastModified: '1 week ago' },
    ];

    return (
        <div className="container mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Your Resumes</h1>
                    <p className="text-zinc-400">Manage and create tailored resumes for your job applications.</p>
                </div>
                <Link
                    href="/builder"
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-indigo-600 hover:scale-105 active:scale-95"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Resume
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockResumes.map((resume) => (
                    <div key={resume.id} className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:border-indigo-500/50">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-zinc-400 hover:text-white rounded-md hover:bg-white/10 transition-colors">
                                <MoreVertical className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                            <FileText className="h-6 w-6" />
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-1">{resume.title}</h3>
                        <p className="text-sm text-zinc-500 mb-6">Last edited {resume.lastModified}</p>

                        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                            <div className="flex gap-2">
                                <button className="p-2 text-zinc-400 hover:text-indigo-400 rounded-md hover:bg-indigo-500/10 transition-colors" title="Edit">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-zinc-400 hover:text-pink-400 rounded-md hover:bg-pink-500/10 transition-colors" title="Download PDF">
                                    <Download className="h-4 w-4" />
                                </button>
                            </div>
                            <button className="p-2 text-zinc-500 hover:text-red-400 rounded-md hover:bg-red-500/10 transition-colors" title="Delete">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Create New Card */}
                <Link href="/builder" className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:border-indigo-500/50 min-h-[250px] cursor-pointer">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 mb-4 group-hover:scale-110 transition-transform group-hover:bg-indigo-500 group-hover:text-white">
                        <Plus className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Blank Resume</h3>
                    <p className="text-sm text-zinc-500">Start from scratch</p>
                </Link>
            </div>
        </div>
    );
}
