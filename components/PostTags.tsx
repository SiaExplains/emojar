import { POST_TAGS } from '@/data/post-tags';

export default function PostTags({ slug }: { slug: string }) {
  const tags = POST_TAGS[slug] ?? [];
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-xs bg-gray-100 text-gray-500 rounded-full px-2.5 py-1 font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
