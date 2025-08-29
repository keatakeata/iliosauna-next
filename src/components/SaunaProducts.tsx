import { fetchFromSanity, sanityImageUrl } from '@/lib/sanity.config';

// Type definitions
interface SaunaProduct {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  salePrice?: number;
  shortDescription: string;
  heroImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  features?: string[];
  inStock: boolean;
  featured: boolean;
}

export async function SaunaProducts() {
  // GROQ query to fetch sauna products
  const query = `*[_type == "saunaProduct" && inStock == true] | order(featured desc, orderRank asc, _createdAt desc) {
    _id,
    title,
    slug,
    price,
    salePrice,
    shortDescription,
    heroImage,
    features,
    inStock,
    featured
  }`;

  let products: SaunaProduct[] = [];
  
  try {
    products = await fetchFromSanity(query);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty state or mock data for development
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Products will appear here once connected to Sanity.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div 
          key={product._id} 
          className={`bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
            product.featured ? 'ring-2 ring-orange-500' : ''
          }`}
        >
          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            </div>
          )}

          {/* Product Image */}
          {product.heroImage?.asset && (
            <div className="relative h-64 bg-gray-100">
              <img 
                src={sanityImageUrl(product.heroImage.asset._ref, 600)}
                alt={product.heroImage.alt || product.title}
                className="w-full h-full object-cover"
              />
              {product.salePrice && (
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Sale
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Product Details */}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
            
            {/* Price */}
            <div className="mb-3">
              {product.salePrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-600">
                    ${product.salePrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${product.price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4 line-clamp-3">
              {product.shortDescription}
            </p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <ul className="mb-4 space-y-1">
                {product.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA Button */}
            <button 
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}