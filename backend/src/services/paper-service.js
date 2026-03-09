const papers = require("../data/papers.json");
const config = require("../config");
const https = require("https");

function normalize(str) {
  return String(str || "").toLowerCase();
}

function buildScholarSearchUrl(title = "") {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(String(title || "").trim())}`;
}

function sanitizeQuery(query) {
  return normalize(query).replace(/[“”"'`]/g, " ").replace(/\s+/g, " ").trim();
}

function mapPaperType(rawType = "") {
  const t = normalize(rawType);
  if (t.includes("proceedings") || t.includes("conference")) return "conference";
  if (t.includes("book")) return "book";
  if (t.includes("journal")) return "journal";
  if (t === "article") return "article";
  return "article";
}

function mapToOpenAlexType(type = "") {
  const t = normalize(type);
  if (t === "journal") return "article";
  if (t === "conference") return "proceedings-article";
  if (t === "book") return "book";
  if (t === "article") return "article";
  return "";
}

function buildComparator(sortBy) {
  if (sortBy === "publicationYear") {
    return (a, b) => b.publicationYear - a.publicationYear || b.relevanceScore - a.relevanceScore;
  }
  if (sortBy === "citationCount") {
    return (a, b) => (b.citationCount || 0) - (a.citationCount || 0);
  }
  return (a, b) => b.relevanceScore - a.relevanceScore || b.publicationYear - a.publicationYear;
}

function reconstructAbstract(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== "object") return "";
  const entries = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    if (!Array.isArray(positions)) continue;
    for (const pos of positions) {
      entries.push([pos, word]);
    }
  }
  entries.sort((a, b) => a[0] - b[0]);
  return entries.map((e) => e[1]).join(" ");
}

function matchesQuery(paper, query) {
  const q = sanitizeQuery(query);
  if (!q) return true;

  const haystack = [
    normalize(paper.title),
    normalize(paper.abstract),
    normalize(paper.source),
    ...paper.authors.map((a) => normalize(a)),
  ].join(" ");

  if (haystack.includes(q)) return true;

  const terms = q.split(" ").filter(Boolean);
  if (terms.length > 1 && terms.some((term) => term.length > 1 && haystack.includes(term))) {
    return true;
  }

  return false;
}

function applyFilters(items, { query, type, years, author, source }) {
  const normalizedAuthor = normalize(author);
  const normalizedSource = normalize(source);

  return items.filter((paper) => {
    if (!matchesQuery(paper, query)) return false;
    if (type && paper.type !== type) return false;
    if (years.length > 0 && !years.includes(Number(paper.publicationYear))) return false;
    if (normalizedAuthor && !paper.authors.some((a) => normalize(a).includes(normalizedAuthor))) return false;
    if (normalizedSource && !normalize(paper.source).includes(normalizedSource)) return false;
    return true;
  });
}

function applyStructuredFilters(items, { type, years, author, source }) {
  const normalizedAuthor = normalize(author);
  const normalizedSource = normalize(source);

  return items.filter((paper) => {
    if (type && paper.type !== type) return false;
    if (years.length > 0 && !years.includes(Number(paper.publicationYear))) return false;
    if (normalizedAuthor && !paper.authors.some((a) => normalize(a).includes(normalizedAuthor))) return false;
    if (normalizedSource && !normalize(paper.source).includes(normalizedSource)) return false;
    return true;
  });
}

function aggregateFacets(items) {
  const countBy = (arr, keyGetter) => {
    const map = new Map();
    for (const item of arr) {
      const key = keyGetter(item);
      map.set(key, (map.get(key) || 0) + 1);
    }
    return [...map.entries()].map(([value, count]) => ({ value, count }));
  };

  const type = countBy(items, (p) => p.type);
  const publicationYear = countBy(items, (p) => p.publicationYear).sort((a, b) => b.value - a.value);
  const authors = countBy(items.flatMap((p) => p.authors).map((a) => ({ name: a })), (a) => a.name)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  const sources = countBy(items, (p) => p.source).sort((a, b) => b.count - a.count);

  return { type, publicationYear, authors, sources };
}

function normalizePaperShape(paper) {
  return {
    id: paper.id,
    title: paper.title,
    authors: paper.authors,
    publicationYear: paper.publicationYear,
    source: paper.source,
    abstract: paper.abstract,
    relevanceScore: paper.relevanceScore,
    type: paper.type,
    citationCount: paper.citationCount || 0,
    detailUrl: paper.detailUrl || buildScholarSearchUrl(paper.title),
  };
}

function fetchJson(url, options = {}) {
  if (typeof fetch === "function") {
    return fetch(url, options).then(async (res) => {
      const text = await res.text();
      let json = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = {};
      }
      return { ok: res.ok, status: res.status, json };
    });
  }

  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          let json = {};
          try {
            json = data ? JSON.parse(data) : {};
          } catch {
            json = {};
          }
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, json });
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(config.externalSearchTimeoutMs, () => {
      req.destroy(new Error("External search timeout"));
    });
  });
}

