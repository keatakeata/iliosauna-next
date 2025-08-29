// Example of how to use Sanity in your Next.js components
import { fetchFromSanity, sanityImageUrl } from './sanity.config';

// Example type definitions
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: {
    _type: 'image';
    asset: {
      _ref: string;
    };
  };
}

// Example server component fetching data
export async function SanityProductList() {
  // Example GROQ query to fetch products
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    title,
    description,
    price,
    image
  }`;
  
  const products = await fetchFromSanity(query) as Product[];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="border rounded-lg p-4">
          {product.image && (
            <img 
              src={sanityImageUrl(product.image.asset._ref, 400)}
              alt={product.title}
              className="w-full h-48 object-cover rounded"
            />
          )}
          <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl font-bold mt-2">${product.price}</p>
        </div>
      ))}
    </div>
  );
}

// Example client component with hooks (when proper packages are installed)
// 'use client';
// import { useEffect, useState } from 'react';
// 
// export function ClientSanityComponent() {
//   const [data, setData] = useState(null);
//   
//   useEffect(() => {
//     fetchFromSanity('*[_type == "settings"][0]')
//       .then(setData)
//       .catch(console.error);
//   }, []);
//   
//   return <div>{/* Render your data */}</div>;
// }