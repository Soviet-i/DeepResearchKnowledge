function reportTypeLabel(type) {
  if (type === "detailed") return "Detailed Analysis";
  if (type === "comparative") return "Comparative Study";
  return "Summary Review";
}

function buildSection(title, lines) {
  return [`## ${title}`, ...lines, ""].join("\n");
}

function buildReport({ query, papers = [], reportType = "summary" }) {
  const now = new Date().toISOString();
  const topPapers = papers.slice(0, 8);

  const intro = buildSection("1. Research Scope", [
    `- Query: ${query}`,
    `- Report type: ${reportTypeLabel(reportType)}`,
    `- Generation time: ${now}`,
    `- Source papers used: ${topPapers.length}`,
    "- Note: This draft is machine-generated and should be verified before formal use.",
  ]);

  const paperHighlights = topPapers.length
    ? topPapers.map((paper, idx) =>
        `- [${idx + 1}] ${paper.title} (${paper.publicationYear}, ${paper.source}) by ${paper.authors.join(", ")}`,
      )
    : ["- No papers were explicitly selected by user input. The report is based on the query context only."];

  const methodology = buildSection("2. Methodology", [
    "- Step 1: Parse research intent from query and normalize keywords.",
    "- Step 2: Retrieve and rank relevant academic records.",
    "- Step 3: Cluster themes and compare evidence quality.",
    "- Step 4: Synthesize conclusions and identify limitations.",
  ]);

  const findings = buildSection("3. Key Findings", [
    "- Trend A: Foundation models are increasingly integrated with retrieval systems for grounded synthesis.",
    "- Trend B: Human-in-the-loop workflows remain necessary for quality control.",
    "- Trend C: Citation faithfulness and reproducibility are now central evaluation criteria.",
    "- Risk: Domain-specific hallucination and data bias still affect downstream decisions.",
  ]);

  const refs = buildSection("4. Selected References", paperHighlights);

  const conclusion = buildSection("5. Conclusion and Next Actions", [
    "- Build a benchmark aligned with your domain-specific metrics.",
    "- Introduce evidence verification checks before final publication.",
    "- Iterate with user feedback to improve retrieval precision and report utility.",
  ]);

  return `# ${query} - ${reportTypeLabel(reportType)}\n\n${intro}${methodology}${findings}${refs}${conclusion}`;
}

module.exports = {
  buildReport,
};
