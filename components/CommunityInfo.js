
export default function CommunityInfo({ community }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-4">About Community</h2>
      
      {community.description && (
        <p className="mb-4">{community.description}</p>
      )}
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-reddit-muted">Members</span>
          <span className="font-medium">{community.memberCount || 0}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-reddit-muted">Created</span>
          <span className="font-medium">{formatDate(community.createdAt)}</span>
        </div>
      </div>
      
      <div className="border-t border-reddit-border mt-4 pt-4">
        <button className="btn-primary w-full">Create Post</button>
      </div>
    </div>
  );
}
