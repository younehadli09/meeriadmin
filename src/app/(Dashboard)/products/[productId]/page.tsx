"use client";

import Loader from '@/components/custom ui/Loader';
import ProductForm from '@/components/products/ProductForm'; // Make sure the import path is correct
import React, { useEffect, useState } from 'react';

const ProductDetails = ({ params }: { params: { productId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(null);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const res = await fetch(`/api/products/${params.productId}`, {
          method: "GET",
        });
        const data = await res.json();
        setProductDetails(data);
        setLoading(false);
      } catch (err) {
        console.log("[productId_GET]", err);
        setLoading(false);
      }
    };
    getProductDetails();
  }, [params.productId]); // Add 'params.productId' as a dependency

  return loading ? (
    <Loader />
  ) : (
    <ProductForm initialData={productDetails} />
  );
};

export default ProductDetails;
