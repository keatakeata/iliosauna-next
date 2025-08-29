import { SaunaProducts } from '@/components/SaunaProducts';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Our Saunas</h1>
          <p className="text-xl text-gray-300">
            Premium infrared saunas handcrafted in Canada
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <SaunaProducts />
      </div>
    </div>
  );
}