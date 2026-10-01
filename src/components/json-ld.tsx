/**
 * One <script type="application/ld+json"> per page, holding a @graph.
 * `<` is escaped: the only sequence that can break out of a script element
 * is `</script`, and JSON.stringify leaves it intact.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
