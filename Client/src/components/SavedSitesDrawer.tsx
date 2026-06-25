import { useEffect, useState } from "react";
import { RemoteApi } from "../api";
import { ExternalLink, Plus, Trash2, X } from "lucide-react";

interface Site {
    id: number;
    name: string;
    url: string;
}

interface Props {
    onClose: () => void;
}

export default function SavedSitesDrawer({ onClose }: Props) {
    const [sites, setSites] = useState<Site[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [siteToDelete, setSiteToDelete] = useState<number | null>(null);

    const [newName, setNewName] = useState("");
    const [newUrl, setNewUrl] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchSites = async () => {
            try {
                const data = await RemoteApi.sites.getAll();
                if (isMounted) {
                    setSites(data);
                }
            } catch (err) {
                console.error("Failed to fetch saved sites: ", err);
            }
        };

        fetchSites();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleLaunch = (url: string) => {
        RemoteApi.sites.launch(url);
        onClose();
    };

    const handleConfirmDelete = async () => {
        if (siteToDelete === null) return;

        await RemoteApi.sites.remove(siteToDelete);
        setSites(sites.filter((s) => s.id !== siteToDelete));
        setSiteToDelete(null);
    };

    const handleSaveNew = async () => {
        if (!newName || !newUrl) return;

        let formattedUrl = newUrl;
        if (
            !formattedUrl.startsWith("http://") &&
            !formattedUrl.startsWith("https://")
        ) {
            formattedUrl = "https://" + formattedUrl;
        }

        const addedSite = await RemoteApi.sites.add(newName, formattedUrl);
        setSites([...sites, addedSite]);
        setNewName("");
        setNewUrl("");
        setIsAdding(false);
    };

    const sortedSites = [...sites].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/90 backdrop-blur-md">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800/50 bg-zinc-900/50">
                <h2 className="text-xl font-bold text-zinc-200">Saved Items</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="text-zinc-400 p-2 rounded-full active:bg-zinc-800"
                    >
                        <Plus size={24} />
                    </button>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 p-2 rounded-full active:bg-zinc-800"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {isAdding && (
                <div className="p-6 bg-zinc-900 border-b border-zinc-800 flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Name (e.g. Netflix)"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 outline-none focus:border-emerald-500"
                    />
                    <input
                        type="text"
                        placeholder="URL (e.g. netflix.com)"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 outline-none focus:border-emerald-500"
                    />
                    <button
                        onClick={handleSaveNew}
                        className="bg-emerald-600 text-white font-bold rounded-xl py-3 mt-2 active:bg-emerald-700 transition-colors"
                    >
                        Save
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 relative">
                {sortedSites.length === 0 && !isAdding && (
                    <p className="text-zinc-500 text-center mt-10">
                        No sites saved yet.
                    </p>
                )}

                {sortedSites.map((site) => (
                    <div
                        key={site.id}
                        onClick={() => handleLaunch(site.url)}
                        className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800/50 active:bg-zinc-800 transition-colors"
                    >
                        <div className="flex items-center gap-4 truncate">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                                <ExternalLink
                                    size={18}
                                    className="text-zinc-400"
                                />
                            </div>
                            <div className="flex flex-col truncate">
                                <span className="text-zinc-200 font-medium truncate">
                                    {site.name}
                                </span>
                                <span className="text-zinc-500 text-xs truncate">
                                    {site.url}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSiteToDelete(site.id);
                            }}
                            className="p-3 text-zinc-500 active:text-red-400 active:bg-red-900/30 rounded-full transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {siteToDelete !== null && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-2xl shadow-black">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold text-zinc-200">
                                Delete Item?
                            </h3>
                            <p className="text-zinc-400 text-sm">
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setSiteToDelete(null)}
                                className="flex-1 bg-zinc-800 text-zinc-200 font-bold rounded-xl py-3 active:bg-zinc-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 bg-red-900/50 text-red-400 border border-red-900/50 font-bold rounded-xl py-3 active:bg-red-900"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
