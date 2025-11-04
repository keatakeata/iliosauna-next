'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { client as sanityClient } from '../../../../sanity/lib/client';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  variants: Array<{
    name: string;
    price: number;
    sku?: string;
    inventoryQuantity?: number;
    available: boolean;
  }>;
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const query = `*[_type == "ghlProduct" && slug.current == $slug && isActive == true][0] {
          _id,
          ghlProductId,
          name,
          slug,
          description,
          price,
          salePrice,
          images,
          category,
          features,
          variants,
          inStock,
          stockCount,
          allowOutOfStockPurchase,
          productCollection,
          specifications,
          seoTitle,
          seoDescription,
          badge,
          taxable,
          isActive
        }`;

        const data = await sanityClient.fetch(query, { slug });
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    const selectedVariantData = product.variants[selectedVariant];
    const productToAdd = {
      id: `${product.ghlProductId}-${selectedVariant}`,
      name: product.name,
      price: selectedVariantData?.price || product.price,
      image: product.images[0]?.url || '/placeholder.jpg',
      variant: selectedVariantData?.name || 'Standard',
      quantity
    };

    addToCart(productToAdd);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-[#BF5813] text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-white px-4">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-[#BF5813] text-white rounded-lg hover:bg-[#A04810] transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const currentPrice = product.variants[selectedVariant]?.price || product.price;
  const hasDiscount = product.salePrice && product.salePrice > 0;

  // Parse HTML description
  const parseDescription = (html: string) => {
    // Remove HTML tags but keep structure
    return html
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\n### $1\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
      .replace(/<ul[^>]*>|<\/ul>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .trim();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-[#BF5813] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#BF5813] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            {product.badge && (
              <div className="mb-4">
                <span className="inline-block px-4 py-1 bg-[#BF5813] text-white text-sm font-semibold rounded-full">
                  {product.badge}
                </span>
              </div>
            )}

            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#2a2a2a] mb-4">
              <Image
                src={product.images[selectedImage]?.url || '/placeholder.jpg'}
                alt={product.images[selectedImage]?.alt || product.name}
                fill
                className="object-cover"
                priority
              />
              {!product.inStock && !product.allowOutOfStockPurchase && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                      selectedImage === idx
                        ? 'ring-2 ring-[#BF5813]'
                        : 'ring-1 ring-gray-700 hover:ring-gray-500'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Category */}
            {product.productCollection && (
              <div className="text-[#BF5813] text-sm font-semibold uppercase tracking-wider mb-2">
                {product.productCollection}
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-[#BF5813]">
                CA$ {currentPrice.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {hasDiscount && (
                <span className="text-2xl text-gray-500 line-through">
                  CA$ {product.salePrice!.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">In Stock</span>
                  {product.stockCount && (
                    <span className="text-gray-400">({product.stockCount} available)</span>
                  )}
                </div>
              ) : product.allowOutOfStockPurchase ? (
                <div className="text-yellow-500 font-semibold">Pre-order Available</div>
              ) : (
                <div className="text-red-500 font-semibold">Out of Stock</div>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  Select Option
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(idx)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedVariant === idx
                          ? 'border-[#BF5813] bg-[#BF5813]/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="font-semibold">{variant.name}</div>
                      <div className="text-sm text-[#BF5813]">
                        CA$ {variant.price.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 text-gray-300">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-xl font-bold transition-colors"
                >
                  −
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-xl font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock && !product.allowOutOfStockPurchase}
              className="w-full py-4 px-8 bg-[#BF5813] text-white text-lg font-bold rounded-lg hover:bg-[#A04810] transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed mb-8"
            >
              {!product.inStock && !product.allowOutOfStockPurchase
                ? 'Out of Stock'
                : 'Add to Cart'}
            </button>

            {/* Description */}
            <div className="mb-8 prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {parseDescription(product.description)}
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-[#BF5813] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Specifications</h3>
                <div className="bg-[#2a2a2a] rounded-lg p-6">
                  <dl className="grid gap-4">
                    {product.specifications.map((spec: any, idx: number) => (
                      <div key={idx} className="flex justify-between border-b border-gray-700 pb-3">
                        <dt className="text-gray-400">{spec.label || spec.name}</dt>
                        <dd className="font-semibold">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-800">
              <div className="text-center">
                <div className="text-[#BF5813] text-2xl mb-2">🚚</div>
                <div className="text-sm text-gray-400">Free Shipping</div>
              </div>
              <div className="text-center">
                <div className="text-[#BF5813] text-2xl mb-2">🔒</div>
                <div className="text-sm text-gray-400">Secure Payment</div>
              </div>
              <div className="text-center">
                <div className="text-[#BF5813] text-2xl mb-2">✓</div>
                <div className="text-sm text-gray-400">Quality Guaranteed</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

        {/* Back to Products */}
        <div className="container mx-auto px-4 pb-16">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[#BF5813] hover:text-[#A04810] transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Products
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
