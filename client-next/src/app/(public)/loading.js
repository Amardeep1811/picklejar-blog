import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <LoadingSpinner />
    </div>
  );
}
