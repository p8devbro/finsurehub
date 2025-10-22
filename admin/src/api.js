export const fetchDrafts = async () => {
  const res = await fetch('http://localhost:5000/api/posts');
  return await res.json();
};

export const publishDraft = async (slug) => {
  await fetch(`http://localhost:5000/api/publish/${slug}`, { method: 'POST' });
};

export const refreshDrafts = async () => {
  await fetch('http://localhost:5000/update-drafts');
};
