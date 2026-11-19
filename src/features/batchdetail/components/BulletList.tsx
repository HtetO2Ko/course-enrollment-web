interface BulletListProps {
  content: string;
}

export default function BulletList({ content }: BulletListProps) {
  const items = content
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-maincolor">
      {items.map((item, index) => (
        <li key={`${index}-${item}`}>{item}</li>
      ))}
    </ul>
  );
}
