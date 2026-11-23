export function formatContent(content: string) {
  return content.split("\n\n").map((block, i) => {
    if (block.startsWith("**") && block.endsWith("**")) {
      return (
        <h3 key={i} className="text-2xl font-semibold tracking-tight mt-12 mb-4">
          {block.replace(/\*\*/g, "")}
        </h3>
      );
    }
    if (block.startsWith("*") && block.endsWith("*") && !block.startsWith("**")) {
      const text = block.replace(/^\*/, "").replace(/\*$/, "");
      if (text.startsWith("*")) {
        return (
          <h4 key={i} className="text-lg font-semibold text-primary mt-8 mb-3">
            {text.replace(/^\*/, "").replace(/\*$/, "")}
          </h4>
        );
      }
    }
    if (block.includes("*") && !block.startsWith("**")) {
      const processed = block.replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
      return (
        <p
          key={i}
          className="text-corporate-gray leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      );
    }
    if (block.trim().startsWith("-")) {
      const items = block.split("\n").filter((l) => l.trim().startsWith("-"));
      return (
        <ul key={i} className="list-none space-y-2 my-4">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-corporate-gray leading-relaxed">
              <span className="mt-2 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
              {item.replace(/^-\s*/, "")}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="text-corporate-gray leading-relaxed text-lg">
        {block}
      </p>
    );
  });
}
