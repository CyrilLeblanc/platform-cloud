import { useEffect, useState } from "react";
import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

type Collection = {
  id: string;
  name: string;
  color: string;
};

type ImageItem = {
  id: string;
  src: string;
  title: string;
  description: string;
  collectionId: string | null;
};

export function meta() {
  return [
    { title: "Galerie" },
    {
      name: "description",
      content: "Galerie d'images - ajouter et visualiser des images",
    },
  ];
}

function Gallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollName, setNewCollName] = useState("");
  const [newCollColor, setNewCollColor] = useState("#1e293b");

  // ===== CONSTANTES DE SÉCURITÉ =====
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gallery:images");
      const rawColls = localStorage.getItem("gallery:collections");
      if (raw) setImages(JSON.parse(raw));
      if (rawColls) setCollections(JSON.parse(rawColls));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("gallery:images", JSON.stringify(images));
      localStorage.setItem("gallery:collections", JSON.stringify(collections));
    } catch (err) {
      console.error(err);
    }
  }, [images, collections]);

  function makeId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function validateFile(file: File): { valid: boolean; error?: string } {
    const extension = file.name.toLowerCase().match(/\.[^.]*$/)?.[0];
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        error: `Extension non autorisée: ${extension || "aucune"}`,
      };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non autorisé: ${file.type}`,
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Fichier trop volumineux: ${(file.size / 1024 / 1024).toFixed(2)}MB (max: 5MB)`,
      };
    }

    if (file.size === 0) {
      return { valid: false, error: "Fichier vide" };
    }

    return { valid: true };
  }

  async function validateImageContent(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        if (
          img.width > 0 &&
          img.height > 0 &&
          img.width <= 10000 &&
          img.height <= 10000
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.src = url;
    });
  }

  function sanitizeFilename(filename: string): string {
    const nameWithoutExt = filename.replace(/\.[^.]+$/, "");

    return nameWithoutExt.replace(/[^a-zA-Z0-9\s._-]/g, "_").slice(0, 100); 
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validation de base (extension, type MIME, taille)
    for (const file of Array.from(files)) {
      const validation = validateFile(file);
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      alert(`⚠️ Fichiers rejetés:\n\n${errors.join("\n")}`);
    }

    if (validFiles.length === 0) return;

    // Validation du contenu image
    const contentValidation = await Promise.all(
      validFiles.map(async (file) => ({
        file,
        valid: await validateImageContent(file),
      }))
    );

    const validImageFiles = contentValidation
      .filter((v) => v.valid)
      .map((v) => v.file);

    const invalidImages = contentValidation
      .filter((v) => !v.valid)
      .map((v) => v.file.name);

    if (invalidImages.length > 0) {
      alert(
        `⚠️ Images invalides ou corrompues:\n\n${invalidImages.join("\n")}`
      );
    }

    if (validImageFiles.length === 0) return;

    // Lecture des fichiers valides
    const readers: Promise<ImageItem>[] = validImageFiles.map(
      (file) =>
        new Promise((res, rej) => {
          const fr = new FileReader();
          fr.onload = () => {
            res({
              id: makeId(),
              src: String(fr.result),
              title: sanitizeFilename(file.name),
              description: "",
              collectionId: selectedCollectionId,
            });
          };
          fr.onerror = () => rej(new Error("Erreur de lecture"));
          fr.readAsDataURL(file);
        })
    );

    try {
      const items = await Promise.all(readers);
      setImages((prev) => [...items, ...prev]);

      // Message de succès
      if (validImageFiles.length > 0) {
        console.log(
          `✅ ${validImageFiles.length} image(s) ajoutée(s) avec succès`
        );
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors du chargement des images");
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    e.currentTarget.value = "";
  }

  function removeAt(i: number) {
    setImages((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      if (selectedIndex !== null) {
        if (i === selectedIndex) {
          setSelectedIndex(null);
        } else if (i < selectedIndex) {
          setSelectedIndex((s) => (s ? s - 1 : null));
        }
      }
      return next;
    });
  }

  function clearAll() {
    setImages([]);
    setSelectedIndex(null);
  }

  function openViewer(i: number) {
    setSelectedIndex(i);
  }

  function closeViewer() {
    setSelectedIndex(null);
  }

  function updateSelected(updater: (img: ImageItem) => ImageItem) {
    if (selectedIndex === null) return;
    setImages((prev) =>
      prev.map((it, idx) => (idx === selectedIndex ? updater(it) : it))
    );
  }

  function truncate(s: string, n = 60) {
    if (!s) return "";
    return s.length > n ? s.slice(0, n) + "…" : s;
  }

  function createCollection() {
    if (!newCollName.trim()) return;
    const coll: Collection = {
      id: makeId(),
      name: newCollName,
      color: newCollColor,
    };
    setCollections((prev) => [...prev, coll]);
    setNewCollName("");
    setNewCollColor("#3B82F6");
    setShowNewCollection(false);
  }

  function deleteCollection(collId: string) {
    setCollections((prev) => prev.filter((c) => c.id !== collId));
    setImages((prev) =>
      prev.map((img) =>
        img.collectionId === collId ? { ...img, collectionId: null } : img
      )
    );
    if (selectedCollectionId === collId) setSelectedCollectionId(null);
  }

  function renameCollection(collId: string, newName: string) {
    if (!newName.trim()) return;
    setCollections((prev) =>
      prev.map((c) => (c.id === collId ? { ...c, name: newName } : c))
    );
  }

  function getFilteredImages() {
    if (selectedCollectionId === null) return images;
    return images.filter((img) => img.collectionId === selectedCollectionId);
  }

  function moveImageToCollection(imgIdx: number, collId: string | null) {
    setImages((prev) =>
      prev.map((img, idx) =>
        idx === imgIdx ? { ...img, collectionId: collId } : img
      )
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar Collections */}
      <aside className="w-64 bg-slate-800 text-white p-4 overflow-y-auto max-h-screen">
        <h2 className="text-lg font-semibold mb-4">Collections</h2>

        {/* All images */}
        <button
          onClick={() => setSelectedCollectionId(null)}
          className={`w-full text-left px-3 py-2 rounded-md mb-2 transition ${
            selectedCollectionId === null
              ? "bg-black text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Toutes les images ({images.length})
        </button>

        {/* Collections list */}
        <div className="mb-4 space-y-1">
          {collections.map((coll) => {
            const count = images.filter(
              (img) => img.collectionId === coll.id
            ).length;
            return (
              <div
                key={coll.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition ${
                  selectedCollectionId === coll.id
                    ? "bg-black text-white"
                    : "hover:bg-slate-700"
                }`}
                onClick={() => setSelectedCollectionId(coll.id)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: coll.color }}
                />
                <span className="flex-1 text-sm truncate">{coll.name}</span>
                <span className="text-xs text-slate-300">({count})</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCollection(coll.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 text-xs"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* New collection button */}
        <button
          onClick={() => setShowNewCollection(true)}
          className="w-full px-3 py-2 text-sm bg-slate-700 rounded-md hover:bg-slate-600 transition"
        >
          + Nouvelle collection
        </button>

        {/* New collection form */}
        {showNewCollection && (
          <div className="mt-3 p-3 border border-slate-600 rounded-md bg-slate-700">
            <input
              type="text"
              placeholder="Nom..."
              value={newCollName}
              onChange={(e) => setNewCollName(e.target.value)}
              className="w-full px-2 py-1 border rounded bg-slate-800 text-white text-sm mb-2"
              autoFocus
            />
            <div className="flex gap-1 flex-wrap mb-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewCollColor(c)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    newCollColor === c ? "border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={createCollection}
                className="flex-1 text-sm px-2 py-1 bg-black text-white rounded hover:bg-gray-900"
              >
                Créer
              </button>
              <button
                onClick={() => setShowNewCollection(false)}
                className="flex-1 text-sm px-2 py-1 bg-slate-600 rounded hover:bg-slate-500"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main gallery */}
      <main className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">
            {selectedCollectionId
              ? collections.find((c) => c.id === selectedCollectionId)?.name ||
                "Collection"
              : "Galerie"}
          </h1>
          <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-800 text-white px-3 py-1 rounded-md hover:bg-black transition">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              multiple
              onChange={onInputChange}
              className="hidden"
            />
            Ajouter des images
          </label>
        </div>

        {getFilteredImages().length === 0 ? (
          <p className="text-sm text-slate-600">Aucune image.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {getFilteredImages().map((item, idx) => {
              const absoluteIdx = images.indexOf(item);
              return (
                <div
                  key={item.id}
                  className="group relative rounded overflow-hidden bg-slate-100 cursor-pointer border border-slate-200"
                  onClick={() => {
                    setSelectedIndex(absoluteIdx);
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.title || `img-${idx}`}
                    className="w-full h-40 object-cover"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-opacity" />

                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition">
                    <div className="font-medium text-sm">
                      {item.title || "(sans titre)"}
                    </div>
                    {item.description ? (
                      <div className="text-xs text-slate-200">
                        {truncate(item.description, 80)}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-300">
                        Cliquez pour éditer
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAt(absoluteIdx);
                    }}
                    title="Supprimer"
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-black/80"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Viewer Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={closeViewer} />

          <div className="relative z-10 max-w-[95%] max-h-[90%] w-full flex bg-white rounded shadow-lg overflow-hidden">
            <div className="flex-1 flex items-center justify-center bg-black">
              <img
                src={images[selectedIndex].src}
                alt={images[selectedIndex].title || "selected"}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>

            <aside className="w-80 p-4 bg-white border-l border-slate-200 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <strong className="text-lg text-slate-900">Informations</strong>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      removeAt(selectedIndex);
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={closeViewer}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    Fermer
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs text-slate-600 mb-1">
                  Titre
                </label>
                <input
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-900"
                  value={images[selectedIndex].title}
                  onChange={(e) =>
                    updateSelected((it) => ({ ...it, title: e.target.value }))
                  }
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-900 h-32"
                  value={images[selectedIndex].description}
                  onChange={(e) =>
                    updateSelected((it) => ({
                      ...it,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs text-slate-600 mb-1">
                  Collection
                </label>
                <select
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-900 text-sm"
                  value={images[selectedIndex].collectionId || ""}
                  onChange={(e) =>
                    moveImageToCollection(
                      selectedIndex,
                      e.target.value === "" ? null : e.target.value
                    )
                  }
                >
                  <option value="">Aucune collection</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-slate-500">
                Appuyez sur "Fermer" pour enregistrer.
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GalleryRoute() {
  const auth = useAuth()
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />
  return <Gallery />
}
