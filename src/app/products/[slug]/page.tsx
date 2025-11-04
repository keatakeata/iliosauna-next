'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// --- SVG Icon Components ---
const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width="16" height="16">
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
  </svg>
);

const ShoppingBagIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width="24" height="24">
    <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
  </svg>
);

const TruckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const ShieldCheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width="20" height="20">
    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }: { className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width="20" height="20">
    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

interface GHLVariant {
  id: string;
  name: string;
  options: Array<{ id: string; name: string }>;
}

interface PriceVariant {
  name: string;
  price: number;
  priceId?: string;
  sku?: string;
  inventoryQuantity?: number;
  available: boolean;
}

interface Product {
  _id: string;
  ghlProductId: string;
  name: string;
  slug: { current: string };
  description: string;
  price: number;
  salePrice?: number;
  images: Array<{ url: string; alt: string }>;
  category: string;
  features: string[];
  variants: PriceVariant[];
  ghlVariants?: GHLVariant[];
  inStock: boolean;
  stockCount?: number;
  allowOutOfStockPurchase: boolean;
  productCollection?: string;
  specifications: any[];
  seoTitle?: string;
  seoDescription?: string;
  badge?: string;
  taxable: boolean;
  isActive: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${slug}`);

        if (!response.ok) {
          console.error('Failed to fetch product:', response.statusText);
          setProduct(null);
          return;
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Find matching variant price based on selected options - using useMemo for reactivity
  const currentPrice = useMemo(() => {
    if (!product) return 0;

    // If there are variants and selections have been made
    if (product.variants && product.variants.length > 0 && Object.keys(selectedOptions).length > 0) {
      // Find variant that matches ALL selected options
      const matchingVariant = product.variants.find((variant: PriceVariant) => {
        const selectedValues = Object.values(selectedOptions);
        return selectedValues.every(value => variant.name.includes(value));
      });

      if (matchingVariant) {
        console.log('Matched variant:', matchingVariant.name, 'Price:', matchingVariant.price);
        return matchingVariant.price;
      }
    }

    // Default to base price or first variant price
    return product.variants?.[0]?.price || product.price;
  }, [product, selectedOptions]);

  const hasDiscount = product?.salePrice && product.salePrice > 0;

  const increaseQuantity = () => {
    if (!product?.stockCount || quantity < product.stockCount) {
      setQuantity(q => q + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const variantName = Object.entries(selectedOptions)
      .map(([key, value]) => value)
      .join(' / ') || 'Standard';

    addItem({
      id: product._id,
      name: product.name,
      price: currentPrice,
      quantity,
      image: product.images[0]?.url || '/placeholder.jpg',
      variant: variantName
    });
  };

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  return (
    <>
      <Navbar forceScrolled={true} />

      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-xl text-[#BF5813]">Loading...</div>
        </div>
      ) : !product ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn't find the product you're looking for.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-[#BF5813] text-white rounded-md hover:bg-[#A64910] transition-colors"
          >
            <ArrowLeftIcon className="mr-2" />
            Back to Products
          </Link>
        </div>
      ) : (
        <>
          <main className="min-h-screen bg-white pt-24">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <nav className="flex items-center text-sm text-gray-500 space-x-2">
                <Link href="/" className="hover:text-gray-700">Home</Link>
                <span>/</span>
                <Link href="/products" className="hover:text-gray-700">Products</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{product.name}</span>
              </nav>
            </div>

            {/* Product Details */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Images */}
                <div>
                  {/* Main Image */}
                  <div className="relative w-full overflow-hidden bg-gray-50 mb-4 rounded-lg" style={{ height: '500px' }}>
                    <img
                      src={product.images[currentImageIndex]?.url || '/placeholder.jpg'}
                      alt={product.images[currentImageIndex]?.alt || product.name}
                      className="object-cover w-full h-full"
                      style={{ height: '500px' }}
                    />

                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                          aria-label="Previous image"
                        >
                          <ArrowLeftIcon className="text-gray-700" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                          aria-label="Next image"
                        >
                          <ArrowRightIcon className="text-gray-700" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {product.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {product.images.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3 w-full">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`aspect-square overflow-hidden bg-gray-50 rounded-lg ${
                            currentImageIndex === idx
                              ? 'ring-2 ring-[#BF5813]'
                              : 'ring-1 ring-gray-200 hover:ring-gray-300'
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.alt || `${product.name} - Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column - Product Info */}
                <div>
                  <div className="flex items-start justify-between">
                    {/* Badge */}
                    {product.badge && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#BF5813]/10 text-[#BF5813] mb-4">
                        {product.badge}
                      </span>
                    )}

                    {/* Product Name */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {product.name}
                    </h1>
                  </div>

                  {/* Price */}
                  <div className="mt-4 mb-6">
                    <span className="text-3xl font-bold text-[#BF5813]">
                      CA$ {currentPrice.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {hasDiscount && (
                      <span className="ml-3 text-lg text-gray-400 line-through">
                        CA$ {product.salePrice!.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    )}

                    {/* Stock Status */}
                    <div className="mt-2">
                      {product.inStock ? (
                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                          <CheckIcon className="w-4 h-4" />
                          In stock
                          {product.stockCount && (
                            <span className="text-gray-400">({product.stockCount} available)</span>
                          )}
                        </span>
                      ) : product.allowOutOfStockPurchase ? (
                        <span className="text-sm text-yellow-600 font-medium">Pre-order Available</span>
                      ) : (
                        <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  {/* Variant Selectors - GHL Style Button Selection - ABOVE TABS */}
                  {product.ghlVariants && product.ghlVariants.length > 0 && (
                    <div className="mb-8 space-y-6">
                      {product.ghlVariants.map((variant) => (
                        <div key={variant.id}>
                          <label className="block text-sm font-medium text-gray-900 mb-3">
                            {variant.name}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {variant.options.map((option) => {
                              const isSelected = selectedOptions[variant.id] === option.name;
                              return (
                                <button
                                  key={option.id}
                                  onClick={() => {
                                    const newSelections = {
                                      ...selectedOptions,
                                      [variant.id]: option.name
                                    };
                                    setSelectedOptions(newSelections);

                                    // Find matching price variant based on selected options
                                    const selectedOptionsString = Object.values(newSelections).join(' / ');
                                    const matchingVariant = product.variants.find((v: PriceVariant) =>
                                      v.name.includes(option.name)
                                    );

                                    if (matchingVariant && matchingVariant.priceId) {
                                      // Find image with this priceId
                                      const imageIndex = product.images.findIndex((img: any) =>
                                        img.priceIds && img.priceIds.includes(matchingVariant.priceId)
                                      );

                                      if (imageIndex !== -1) {
                                        setCurrentImageIndex(imageIndex);
                                      }
                                    }
                                  }}
                                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                                    isSelected
                                      ? 'bg-gray-900 text-white border-gray-900'
                                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                  }`}
                                >
                                  {option.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tabs */}
                  <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8" aria-label="Product information tabs">
                      {[
                        { key: 'description', label: 'Description, Features, and Warranty' },
                        { key: 'specifications', label: 'Specifications' }
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab.key
                              ? 'border-[#BF5813] text-[#BF5813]'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab content */}
                  <div className="mb-8 max-h-64 overflow-y-auto">
                    {activeTab === 'description' && (
                      <div
                        className="text-gray-700 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-4 [&_h3]:mb-3 [&_p]:my-3 [&_p]:leading-relaxed [&_ul]:my-4 [&_ul]:ml-5 [&_li]:list-disc [&_li]:my-2 [&_strong]:font-semibold"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    )}

                    {activeTab === 'specifications' && (
                      <div>
                        {product.specifications && product.specifications.length > 0 ? (
                          <dl className="divide-y divide-gray-200">
                            {product.specifications.map((spec: any, idx: number) => (
                              <div key={idx} className="py-3 flex justify-between text-sm">
                                <dt className="font-medium text-gray-900">{spec.label}</dt>
                                <dd className="text-gray-700">{spec.value}</dd>
                              </div>
                            ))}
                          </dl>
                        ) : (
                          <p className="text-gray-500">No specifications available for this product.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity and Add to Cart */}
                  <div className="mt-8">
                    <label className="block text-sm font-medium text-gray-900 mb-3">Quantity</label>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={decreaseQuantity}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                          disabled={quantity <= 1}
                        >
                          <span className="sr-only">Decrease quantity</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          type="text"
                          value={quantity}
                          readOnly
                          className="w-12 text-center border-0 focus:ring-0 bg-transparent text-gray-900 font-medium"
                        />
                        <button
                          onClick={increaseQuantity}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                          disabled={!!product.stockCount && quantity >= product.stockCount}
                        >
                          <span className="sr-only">Increase quantity</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock && !product.allowOutOfStockPurchase}
                        className="flex-1 flex items-center justify-center px-6 py-3 bg-[#BF5813] text-white rounded-md hover:bg-[#A64910] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        <ShoppingBagIcon className="mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <TruckIcon className="text-[#BF5813] mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Free Shipping</h3>
                          <p className="text-xs text-gray-500">On orders over $500</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <ShieldCheckIcon className="text-[#BF5813] mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Warranty</h3>
                          <p className="text-xs text-gray-500">Lifetime on cedar</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
