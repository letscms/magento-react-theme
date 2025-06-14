import React, { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { isAuthenticated } from "../../api/auth";
import { createRoot } from "react-dom/client";
import LoginWrapper from "../forms/LoginWrapper";

const AddToCartButton = ({
  product,
  quantity,
  className = "bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition",
  showQuantity = false,
  buttonText = "Add to Cart",
  onSuccess = () => {},
  onError = () => {},
  selectedOptions,
  bundleSelections,
  groupedItemsQuantities,
}) => {
  const { addItemToCart, loading } = useCart();
  const itemQuantity = quantity;
  const [addingToCart, setAddingToCart] = useState(false);
  const user = isAuthenticated();
  const navigate = useNavigate();
  console.log("bundaleSelections", bundleSelections);
  // console.log("selectedOptions", selectedOptions);
  

  const isLoading = loading || addingToCart;
  const buttonClasses = `${className} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`;

  const navigateIfProductEmpty = (product) => {
    if (!product) return;

    const typeChecks = {
      DownloadableProduct: !product.downloadable_product_links?.length,
      BundleProduct: !product.items?.length,
      GroupedProduct: !product.items?.length,
      ConfigurableProduct: !product.configurable_options?.length,
    };
    console.log("typeChecks", typeChecks);
    if (typeChecks[product.__typename]) {
      navigate(`/product/${product.url_key}`);
      return true;
    }
    
    return false;
  };

  const buildCartItemPayload = () => {
    const { type_id, sku, name, price_range, small_image } = product;
    const basePayload = {
      sku,
      qty: itemQuantity,
      name: name || "Product",
      price: price_range?.minimum_price?.final_price?.value || 0,
      image: small_image?.url || "",
      __typename: product.__typename || "Product",
    };

    switch (type_id) {
      case "configurable":
        if (!selectedOptions) return null;
        return {
          ...basePayload,
          product_option: {
            extension_attributes: {
              configurable_item_options: Object.entries(selectedOptions).map(
                ([id, value]) => ({
                  option_id: String(id),
                  option_value: Number(value),
                })
              ),
            },
          },
        };

      case "bundle":
        if (!bundleSelections) return null;
        return {
          ...basePayload,
          product_option: {
            extension_attributes: {
              bundle_options: Object.values(bundleSelections).map((sel) => ({
                option_id: sel.option_id,
                option_qty: sel.quantity,
                option_selections: [sel.selection_id],
              })),
            },
          },
        };

      case "grouped":
        if (!groupedItemsQuantities) return null;
        // Convert groupedItemsQuantities object to array of { sku, qty }
        const groupedItems = Object.entries(groupedItemsQuantities)
          .filter(([sku, qty]) => qty > 0) // Only include items with positive quantities
          .map(([sku, qty]) => ({
            sku,
            qty: parseInt(qty, 10),
          }));
        if (groupedItems.length === 0) return null;
        return {
          ...basePayload,
          extension_attributes: {
            grouped_items: groupedItems,
          },
        };

      default:
        return basePayload;
    }
  };

  const showLoginPopup = async () => {
    const container = document.createElement("div");
    const root = createRoot(container);

    root

.render(<LoginWrapper />);

    const result = await Swal.fire({
      html: container,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        container: "login-popup-container",
        popup: "login-popup",
      },
      width: "500px",
      didDestroy: () => {
        root.unmount();
      },
    });

    return result.isConfirmed;
  };

  const handleAddToCart = async () => {
    // console.log("i am clicked");
    if (!product || !product.sku) return;
    // console.log("Adding product to cart:", product);

    if (!user) {
      const loginResult = await showLoginPopup();
      if (!loginResult) return; // User cancelled login
    }

    if (product.stock_status !== "IN_STOCK") {
      toast.error(`${product.name} is out of stock.`);
      return navigate(`/product/${product.url_key}`);
    }
    if (navigateIfProductEmpty(product)) return;
    // console.log("code  reached here");

    try {
      setAddingToCart(true);
      const cartItemPayload = buildCartItemPayload();
      console.log("Cart item payload:", cartItemPayload);
      // return;

      if (!cartItemPayload) {
        toast.error(
          product.type_id === "grouped"
            ? "Please select quantities for at least one grouped product item."
            : "Please select required options before adding to cart."
        );
        return;
      }

      console.log("Adding to cart:", cartItemPayload);
      const response = await addItemToCart(cartItemPayload);

      if (response.success) {
        toast.success(`${product.name} added to cart!`, {
          position: "top-right",
          autoClose: 3000,
        });
        onSuccess(product, itemQuantity);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error(
        error.message.includes("grouped product items")
          ? error.message
          : `Failed to add ${product.name} to cart. Please try again.`,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      onError(error);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className={buttonClasses}
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding...
          </span>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
};

export default React.memo(AddToCartButton);