import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getArticleById, updateArticle } from '../../utils/database';
import AdminSidebar from '../../components/AdminSidebar';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'finance',
    published: false,
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      const article = await getArticleById(id);
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        published: article.published,
        image: article.image || ''
      });
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImageFile(file);
        setFormData(prev => ({
          ...prev,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImage = formData.image;
      
      if (imageFile) {
        const compressedBlob = await compressImage(imageFile);
        const reader = new FileReader();
        reader.onload = () => {
          finalImage = reader.result;
        };
        reader.readAsDataURL(compressedBlob);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await updateArticle(id, {
        ...formData,
        image: finalImage
      });
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Error updating article');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image',
    'align'
  ];

  if (initialLoading) {
    return (
      <div className="main-content">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <h2>Edit Article</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title:</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Featured Image:</label>
            <div className="image-upload" onClick={() => document.getElementById('image-upload').click()}>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <p>Click to upload new image or keep current (Max 5MB)</p>
              {formData.image && (
                <img src={formData.image} alt="Preview" className="image-preview" />
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Excerpt:</label>
            <textarea
              name="excerpt"
              className="form-textarea"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content:</label>
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              className="quill-editor"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category:</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="finance">Finance</option>
              <option value="insurance">Insurance</option>
              <option value="investing">Investing</option>
              <option value="banking">Banking</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
              />
              <span style={{ fontWeight: '600' }}>Published</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Updating...' : 'Update Article'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticle;