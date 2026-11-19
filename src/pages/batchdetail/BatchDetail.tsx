import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { useBatchDetail } from "../../features/batchdetail/hooks/useBatchDetail";
import type { BatchStatus } from "../../features/batches/types/batch.types";

import BatchDetailHeader from "../../features/batchdetail/components/BatchDetailHeader";
import CourseImage from "../../features/batchdetail/components/CourseImage";
import CourseDetails from "../../features/batchdetail/components/CourseDetails";
import BatchInformation from "../../features/batchdetail/components/BatchInformation";

export default function BatchDetail() {
  const { batchId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const status: BatchStatus =
    searchParams.get("status") === "ongoing" ? "ongoing" : "upcoming";

  const { data: batch, isLoading, isError, error } = useBatchDetail(batchId);

  const handleBack = () => {
    if (location.state?.backgroundLocation) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-maincolor">Loading batch details...</p>
      </main>
    );
  }

  if (isError || !batch) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-red-500">
          {error instanceof Error
            ? error.message
            : "Unable to load batch details."}
        </p>

        <Link
          to="/"
          className="mt-4 inline-block text-button-color hover:underline"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 font-roboto">
      <BatchDetailHeader
        title={batch.course.title}
        batchCode={batch.batchCode}
        onBack={handleBack}
      />

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Left Column */}
        <div className="space-y-6">
          <CourseImage
            imageURL={batch.course.imageURL}
            title={batch.course.title}
          />

          <CourseDetails course={batch.course} />
        </div>

        {/* Right Column */}
        <BatchInformation batch={batch} status={status} />
      </section>
    </main>
  );
}
