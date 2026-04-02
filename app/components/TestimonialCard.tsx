interface TestimonialProps {
    name: string
    text: string
    rating: number
    date: string
}

export default function TestimonialCard({ name, text, rating, date }: TestimonialProps) {
    return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                      <svg
                                    key={i}
                                    className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>svg>
                    ))}
                </div>div>
          
            {/* Review text */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                        &ldquo;{text}&rdquo;
                </p>p>
          
            {/* Author */}
                <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">{name}</span>span>
                        <span className="text-xs text-gray-400">{date}</span>span>
                </div>div>
          </div>div>
        )
}</div>
