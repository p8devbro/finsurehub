import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import posts from "./data/posts.json";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PostCard from "./components/PostCard";
import PostView from "./components/PostView";
import Seo from "./components/Seo";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const categories = ["All", "Finance", "Insurance"];
  const [category, setCategory] = useState("All");

  const filtered = posts.filter(
    (p) => category === "All" || p.category === category
  );

  const selectedPost = posts.find((p) => p.id === selectedId);

  const handleNext = () => {
    if (!selectedPost) return;
    const currentIndex = filtered.findIndex((p) => p.id === selectedId);
    const nextPost = filtered[currentIndex + 1] || filtered[0];
    setSelectedId(nextPost.id);
  };

  const handlePrev = () => {
    if (!selectedPost) return;
    const currentIndex = filtered.findIndex((p) => p.id === selectedId);
    const prevPost =
      filtered[currentIndex - 1] || filtered[filtered.length - 1];
    setSelectedId(prevPost.id);
  };

  return (
    <div className="app">
      <Helmet>
        <title>FinSure Hub — Finance & Insurance Insights</title>
        <meta
          name="description"
          content="FinSure Hub: expert articles and guides on finance and insurance to protect and grow your money."
        />
        <link rel="canonical" href="https://finsurehub.info/" />
      </Helmet>

      <Header onSearch={() => {}} />

      <main className="container">
        {!selectedPost ? (
          <>
            {/* HERO SECTION */}
            <section className="hero">
              <h1>FinSure Hub</h1>
              <p className="tagline">
                Finance, Insurance & Fintech — insights that pay.
              </p>

              {/* CATEGORY FILTER */}
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

              {/* PLACEHOLDER: STOCK SLIDER */}
              <div className="stock-slider">
                {/* TODO: Connect free stock API here */}
                <p>Trending Stocks & New Stocks slider will go here</p>
              </div>
            </section>

            {/* POSTS GRID */}
            <section className="posts-grid" aria-label="Latest posts">
              {filtered.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  onOpen={() => setSelectedId(p.id)}
                />
              ))}
            </section>
          </>
        ) : (
          <>
            {/* SEO for selected post */}
            <Seo
              title={selectedPost.title}
              description={selectedPost.excerpt}
              url={`https://finsurehub.info/posts/${selectedPost.slug}`}
              image={selectedPost.image}
              publishedTime={selectedPost.date}
            />

            {/* POST VIEW */}
            <PostView post={selectedPost} onBack={() => setSelectedId(null)} />

            {/* NEXT / PREVIOUS BUTTONS */}
            <div className="post-navigation">
              <button onClick={handlePrev} className="nav-btn">
                ← Previous
              </button>
              <button onClick={handleNext} className="nav-btn">
                Next →
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
