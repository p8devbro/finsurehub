import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import posts from "./data/posts.json";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PostCard from "./components/PostCard";
import PostView from "./components/PostView";
import Seo from '../components/Seo';
// ...
<Seo
  title={post.title}
  description={post.excerpt}
  url={`https://finsurehub.info/posts/${post.slug}`}
  image={post.image}
  publishedTime={post.date}
/>


export default function App() {
  const [selectedId, setSelectedId] = useState(null);

  const categories = ["All", "Finance", "Insurance"];
  const [category, setCategory] = useState("All");

  const filtered = posts.filter(
    (p) => category === "All" || p.category === category
  );

  const selectedPost = posts.find((p) => p.id === selectedId);

  return (
    <div className="app">
      <Helmet>
        <title>FinSure Hub — Finance & Insurance Insights</title>
        <meta name="description" content="FinSure Hub: expert articles and guides on finance and insurance to protect and grow your money." />
        <link rel="canonical" href="https://finsurehub.info/" />
      </Helmet>

      <Header onSearch={() => {}} />

      <main className="container">
        {!selectedPost ? (
          <>
            <section className="hero">
              <h1>FinSure Hub</h1>
              <p className="tagline">Finance, Insurance & Fintech — insights that pay.</p>
              <div className="category-row">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`cat-btn ${category === c ? "active" : ""}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </section>

            <section className="posts-grid" aria-label="Latest posts">
              {filtered.map((p) => (
                <PostCard key={p.id} post={p} onOpen={() => setSelectedId(p.id)} />
              ))}
            </section>
          </>
        ) : (
          <PostView post={selectedPost} onBack={() => setSelectedId(null)} />
        )}
      </main>

      <Footer />
    </div>
  );
}
