import React from "react";
import { Helmet } from "react-helmet-async";

export default function PostView({ post, onBack }) {
  return (
    <article className="post-view">
      <Helmet>
        <title>{post.title} — FinSure Hub</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <link rel="canonical" href={`https://finsurehub.info/posts/${post.slug}`} />
      </Helmet>

      <button className="back" onClick={onBack}>← Back</button>
      <h1>{post.title}</h1>
      <div className="post-meta">{post.date} • {post.category}</div>
      <img src={post.image} alt={post.title} className="post-image" />
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="share-line">
        <small>Share:</small>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent('https://finsurehub.info')}`} target="_blank" rel="noreferrer">Twitter</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://finsurehub.info')}`} target="_blank" rel="noreferrer">Facebook</a>
      </div>
    </article>
  );
}
