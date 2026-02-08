import ClientDetectionLoader from "@/components/detection/ClientDetectionLoader";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <ClientDetectionLoader />
    </main>
  );
}