function searchLocalPapers(params) {
  const withShape = papers.map(normalizePaperShape);
  const filtered = applyFilters(withShape, params);
  filtered.sort(buildComparator(params.sortBy));
  return filtered;
}

function mapOpenAlexWork(work) {
  const id = `oa:${String(work.id || "").split("/").pop() || Math.random().toString(36).slice(2)}`;
  const authors = Array.isArray(work.authorships)
    ? work.authorships
        .map((a) => a?.author?.display_name)
        .filter(Boolean)
        .slice(0, 8)
    : [];

  const source =
    work?.primary_location?.source?.display_name ||
    (Array.isArray(work?.sources) ? work.sources[0]?.display_name : "") ||
    "OpenAlex";

  const citationCount = Number(work.cited_by_count || 0);
  const relevanceScore = Math.max(60, Math.min(99, 70 + Math.log10(citationCount + 1) * 10));

  return {
    id,
    title: work.display_name || "Untitled",
    authors,
    publicationYear: Number(work.publication_year || 0),
    source,
    abstract: reconstructAbstract(work.abstract_inverted_index) || "Abstract not provided by source.",
    relevanceScore: Number(relevanceScore.toFixed(0)),
    type: mapPaperType(work.type || work.type_crossref || "article"),
    citationCount,
    detailUrl:
      work?.doi ||
      work?.primary_location?.landing_page_url ||
      work?.primary_location?.pdf_url ||
      work?.id ||
      buildScholarSearchUrl(work.display_name || ""),
  };
}

async function fetchOpenAlexPapers(params) {
  const query = sanitizeQuery(params.query);
  if (!query) return { items: [], total: 0 };

  const url = new URL(`${config.openAlexBaseUrl}/works`);
  url.searchParams.set("search", query);
  url.searchParams.set("page", String(params.page));
  // Keep backend page semantics aligned with frontend pagination.
  url.searchParams.set("per-page", String(Math.min(200, Math.max(1, params.pageSize))));
  url.searchParams.set(
    "select",
    "id,doi,display_name,publication_year,type,type_crossref,cited_by_count,authorships,primary_location,sources,abstract_inverted_index",
  );

  if (config.openAlexEmail) {
    url.searchParams.set("mailto", config.openAlexEmail);
  }

  const openAlexFilters = [];
  const openAlexType = mapToOpenAlexType(params.type);
  if (openAlexType) {
    openAlexFilters.push(`type:${openAlexType}`);
  }
  if (Array.isArray(params.years) && params.years.length > 0) {
    // OpenAlex supports publication_year filter list: publication_year:2021|2022
    openAlexFilters.push(`publication_year:${params.years.join("|")}`);
  }
  if (openAlexFilters.length > 0) {
    url.searchParams.set("filter", openAlexFilters.join(","));
  }

  try {
    const response = await fetchJson(url.toString(), {
      headers: {
        "User-Agent": "DeepResearchKnowledge/1.0",
      },
    });

    if (!response.ok) {
      return { items: [], total: 0 };
    }

    const json = response.json || {};
    const results = Array.isArray(json.results) ? json.results : [];

    const mapped = results.map(mapOpenAlexWork);
    // Keep only filters that cannot be reliably pushed to OpenAlex.
    const filtered = applyStructuredFilters(mapped, {
      type: "",
      years: [],
      author: params.author,
      source: params.source,
    });
    filtered.sort(buildComparator(params.sortBy));

    return {
      items: filtered,
      total: Number(json.meta?.count || filtered.length),
    };
  } catch {
    return { items: [], total: 0 };
  }
}

function dedupeByTitle(items) {
  const seen = new Set();
  const output = [];

  for (const item of items) {
    const key = normalize(item.title);
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }

  return output;
}

async function searchPapers(params) {
  const [external, local] = await Promise.all([fetchOpenAlexPapers(params), Promise.resolve(searchLocalPapers(params))]);

  const hasExternal = external.total > 0 || external.items.length > 0;
  // For external source, keep page items as-is so page count and total stay consistent.
  // Local fallback still deduplicates by title.
  const combined = hasExternal ? external.items : dedupeByTitle(local);
  combined.sort(buildComparator(params.sortBy));

  // External source already returns the requested page.
  // Local source contains full in-memory data and needs explicit pagination.
  const pagedBase = hasExternal
    ? combined.slice(0, params.pageSize)
    : combined.slice((params.page - 1) * params.pageSize, params.page * params.pageSize);

  const paged = pagedBase.map((paper) => ({
    id: paper.id,
    title: paper.title,
    authors: paper.authors,
    publicationYear: paper.publicationYear,
    source: paper.source,
    abstract: paper.abstract,
    relevanceScore: paper.relevanceScore,
    type: paper.type,
    detailUrl: paper.detailUrl || buildScholarSearchUrl(paper.title),
  }));

  return {
    results: paged,
    total: hasExternal ? external.total : combined.length,
    page: params.page,
    pageSize: params.pageSize,
    facets: aggregateFacets(combined),
  };
}

module.exports = {
  searchPapers,
};
