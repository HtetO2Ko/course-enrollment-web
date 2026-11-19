interface CourseImageProps {
  imageURL: string;
  title: string;
}

export default function CourseImage({ imageURL, title }: CourseImageProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm">
      <img
        src={imageURL}
        alt={title}
        className="max-h-105 w-full object-cover"
      />
    </article>
  );
}
