"use client";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  clearSelectedProduct,
  selectProductById,
} from "@/lib/features/product/product-pc-slice";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { FaSave, FaTrashAlt } from "react-icons/fa";

import { AiFillCloseSquare } from "react-icons/ai";
import { AppDispatch } from "@/store/redux/store";
import {
  createProductAsync,
  fetchAllProductByIdAsync,
  updateProductAsync,
} from "@/lib/features/product/product-pc-async-thunk";
import { selectCategories } from "@/lib/features/category/category-slice";
import { selectBrands } from "@/lib/features/brand/brand-slice";
import { useAppSelector } from "@/store/redux/useSelector";
import DangerModal from "@/components/ui/custom-modal/danger-modal";
import { Card, CardHeader, CardTitle } from "@/components/ui/shadcn/card";

function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: {},
  } = useForm();
  const brands = useAppSelector(selectBrands);
  const categories = useAppSelector(selectCategories);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const params = useParams();
  const selectedProduct = useAppSelector(selectProductById);
  const [openModal, setOpenModal] = useState<boolean | null>(false);
  const searchParams = useSearchParams();
  const prevPath = usePathname();
  const showDialog = searchParams.get("showDialog");

  useEffect(() => {
    if (params.id) {
      dispatch(fetchAllProductByIdAsync(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue("title", selectedProduct?.title);
      setValue("description", selectedProduct?.description);
      setValue("price", selectedProduct?.price);
      setValue("discountPercentage", selectedProduct?.discountPercentage);
      setValue("thumbnail", selectedProduct?.thumbnail);
      setValue("stock", selectedProduct?.stock);
      setValue("image1", selectedProduct?.images[0]);
      setValue("image2", selectedProduct?.images[1]);
      setValue("image3", selectedProduct?.images[2]);
      setValue("brand", selectedProduct?.brand);
      setValue("category", selectedProduct?.category);
    }
  }, [selectedProduct, params.id, setValue]);

  const handleDelete = () => {
    if (showDialog === "y") {
      window.location.href = `${prevPath}`;
    } else {
      const product = { ...selectedProduct };
      product.deleted = true;
      dispatch(updateProductAsync(product));
    }
  };

  return (
    <div>
      <form
        noValidate
        onSubmit={handleSubmit((data) => {
          const product: { [p: string]: any } = { ...data };
          product.images = [
            product?.image1,
            product?.image2,
            product?.image3,
            product?.thumbnail,
          ];
          product.rating = 0;
          delete product["image1"];
          delete product["image2"];
          delete product["image3"];
          product.price = +product?.price;
          product.stock = +product?.stock;
          product.discountPercentage = +product?.discountPercentage;

          if (params.id) {
            product.id = params?.id;
            product.rating = selectedProduct?.rating || 0;
            dispatch(updateProductAsync(product));
            reset();
          } else {
            dispatch(createProductAsync(product));
            reset();
            //TODO:  on product successfully added clear fields and show a message
          }
        })}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-4 ">
          <div className="p-8">
            <div className="border-b dark:border-gray-400/25 border-gray-900/10 ">
              <h2 className="block leading-6 text-gray-700 dark:text-gray-400 text-2xl font-semibold ">
                Product Update
              </h2>
              <div className="border-t mt-4 mb-2 border-gray-800 py-2 dark:border-gray-200  "></div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {selectedProduct && selectedProduct.deleted && (
                  <Card className="bg-red-500/25 border-gray-600">
                    <CardHeader>
                      <CardTitle
                        className="text-sm font-bold text-center
                                             w-20 l  rounded-lg block dark:text-gray-400
                                                text-black break-words"
                      >
                        This Product {selectedProduct?.title}#
                        {selectedProduct?.id} is deleted
                      </CardTitle>
                    </CardHeader>
                  </Card>
                )}

                <div className="sm:col-span-6">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Product Name
                  </label>
                  <div className="mt-2">
                    <div className="default-input">
                      <input
                        type="text"
                        {...register("title", {
                          required: "name is required",
                        })}
                        id="title"
                        className="default-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      {...register("description", {
                        required: "description is required",
                      })}
                      rows={3}
                      className="p-2 block w-full rounded-2xl bg-white bg-opacity-40 dark:bg-stone-950/20 shadow-2xl dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-indigo-500 focus:border-indigo-800 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about product.
                  </p>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Brand
                  </label>
                  <div className="mt-2">
                    <select
                      className="h-10 w-56 bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                      {...register("brand", {
                        required: "brand is required",
                      })}
                    >
                      <option value="">--choose brand--</option>
                      {brands.map((brand: any, index: any) => (
                        <option key={index} value={brand.value}>
                          {brand.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Category
                  </label>
                  <div className="mt-2">
                    <select
                      className="h-10 w-56 bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                      {...register("category", {
                        required: "category is required",
                      })}
                    >
                      <option value="">--choose category--</option>
                      {categories.map((category: any, index: any) => (
                        <option key={index} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Price
                  </label>
                  <div className="mt-2">
                    <div className="default-input">
                      <input
                        type="number"
                        {...register("price", {
                          required: "price is required",
                          min: 1,
                          max: 10000,
                        })}
                        id="price"
                        className="default-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="discountPercentage"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Discount Percentage
                  </label>
                  <div className="mt-2">
                    <div className="default-input">
                      <input
                        type="number"
                        {...register("discountPercentage", {
                          required: "discountPercentage is required",
                          min: 0,
                          max: 100,
                        })}
                        id="discountPercentage"
                        className="default-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Stock
                  </label>
                  <div className="mt-2">
                    <div className="default-input">
                      <input
                        type="number"
                        {...register("stock", {
                          required: "stock is required",
                          min: 0,
                        })}
                        id="stock"
                        className="default-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="thumbnail"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Thumbnail
                  </label>
                  <div className="mt-2">
                    <div className="default-input">
                      <input
                        type="text"
                        {...register("thumbnail", {
                          required: "thumbnail is required",
                        })}
                        id="thumbnail"
                        className="default-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="image1"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Image 1
                  </label>
                  <div className="mt-2">
                    <div className="default-input">
                      <input
                        type="text"
                        {...register("image1", {
                          required: "image1 is required",
                        })}
                        id="image1"
                        className="default-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  xa{" "}
                  <label
                    htmlFor="image2"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Image 2
                  </label>
                  <div className="mt-2">
                    <div className="default-input">
                      <input
                        type="text"
                        {...register("image2", {
                          required: "image is required",
                        })}
                        id="image2"
                        className="default-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6 mb-8">
                  <label
                    htmlFor="image2"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Image 3
                  </label>
                  <div className="mt-2">
                    <div className="default-input">
                      <input
                        type="text"
                        {...register("image3", {
                          required: "image is required",
                        })}
                        id="image3"
                        className="default-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 ">
              <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 mt-6">
                Extra{" "}
              </h2>

              <div className="mt-10 space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200">
                    By Email
                  </legend>
                  <div className="mt-6 space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="comments"
                          name="comments"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="comments"
                          className="font-medium text-gray-900 dark:text-gray-200"
                        >
                          Comments
                        </label>
                        <p className="text-gray-500">
                          Get notified when someones posts a comment on a
                          posting.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="candidates"
                          name="candidates"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="candidates"
                          className="font-medium text-gray-900 dark:text-gray-200"
                        >
                          Candidates
                        </label>
                        <p className="text-gray-500">
                          Get notified when a candidate applies for a job.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="offers"
                          name="offers"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="offers"
                          className="font-medium text-gray-900 dark:text-gray-200"
                        >
                          Offers
                        </label>
                        <p className="text-gray-500">
                          Get notified when a candidate accepts or rejects an
                          offer.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-6 pb-6">
            <motion.button
              type="submit"
              className="inline-flex rounded-md px-3 border-2 py-2 text-md font-semibold text-grey text-teal-900 dark:text-teal-200 shadow-sm hover:bg-grey-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 border-teal-600/50"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#37cfc2",
                color: "#FFFFFF",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                initial={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <AiFillCloseSquare className="mt-0.5 mr-1" />
              </motion.span>
              Cancel
            </motion.button>

            {selectedProduct && !selectedProduct?.deleted && (
              <motion.button
                type="submit"
                className="inline-flex rounded-md px-3 border-2 py-2 text-md font-semibold text-grey text-red-900 dark:text-red-200 shadow-sm hover:bg-grey-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 border-red-600/50"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#FF0000",
                  color: "#FFFFFF",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.preventDefault();
                  if (showDialog !== "y") {
                    setOpenModal(true);
                  } else {
                    handleDelete();
                  }
                }}
              >
                <motion.span
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                >
                  <FaTrashAlt className="mt-0.5 mr-1" />
                </motion.span>
                Delete
              </motion.button>
            )}

            <motion.button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 mt-1 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#4A90E2",
                transition: {
                  duration: 0.2,
                },
              }}
            >
              <motion.span
                initial={{ rotate: 0 }}
                whileHover={{
                  rotate: 360,
                  transition: {
                    duration: 0.5,
                  },
                }}
                transition={{ duration: 0.5 }}
                className="inline-block mr-1 "
              >
                <FaSave />
              </motion.span>
              Save
            </motion.button>
          </div>
        </div>
      </form>
      {selectedProduct && (
        <DangerModal
          title={`Delete ${selectedProduct?.title}`}
          message="Are you sure you want to delete this Product ?"
          dangerOption="Delete"
          cancelOption="Cancel"
          dangerAction={handleDelete}
          cancelAction={() => setOpenModal(null)}
          showModal={openModal}
          icon={
            <FaTrashAlt className="h-6 w-6 text-red-600" aria-hidden="true" />
          }
        />
      )}
    </div>
  );
}

export default ProductForm;
