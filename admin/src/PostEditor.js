import React, { useRef, useState } from "react";
import { createReactEditorJS } from "react-editor-js";
import axios from "axios";
import slugify from "slugify";

// ✅ Create the ReactEditorJS factory (important for React 19+)
const ReactEditorJS = createReactEditorJS();

// ✅ Import tools (Editor.js uses CJS — require is fine)
const Header = require("@editorjs/header");
const List = require("@editorjs/list");
const Paragraph = require("@editorjs/paragraph");
const ImageTool = require("@editorjs/image");

export default function PostEditor({ onSave }) {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleInitialize = (instance) => {
    editorRef.current = instance;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSave = async () => {
    if (!editorRef.current) return;

    try {
      const content = await editorRef.current.save();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug || slugify(title, { lower: true }));
      formData.append("content", JSON.stringify(content));
      images.forEach((file) => formData.append("images", file));

      await axios.post("http://localhost:5000/api/posts", formData);
      alert("✅ Post saved successfully!");
      if (onSave) onSave();
    } catch (err) {
      console.error("Error saving post:", err);
      alert("❌ Failed to save post.");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>

      <input
        type="text"
        className="w-full border p-2 mb-3"
        placeholder="Post title..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setSlug(slugify(e.target.value, { lower: true }));
        }}
      />

      <p className="text-sm text-gray-500 mb-3">Slug: {slug}</p>

      <input type="file" multiple onChange={handleImageUpload} className="mb-3" />

      <div className="flex flex-wrap gap-3 mb-4">
        {previewUrls.map((url, i) => (
          <img
            key={i}
            src={url}
            alt="preview"
            className="w-32 h-32 object-cover rounded border"
          />
        ))}
      </div>

      {/* ✅ EditorJS instance */}
      <div className="border rounded p-2 mb-4">
        <ReactEditorJS
          onInitialize={handleInitialize}
          tools={{
            header: Header,
            list: List,
            paragraph: Paragraph,
            image: ImageTool,
          }}
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Publish Post
      </button>
    </div>
  );
}
