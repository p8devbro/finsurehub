import React, { useEffect, useState } from 'react';
import { fetchDrafts, publishDraft, refreshDrafts } from './api';

export default function DraftList() {
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    const data = await fetchDrafts();
    setDrafts(data.filter(d => d.status === 'draft'));
  };

  const handlePublish = async (slug) => {
    await publishDraft(slug);
    loadDrafts();
  };

  const handleRefresh = async () => {
    await refreshDrafts();
    loadDrafts();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Drafts</h1>
      <button onClick={handleRefresh} style={{ marginBottom: '20px' }}>Refresh Drafts</button>
      {drafts.map(d => (
        <div key={d.slug} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{d.title} ({d.category})</h3>
          <p>{d.date}</p>
          <div dangerouslySetInnerHTML={{ __html: d.content }} />
          <button onClick={() => handlePublish(d.slug)}>Publish</button>
        </div>
      ))}
    </div>
  );
}
