
"use strict";

console.clear();

// Get product ID from URL
const productId = new URLSearchParams(window.location.search).keys().next().value || "1";

// Get HTML elements
const containerProduct = document.getElementById("containerProduct");
const badge = document.getElementById("badge");

// Read cart information from cookie
function getCartData() {
    const cookie = document.cookie
        .split("; ")
        .find((item) => item.startsWith("orderId="));

    if (!cookie) {
        return {
            orderIds: [],
            counter: 0
        };
    }

    const cookieValue = cookie.substring("orderId=".length);
    const parts = cookieValue.split(",");

    const orderIds = parts[0]
        .split("=")
        .slice(1)
        .join("=")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const counterPart = parts.find((part) =>
        part.trim().startsWith("counter=")
    );

    const counter = counterPart
        ? Number(counterPart.split("=")[1]) || 0
        : orderIds.length;

    return {
        orderIds,
        counter
    };
}

// Save cart information in cookie
function saveCartData(orderIds) {
    const counter = orderIds.length;

    document.cookie =
        `orderId=${orderIds.join(" ")},counter=${counter}; path=/; SameSite=Lax`;

    if (badge) {
        badge.textContent = counter;
    }
}

// Update cart badge
function updateCartBadge() {
    const cartData = getCartData();

    if (badge) {
        badge.textContent = cartData.counter;
    }
}

// Add product to cart
function addToCart(id) {
    const cartData = getCartData();

    // Add product ID to cart
    cartData.orderIds.push(String(id));

    // Save updated cart
    saveCartData(cartData.orderIds);

    console.log("Product added to cart:", id);
    console.log("Updated cart:", cartData.orderIds);

    alert("Product added to cart!");
}

// Display product details
function dynamicContentDetails(product) {
    if (!containerProduct) {
        console.error("containerProduct element not found.");
        return;
    }

    // Clear previous product details
    containerProduct.innerHTML = "";

    // Main container
    const mainContainer = document.createElement("div");
    mainContainer.id = "containerD";

    // Product image section
    const imageSectionDiv = document.createElement("div");
    imageSectionDiv.id = "imageSection";

    const imgTag = document.createElement("img");
    imgTag.id = "imgDetails";
    imgTag.src = product.preview;
    imgTag.alt = product.name || "Product image";

    imageSectionDiv.appendChild(imgTag);

    // Product details section
    const productDetailsDiv = document.createElement("div");
    productDetailsDiv.id = "productDetails";

    // Product name
    const h1 = document.createElement("h1");
    h1.textContent = product.name || "Product";

    // Product brand
    const h4 = document.createElement("h4");
    h4.textContent = product.brand || "";

    // Product description and price section
    const detailsDiv = document.createElement("div");
    detailsDiv.id = "details";

    // Product price
    const priceHeading = document.createElement("h3");
    priceHeading.textContent = `Rs ${product.price}`;

    // Description heading
    const descriptionHeading = document.createElement("h3");
    descriptionHeading.textContent = "Description";

    // Description text
    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = product.description || "";

    detailsDiv.appendChild(priceHeading);
    detailsDiv.appendChild(descriptionHeading);
    detailsDiv.appendChild(descriptionParagraph);

    // Product preview section
    const productPreviewDiv = document.createElement("div");
    productPreviewDiv.id = "productPreview";

    const previewHeading = document.createElement("h3");
    previewHeading.textContent = "Product Preview";

    productPreviewDiv.appendChild(previewHeading);

    // Product preview images
    if (Array.isArray(product.photos)) {
        product.photos.forEach((photo) => {
            const previewImage = document.createElement("img");

            previewImage.className = "previewImg";
            previewImage.src = photo;
            previewImage.alt = "Product preview";
            previewImage.style.cursor = "pointer";

            // Change main image on preview click
            previewImage.addEventListener("click", function () {
                imgTag.src = photo;
            });

            productPreviewDiv.appendChild(previewImage);
        });
    }

    // Add to Cart button section
    const buttonDiv = document.createElement("div");
    buttonDiv.id = "button";

    const buttonTag = document.createElement("button");
    buttonTag.type = "button";
    buttonTag.textContent = "Add to Cart";

    // Add product to cart when clicked
    buttonTag.addEventListener("click", function () {
        addToCart(product.id);
    });

    buttonDiv.appendChild(buttonTag);

    // Append all sections
    productDetailsDiv.appendChild(h1);
    productDetailsDiv.appendChild(h4);
    productDetailsDiv.appendChild(detailsDiv);
    productDetailsDiv.appendChild(productPreviewDiv);
    productDetailsDiv.appendChild(buttonDiv);

    mainContainer.appendChild(imageSectionDiv);
    mainContainer.appendChild(productDetailsDiv);

    containerProduct.appendChild(mainContainer);
}

// Fetch product details from API
async function fetchProductDetails() {
    try {
        const response = await fetch(
            `https://5d76bf96515d1a0014085cf9.mockapi.io/product/${productId}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const product = await response.json();

        console.log("Product loaded:", product);

        dynamicContentDetails(product);

    } catch (error) {
        console.error("Unable to load product details:", error);

        if (containerProduct) {
            containerProduct.textContent =
                "Unable to load product details. Please try again later.";
        }
    }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    fetchProductDetails();
});
