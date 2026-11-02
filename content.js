
"use strict";

let contentTitle = [];

function dynamicClothingSection(product) {
    const boxDiv = document.createElement("div");
    boxDiv.id = "box";

    const boxLink = document.createElement("a");
    boxLink.href = "contentDetails.html?" + product.id;

    const imgTag = document.createElement("img");
    imgTag.src = product.preview;
    imgTag.alt = product.name || "Product image";
    imgTag.loading = "lazy";

    const detailsDiv = document.createElement("div");
    detailsDiv.id = "details";

    const h3 = document.createElement("h3");
    h3.textContent = product.name || "Product";

    const h4 = document.createElement("h4");
    h4.textContent = product.brand || "";

    const h2 = document.createElement("h2");
    h2.textContent = "Rs. " + (product.price ?? "N/A");

    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(h4);
    detailsDiv.appendChild(h2);

    boxLink.appendChild(imgTag);
    boxLink.appendChild(detailsDiv);
    boxDiv.appendChild(boxLink);

    return boxDiv;
}

async function loadProducts() {
    const containerClothing = document.getElementById("containerClothing");
    const containerAccessories = document.getElementById("containerAccessories");

    if (!containerClothing || !containerAccessories) {
        console.error("Product containers are missing from the page.");
        return;
    }

    containerClothing.innerHTML = "";
    containerAccessories.innerHTML = "";

    try {
        const response = await fetch(
            "https://5d76bf96515d1a0014085cf9.mockapi.io/product"
        );

        if (!response.ok) {
            throw new Error("API request failed. Status: " + response.status);
        }

        contentTitle = await response.json();

        if (!Array.isArray(contentTitle) || contentTitle.length === 0) {
            containerClothing.innerHTML = "<p>No clothing products found.</p>";
            containerAccessories.innerHTML = "<p>No accessories found.</p>";
            return;
        }

        contentTitle.forEach(function (product) {
            if (product.isAccessory) {
                containerAccessories.appendChild(
                    dynamicClothingSection(product)
                );
            } else {
                containerClothing.appendChild(
                    dynamicClothingSection(product)
                );
            }
        });

        // Update cart badge if it exists
        const badge = document.getElementById("badge");

        if (badge) {
            const cookieParts = document.cookie.split(",");
            const counterPart = cookieParts.find(function (part) {
                return part.trim().startsWith("counter=");
            });

            if (counterPart) {
                badge.textContent = counterPart.split("=")[1];
            }
        }

        console.log("Products loaded successfully:", contentTitle.length);

    } catch (error) {
        console.error("Unable to load products:", error);

        containerClothing.innerHTML =
            "<p>Unable to load clothing products. Please try again later.</p>";

        containerAccessories.innerHTML =
            "<p>Unable to load accessories. Please try again later.</p>";
    }
}

// This function is called after content.html is loaded.
loadProducts();
