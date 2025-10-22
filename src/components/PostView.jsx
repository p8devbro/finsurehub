// src/components/PostView.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import Seo from "./Seo";

export default function PostView({ post, onBack }) {
  return (
    <article className="post-view">
      <Seo
        title={post.title}
        description={post.excerpt}
        url={`https://finsurehub.info/posts/${post.slug}`}
        image={post.image}
        publishedTime={post.date}
      />

      <h1>{post.title}</h1>
      <div className="post-meta">
        {post.date} • {post.category}
      </div>
      {post.image && <img src={post.image} alt={post.title} className="post-image" />}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Back button only */}
      <div className="post-footer">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
      </div>
    </article>
  );
}
