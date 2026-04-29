import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllCategories } from "../lib/blog-posts";

const CATEGORY_INTROS: Record<string, string> = {
  "buying": "The home-buying process in Hampton Roads can feel daunting, especially for first-time buyers. Articles in this category cover everything from credit-score preparation and loan pre-approval to navigating multiple-offer situations, understanding closing costs, and avoiding the most common psychological traps that trip up home buyers. Whether you're shopping for a starter home in Norfolk, a family home in Chesapeake, or a beach property in Virginia Beach, the VaHome team's buying guides walk you through each step with local market insight.",
  "chesapeake": "Chesapeake is one of Hampton Roads' most popular real estate markets, known for great public schools, lower property taxes, and a wide mix of housing types from waterfront properties to suburban subdivisions. Articles in this category cover Chesapeake-specific topics including neighborhood guides for Western Branch, Greenbrier, and Great Bridge, school district analysis, new construction trends, and tips for buying or selling in the area. The VaHome team has extensive experience helping clients across Chesapeake.",
  "financing": "Understanding mortgage and financing options is one of the most important parts of buying a home. This category covers conventional loans, FHA loans, VA loans for active-duty military and veterans, USDA loans for rural Hampton Roads properties, jumbo loans, refinancing strategies, cash-out options, and credit-building tips for buyers preparing to apply. Each article is written with Hampton Roads buyers in mind, covering local lender recommendations and current rate trends.",
  "general": "General real estate articles for Hampton Roads home buyers and sellers. This category covers a wide range of topics including market trends, seasonal buying strategies, working with a Realtor, understanding home inspections and appraisals, navigating closings, and answering the most common questions we hear from clients. Whether you're researching your first move or your tenth, these articles provide practical information you can use right away.",
  "hampton-roads": "Hampton Roads is one of America's most distinctive real estate regions, combining seven cities Ã¢ÂÂ Virginia Beach, Norfolk, Chesapeake, Suffolk, Hampton, Newport News, and Portsmouth Ã¢ÂÂ with the surrounding counties of York, James City, and Gloucester. This category covers regional topics that span multiple cities, including commute analysis, school district comparisons, military base proximity, area economic trends, and what makes each Hampton Roads submarket unique. The VaHome team works across the entire region.",
  "military": "Hampton Roads is home to the largest concentration of active-duty military personnel in the United States, including Naval Station Norfolk, Joint Base Langley-Eustis, NAS Oceana, and many other installations. Military-focused articles cover VA loans, BAH calculations by paygrade and rank, PCS move planning, on-base versus off-base housing decisions, military-friendly neighborhoods, and tips for active-duty service members and veterans buying or selling. The VaHome team includes military-experienced agents.",
  "norfolk": "Norfolk is the second-largest city in Hampton Roads and home to Naval Station Norfolk, the largest naval base in the world. Articles in this category cover Norfolk-specific topics including neighborhood guides for Ghent, Larchmont, Colonial Place, and Edgewater, downtown waterfront development, the Tide light rail, and the city's strong military housing market. Norfolk's mix of historic homes, walkable neighborhoods, and military-driven demand makes it a unique submarket within Hampton Roads.",
  "suffolk": "Suffolk is the fastest-growing city in Hampton Roads and the largest by land area in Virginia. Articles in this category cover Suffolk-specific topics including new construction in Harbour View and Burbage Grant, historic Downtown Suffolk, rural and waterfront properties in the southern part of the city, school options, and the city's relatively affordable price point compared to neighboring areas. Suffolk's growth trajectory makes it especially attractive to families and military households.",
  "virginia-beach": "Virginia Beach is the largest city in Hampton Roads and one of the most desirable real estate markets in the region. Articles in this category cover Virginia Beach-specific topics including oceanfront and bayfront properties, neighborhoods like Sandbridge, Great Neck, Kempsville, and Pungo, the area's top-ranked public schools, NAS Oceana proximity, and the local resort economy. Whether you're looking for a primary residence, second home, or investment property, the VaHome team has deep Virginia Beach experience."
};


