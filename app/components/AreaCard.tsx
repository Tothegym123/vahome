import Link from 'next/link'

interface AreaCardProps {
    name: string
    image: string
    listingCount: number
    href: string
}

export default function AreaCard({ name, image, listingCount, href }: AreaCardProps) {
    return (
          <Link href={href} className="group block relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-xl transition-all">
            {/* Background image */}
                <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${image})` }}
                        />
          
            {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
            {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-white font-bold text-lg">{name}</h3>h3>
                        <p className="text-white/80 text-sm mt-1">{listingCount.toLocaleString()}+ listings</p>p>
                </div>div>
          </Link>Link>
        )
}</Link>
