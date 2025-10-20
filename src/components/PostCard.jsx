import React from "react";

export default function PostCard({ post, onOpen }) {
  return (
    <article className="card" onClick={onOpen} role="button" tabIndex={0}>
      <img src={post.image} alt={post.title} className="card-image" />
      <div className="card-body">
        <h3>{post.title}</h3>
        <p className="excerpt">{post.excerpt}</p>
        <div className="meta">
          <span>{post.category}</span>
          <span>{post.date}</span>
        </div>
      </div>
    </article>
  );
}