export function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}): Metadata {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const category = searchParams.category;
  let title = "Real Estate Blog";
  let description =
    "Expert real estate tips, market insights, and home buying guides for Hampton Roads, Virginia.";

  if (category) {
    title = category + " Real Estate Articles";
    description =
      "Browse " +
      category +
      " real estate articles, tips, and guides for Hampton Roads, Virginia.";
  }
  if (page > 1) {
    title += " - Page " + page;
  }
  title += " | VaHome.com";

  return {
    title,
    description,
    alternates: {
      canonical: "https://www.vahome.com/blog/",
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

const POSTS_PER_PAGE = 12;

export default function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const selectedCategory = searchParams.category;

  const allPosts = getAllPosts();
  const filteredPosts = selectedCategory
    ? allPosts.filter(
        (post) =>
          post.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : allPosts;

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIdx,
    startIdx + POSTS_PER_PAGE
  );
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-white" style={{ marginTop: "64px" }}>
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            VaHome Blog
          </h1>
          {(() => {
            const c = (searchParams?.category || "").toString().toLowerCase().replace(/\s+/g, "-");
            const intro = CATEGORY_INTROS[c];
            if (!intro) return null;
            return (
              <section className="max-w-4xl mx-auto px-6 py-8">
                <p className="text-gray-700 leading-relaxed text-base">{intro}</p>
              </section>
            );
          })()}
          <p className="text-lg text-gray-600">
            Real estate insights and home buying tips for Hampton Roads,
            Virginia
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {paginatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {paginatedPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            VaHome Blog
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-3">
                        <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                          {post.category}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                        <span>{post.author || "VaHome Team"}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-block text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                        aria-label={`Read more about ${post.title}`}
                      >
                        Read: {post.title} &rarr;
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">
                  No blog posts found in this category.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {currentPage > 1 && (
                  <Link
                    href={`/blog?page=${currentPage - 1}${
                      selectedCategory
                        ? `&category=${selectedCategory}`
                        : ""
                    }`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    &larr; Previous
                  </Link>
                )}
                {Array.from(
                  { length: Math.min(totalPages, 10) },
                  (_, i) => {
                    let page: number;
                    if (totalPages <= 10) {
                      page = i + 1;
                    } else if (currentPage <= 5) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 4) {
                      page = totalPages - 9 + i;
                    } else {
                      page = currentPage - 4 + i;
                    }
                    return (
                      <Link
                        key={page}
                        href={`/blog?page=${page}${
                          selectedCategory
                            ? `&category=${selectedCategory}`
                            : ""
                        }`}
                        className={`px-3 py-2 rounded-lg ${
                          page === currentPage
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </Link>
                    );
                  }
                )}
                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}${
                      selectedCategory
                        ? `&category=${selectedCategory}`
                        : ""
                    }`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Next &rarr;
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Categories
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/blog/"
                    className={`block px-4 py-2 rounded-lg text-sm ${
                      !selectedCategory
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-white"
                    }`}
                  >
                    All Posts ({allPosts.length})
                  </Link>
                  {categories.map((category) => {
                    const count = allPosts.filter(
                      (p) => p.category === category
                    ).length;
                    return (
                      <Link
                        key={category}
                        href={`/blog?category=${encodeURIComponent(
                          category
                        )}`}
                        className={`block px-4 py-2 rounded-lg text-sm ${
                          selectedCategory === category
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-white"
                        }`}
                      >
                        {category} ({count})
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-2">
                  Looking for your dream home?
                </h3>
                <p className="text-sm text-blue-100 mb-4">
                  Browse our current listings in Hampton Roads and find your
                  perfect property.
                </p>
                <Link
                  href="/map/"
                  className="inline-block bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 w-full text-center"
                >
                  Search the Map
                </Link>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Questions?
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  The VaHome Team is ready to help you navigate the Hampton
                  Roads real estate market.
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  (757) 777-7577
                </p>
                <p className="text-sm text-gray-600">tom@vahomes.com</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
