import ReactModal from "react-modal";
import { useState, useEffect } from "react";

function InfoModal({ isOpen, onClose, thought, token }) {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (!thought || !isOpen) return;

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
        console.error("Error fetching categories/tags:", err);
      }
    };

    fetchData();
  }, [thought, isOpen, token]);

  if (!thought) return null;

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose}>
      <div className="modalHead flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold uppercase">
          Extended Info for "{thought.ThoughtName}"
        </h2>
        <i className="fa-solid fa-xmark cursor-pointer" onClick={onClose}></i>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-xl">{thought.ThoughtDescr}</h3>

        <div>
          <h3 className="font-semibold">Categories</h3>
          {categories.length > 0 ? (
            <ul className="list-disc list-inside">
              {categories.map((c) => (
                <li key={c.CategoryID}>{c.CategoryName}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No categories added</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Tags</h3>
          {tags.length > 0 ? (
            <ul className="list-disc list-inside">
              {tags.map((t) => (
                <li key={t.TagID}>{t.TagName}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tags added</p>
          )}
        </div>
      </div>
    </ReactModal>
  );
}

export default InfoModal;
