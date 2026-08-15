export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-40 rounded-lg bg-gray-200" />

          <div className="rounded-2xl bg-white p-6">
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="mt-4 h-20 rounded bg-gray-200" />
          </div>

          <div className="rounded-2xl bg-white p-6">
            <div className="h-5 w-48 rounded bg-gray-200" />
            <div className="mt-4 h-64 rounded bg-gray-200" />
          </div>

          <div className="rounded-2xl bg-white p-6">
            <div className="h-5 w-36 rounded bg-gray-200" />
            <div className="mt-4 h-64 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}