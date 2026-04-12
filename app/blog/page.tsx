import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllCategories } from "../lib/blog-posts";

export function generateMetadata({ searchParams }: { searchParams: { page?: string; category?: string } }): Metadata {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const category = searchParams.category;
  
  let title = "Real Estate Blog";
  let description = "Expert real estate tips, market insights, and home buying guides for Hampton Roads, Virginia.";
  
  if (category) {
    title = category + " Real Estate Articles";
    description = "Browse " + category + " real estate articles, tips, and guides for Hampton Roads, Virginia.";
  }
  if (page > 1) {
    title += " - Page " + page;
  }
  title += " | VaHome.com";
  
  return {
    title,
    description,
    alternates: {
      canonical: category || page > 1 ? "/blog/" : undefined,
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
  const paginatedPosts = filteredPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-white" style={{ marginTop: "64px" }}>
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">VaHome Blog</h1>
          <p className="text-lg text-gray-600">
            Real estate insights and home buying tips for Hampton Roads, Virginia
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
                        <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
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
                      >
                        Read More &rarr;
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
                    href={`/blog?page=${currentPage - 1}${selectedCategory ? `&category=${selectedCategory}` : ""}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    &larr; Previous
                  </Link>
                )}
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
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
                      href={`/blog?page=${page}${selectedCategory ? `&category=${selectedCategory}` : ""}`}
                      className={`px-3 py-2 rounded-lg ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </Link>
                  );
                })}
                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}${selectedCategory ? `&category=${selectedCategory}` : ""}`}
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
                    href="/blog"
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
                        href={`/blog?category=${encodeURIComponent(category)}`}
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
                  href="/map"
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
                  The VaHome Team is ready to help you navigate the Hampton Roads
                  real estate market.
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
