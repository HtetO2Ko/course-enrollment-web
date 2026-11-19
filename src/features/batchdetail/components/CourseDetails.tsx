import type { Batch } from "../../batches/types/batch.types";
import BulletList from "./BulletList";

interface CourseDetailsProps {
  course: Batch["course"];
}

export default function CourseDetails({ course }: CourseDetailsProps) {
  return (
    <article className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-maincolor">
        Course Details
      </h2>

      <p className="text-sm leading-7 text-maincolor">{course.description}</p>

      <div className="mt-7">
        <h3 className="mb-4 font-semibold text-maincolor">Course Outlines</h3>

        <BulletList content={course.outlines} />
      </div>

      <div className="mt-7">
        <h3 className="mb-4 font-semibold text-maincolor">Prerequisites</h3>

        <BulletList content={course.prerequisite} />
      </div>
    </article>
  );
}
