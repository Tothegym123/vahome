import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getAllPosts,
  getAllCategories,
} from "../../lib/blog-posts";

export const revalidate = 3600;

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return { title: "Post Not Found | VaHome.com Blog" };
  }

  return {
    title: (() => {
      const suffix = ' | VaHome.com';
      const maxLen = 70;
      const maxTitleLen = maxLen - suffix.length;
      if (post.title.length > maxTitleLen) {
        return post.title.substring(0, maxTitleLen - 1).trimEnd() + '\u2026' + suffix;
      }
      return post.title + suffix;
    })(),
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${params.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "VaHome Team"],
      images: post.image
        ? [{ url: post.image, alt: post.title }]
        : undefined,
    },
  };
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const recentPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 5);
  const categories = getAllCategories();

  // JSON-LD Article structured data for AI search optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image || undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author || "VaHome Team",
    },
    publisher: {
      "@type": "Organization",
      name: "VaHome.com",
      url: "https://www.vahometest2.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.vahometest2.com/VaHome-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.vahometest2.com/blog/${params.slug}/`,
    },
    articleSection: post.category,
    url: `https://www.vahometest2.com/blog/${params.slug}/`,
  };

  return (
    <div className="min-h-screen bg-white" style={{ marginTop: "64px" }}>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/blog" className="hover:text-gray-900">
              Blog
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            {post.image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}

            {/* Post Header */}
            <div className="mb-8">
              <Link
                href={`/blog?category=${encodeURIComponent(post.category)}`}
                className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide hover:bg-blue-200 mb-4"
              >
                {post.category}
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 border-t border-b border-gray-200 py-4">
                <span>
                  By{" "}
                  <span className="font-semibold text-gray-900">
                    {post.author || "VaHome Team"}
                  </span>
                </span>
                <span className="text-gray-300">|</span>
                <time dateTime={post.date} className="text-gray-900">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>

            {/* Post Content */}
            <div
              className="prose prose-lg max-w-none text-gray-700 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-700 [&_strong]:text-gray-900 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-4 [&_ol]:space-y-2 [&_li]:text-gray-700 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-6 [&_img]:rounded-lg [&_img]:my-6 [&_img]:max-w-full [&_table]:w-full [&_table]:border-collapse [&_th]:bg-gray-100 [&_th]:p-3 [&_th]:text-left [&_td]:border [&_td]:border-gray-200 [&_td]:p-3"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  About the Author
                </h3>
                <p className="text-gray-700">
                  The VaHome Team is dedicated to providing expert real estate
                  insights for Hampton Roads, Virginia. Contact us at (757)
                  777-7577 or tom@vahomes.com.
                </p>
              </div>
            </div>

            {/* Back to Blog */}
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
              >
                &larr; Back to Blog
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-24">
              {/* CTA */}
              <div className="bg-blue-600 rounded-lg p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-2">
                  Looking for your dream home?
                </h3>
                <p className="text-sm text-blue-100 mb-4">
                  Explore listings in Hampton Roads and find the perfect
                  property.
                </p>
                <Link
                  href="/map"
                  className="inline-block bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 w-full text-center"
                >
                  Search the Map
                </Link>
              </div>

              {/* Recent Posts */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Posts
                </h3>
                <ul className="space-y-3">
                  {recentPosts.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium line-clamp-2"
                      >
                        {p.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(p.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      className={`block px-3 py-2 text-sm rounded-lg ${
                        category === post.category
                          ? "bg-white text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-white"
                      }`}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Have Questions?
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  The VaHome Team is here to help.
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
