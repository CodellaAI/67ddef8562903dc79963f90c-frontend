
export default function Loading({ small = false }) {
  if (small) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-reddit-orange"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-reddit-orange"></div>
    </div>
  );
}
