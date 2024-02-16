import React from "react";
import AddNewProductForm from "@/components/add-new/products/product-form";
import ProductPreview from "@/components/add-new/products/product-preview";

const ProductAddLayout = () => {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <ProductPreview />
      </div>
      <div className="lg:col-span-2 ">
        <AddNewProductForm />
      </div>
    </div>
  );
};

export default ProductAddLayout;
