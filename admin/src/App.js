import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostEditor from './PostEditor';

function App() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    category: '',
    author: 'Admin',
    content: '',
    images: [],
  });

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      let data = res.data;
      if (filter !== 'all') data = data.filter(p => p.status === filter);
      setPosts(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNewDrafts = async () => {
    try {
      await axios.get('http://localhost:5000/api/fetch-new');
      fetchPosts();
    } catch (err) {
      console.error('Error fetching new drafts:', err);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setNewPost(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...newPost,
        slug: newPost.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      };

      if (editing) {
        await axios.put(`http://localhost:5000/api/posts/${editing}`, payload);
      } else {
        await axios.post('http://localhost:5000/api/posts', payload);
      }

      resetForm();
      fetchPosts();
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleEdit = (post) => {
    setEditing(post.id);
    setNewPost({
      title: post.title,
      category: post.category,
      author: post.author,
      content: post.content,
      images: post.images || [],
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/publish/${id}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setNewPost({
      title: '',
      category: '',
      author: 'Admin',
      content: '',
      images: [],
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: 1200, margin: 'auto' }}>
      <h1>📰 Admin Panel - Finsure Hub</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('draft')} style={{ marginLeft: 10 }}>
          Drafts
        </button>
        <button onClick={() => setFilter('published')} style={{ marginLeft: 10 }}>
          Published
        </button>
        <button onClick={fetchNewDrafts} style={{ marginLeft: 10 }}>
          Fetch New Drafts
        </button>
      </div>

      {/* Create/Edit Post Form */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <h2>{editing ? '✏️ Edit Post' : '🆕 New Post'}</h2>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={e => setNewPost({ ...newPost, title: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Category"
          value={newPost.category}
          onChange={e => setNewPost({ ...newPost, category: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        {/* ✅ Editor.js Component */}
        <PostEditor
          initialContent={newPost.content}
          onChange={(html) => setNewPost({ ...newPost, content: html })}
        />

        {/* ✅ Image Upload */}
        <div style={{ marginTop: '15px' }}>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
        </div>

        {newPost.images.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap' }}>
            {newPost.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                style={{ width: 100, height: 100, objectFit: 'cover', margin: 5 }}
              />
            ))}
          </div>
        )}

        <button onClick={handleSave} style={{ marginTop: 10 }}>
          {editing ? 'Update Post' : 'Save Draft'}
        </button>
        {editing && (
          <button onClick={resetForm} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        )}
      </div>

      {/* ✅ Posts List */}
      <h2>
        🗂️ {filter === 'all' ? 'All Posts' : filter === 'draft' ? 'Drafts' : 'Published'} ({posts.length})
      </h2>
      {posts.map(post => (
        <div
          key={post.id}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '5px',
          }}
        >
          <h3>{post.title}</h3>
          <p>
            <strong>{post.category}</strong> | {post.status} |{' '}
            {new Date(post.date).toLocaleDateString()}
          </p>

          {post.images?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
              {post.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 5 }}
                />
              ))}
            </div>
          )}

          <div
            dangerouslySetInnerHTML={{
              __html: post.content?.slice(0, 300) + '...',
            }}
          ></div>

          <div style={{ marginTop: '10px' }}>
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button
              onClick={() => handleDelete(post.id)}
              style={{ marginLeft: 10, color: 'red' }}
            >
              Delete
            </button>
            {post.status === 'draft' && (
              <button
                onClick={() => handlePublish(post.id)}
                style={{ marginLeft: 10, color: 'green' }}
              >
                Publish
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
