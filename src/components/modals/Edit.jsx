import ReactModal from "react-modal";
import { useState, useEffect } from "react";

function EditModal({ isOpen, onClose, thought, token, onSave }) {
  const [thoughtName, setThoughtName] = useState("");
  const [thoughtDescr, setThoughtDescr] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [addCat, setAddCat] = useState("");
  const [addTag, setAddTag] = useState("");

  useEffect(() => {
    if (!thought) return;

    setThoughtName(thought.ThoughtName || "");
    setThoughtDescr(thought.ThoughtDescr || "");

    // preload categories/tags for this thought
    const fetchData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/categories/${thought.ThoughtID}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/tags/${thought.ThoughtID}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const catData = await catRes.json();
        const tagData = await tagRes.json();

        if (catData.success) setCategories(catData.categories);
        if (tagData.success) setTags(tagData.tags);
      } catch (err) {
        console.error("Error loading categories/tags:", err);
      }
    };

    fetchData();
  }, [thought, token]);

  // add new category to list
  const handleAddCategory = () => {
    if (!addCat.trim()) return;
    setCategories((prev) => [...prev, { CategoryName: addCat.trim() }]);
    setAddCat("");
  };

  // add new tag to list
  const handleAddTag = () => {
    if (!addTag.trim()) return;
    setTags((prev) => [...prev, { TagName: addTag.trim() }]);
    setAddTag("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thought) return;

    try {
      await onSave(thought.ThoughtID, thoughtName, thoughtDescr);

      for (const cat of categories) {
        if (!cat.CategoryID) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              category: cat.CategoryName,
              ThoughtID: thought.ThoughtID,
            }),
          });
        }
      }

      // push new tags
      for (const tag of tags) {
        if (!tag.TagID) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/tags`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              tag: tag.TagName,
              ThoughtID: thought.ThoughtID,
            }),
          });
        }
      }
    } catch (err) {
      console.error("Error updating thought:", err);
    }

    onClose();
  };

  if (!thought) return null;

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose}>
      <div className="modalHead flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold uppercase">
          {thoughtName || "Edit Thought"}
        </h2>
        <i className="fa-solid fa-xmark cursor-pointer" onClick={onClose}></i>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" value={thoughtName} onChange={(e) => setThoughtName(e.target.value)} placeholder="Thought Name" className="bg-white rounded-md p-2 border" />
        <textarea value={thoughtDescr} onChange={(e) => setThoughtDescr(e.target.value)} placeholder="Thought Description" className="bg-white rounded-md p-2 border"/>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Add Categories</h3>
          <ul className="flex flex-wrap gap-2">
            {categories.map((c, i) => (
              <li key={i} className="bg-gray-200 px-2 py-1 rounded">
                {c.CategoryName}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              type="text"
              value={addCat}
              onChange={(e) => setAddCat(e.target.value)}
              placeholder="New category"
              className="bg-white rounded-md p-2 border flex-grow"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Add Tags</h3>
          <ul className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <li key={i} className="bg-gray-200 px-2 py-1 rounded">
                {t.TagName}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input type="text" value={addTag} onChange={(e) => setAddTag(e.target.value)} placeholder="New tag" className="bg-white rounded-md p-2 border flex-grow" />
            <button type="button" onClick={handleAddTag} className="bg-blue-600 text-white px-3 py-2 rounded">
              <i className="fa-solid fa-plus cursor-pointer"/>
            </button>
          </div>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mt-3">
          Save All Changes
        </button>
      </form>
    </ReactModal>
  );
}

export default EditModal;
