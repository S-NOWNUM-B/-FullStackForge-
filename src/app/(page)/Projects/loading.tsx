import { Loader2 } from 'lucide-react';

export default function ProjectsLoading() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Загрузка проектов...</p>
      </div>
    </div>
  );
}
