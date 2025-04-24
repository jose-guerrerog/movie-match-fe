export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <p className="mb-4">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-blue-600 hover:underline">Go back home</a>
    </div>
  );
}