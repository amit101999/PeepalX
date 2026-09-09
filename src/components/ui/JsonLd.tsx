import type { JsonLd as JsonLdDocument } from "@/lib/seo/structured-data";

/**
 * Renders schema.org structured data.
 *
 * The content is built server-side from our own data files, never from user
 * input, so `JSON.stringify` output is safe to inline here. `<` is escaped
 * anyway so a value can never terminate the script tag early.
 */
export function JsonLd({ data }: { data: JsonLdDocument | JsonLdDocument[] }) {
  const documents = Array.isArray(data) ? data : [data];

  return (
    <>
      {documents.map((document, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(document).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
