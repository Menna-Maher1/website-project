
const STORE_WHATSAPP = "201000000000";

// Replace this number with your store's WhatsApp number.
// Use Egypt's international format: 20 followed by the number
// without the leading zero.

const products = [
  {
    id: 1,
    name: "The Soft Blazer",
    category: "Outerwear",
    price: 1250,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=85",
    colors: ["Beige", "Black", "Brown"],
    sizes: ["S", "M", "L", "XL"],
    description: "An effortlessly polished blazer designed to elevate your everyday look."
  },
  {
    id: 2,
    name: "Sunday Dress",
    category: "Dresses",
    price: 1450,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85",
    colors: ["Pink", "Cream", "Black"],
    sizes: ["S", "M", "L"],
    description: "A feminine silhouette made for slow mornings and special evenings."
  },
  {
    id: 3,
    name: "Everyday Knit",
    category: "Tops",
    price: 650,
    tag: "ESSENTIAL",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85",
    colors: ["White", "Beige", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    description: "Your new favourite everyday layer, soft and easy to style."
  },
  {
    id: 4,
    name: "Classic Trousers",
    category: "Bottoms",
    price: 850,
    tag: "",
    image: "https://images.unsplash.com/photo-1506629905607-d9c297d8a7b7?auto=format&fit=crop&w=700&q=85",
    colors: ["Black", "Beige", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    description: "A timeless pair of trousers with an easy, flattering fit."
  },
  {
    id: 5,
    name: "Rose Blouse",
    category: "Tops",
    price: 720,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1564257577-4d4d7b3a6a2a?auto=format&fit=crop&w=700&q=85",
    colors: ["Pink", "White", "Blue"],
    sizes: ["S", "M", "L"],
    description: "A delicate blouse that adds a soft touch to any outfit."
  },
  {
    id: 6,
    name: "Weekend Coat",
    category: "Outerwear",
    price: 1850,
    tag: "",
    image: "https://images.unsplash.com/photo-1548624149-f9b185ac6a9c?auto=format&fit=crop&w=700&q=85",
    colors: ["Camel", "Black"],
    sizes: ["S", "M", "L"],
    description: "A versatile outer layer for days that call for effortless elegance."
  },
  {
    id: 7,
    name: "The Midi Moment",
    category: "Dresses",
    price: 1150,
    tag: "POPULAR",
    image: "",
    colors: ["Cream", "Pink", "Black"],
    sizes: ["S", "M", "L"],
    description: "An easy midi dress made for movement and memorable moments."
  },
  {
    id: 8,
    name: "Relaxed Denim",
    category: "Bottoms",
    price: 950,
    tag: "",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=85",
    colors: ["Blue", "Black"],
    sizes: ["S", "M", "L", "XL"],
    description: "A relaxed denim staple that goes with almost everything."
  }
];

let cart = JSON.parse(localStorage.getItem("laveCart")) || [];

let currentProduct = null;
let selectedSize = "";
let selectedColor = "";
let selectedQuantity = 1;
let activeCategory = "All";

const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartSummary = document.getElementById("cartSummary");
const toast = document.getElementById("toast");

function formatPrice(price) {
  return "EGP " + price.toLocaleString("en-EG");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Display products

function renderProducts() {
  const searchValue = document.getElementById("searchInput").value
    .trim()
    .toLowerCase();

  let filtered = products.filter(product => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchValue) ||
      product.category.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });

  const sortValue = document.getElementById("sortSelect").value;

  if (sortValue === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (!filtered.length) {
    productGrid.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;padding:40px;color:#8d817d">
        No pieces found. Try another search.
      </p>
    `;
    return;
  }

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">

      <div class="product-image-wrap">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

        ${product.tag
          ? `<span class="product-tag">${product.tag}</span>`
          : ""}

        <button class="quick-add" data-product="${product.id}">
          VIEW DETAILS +
        </button>
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.category}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
      </div>

    </article>
  `).join("");
}

// Category filters

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    activeCategory = button.dataset.category;

    renderProducts();
  });
});

// Sorting and search

document.getElementById("sortSelect")
  .addEventListener("change", renderProducts);

document.getElementById("searchInput")
  .addEventListener("input", renderProducts);

document.getElementById("searchToggle")
  .addEventListener("click", () => {
    document.getElementById("searchPanel").classList.toggle("hidden");

    if (!document.getElementById("searchPanel").classList.contains("hidden")) {
      document.getElementById("searchInput").focus();
    }
  });

document.getElementById("closeSearch")
  .addEventListener("click", () => {
    document.getElementById("searchPanel").classList.add("hidden");
    document.getElementById("searchInput").value = "";
    renderProducts();
  });

// Product details

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-product]");

  if (!button) return;

  const id = Number(button.dataset.product);
  openProduct(id);
});

function openProduct(id) {
  currentProduct = products.find(product => product.id === id);

  selectedSize = currentProduct.sizes[0];
  selectedColor = currentProduct.colors[0];
  selectedQuantity = 1;

  const modal = document.getElementById("productModal");

  modal.classList.add("open");
  overlay.classList.add("show");

  renderProductDetails();
}

function renderProductDetails() {
  const product = currentProduct;

  document.getElementById("productModalContent").innerHTML = `
    <img src="${product.image}" alt="${product.name}">

    <div class="modal-details">

      <p class="eyebrow">${product.category}</p>

      <h2>${product.name}</h2>

      <p class="price">${formatPrice(product.price)}</p>

      <p>${product.description}</p>

      <span class="option-label">Choose your size</span>

      <div class="option-group">
        ${product.sizes.map(size => `
          <button
            class="option-btn ${size === selectedSize ? "selected" : ""}"
            data-size="${size}">
            ${size}
          </button>
        `).join("")}
      </div>

      <span class="option-label">Choose your color</span>

      <div class="option-group">
        ${product.colors.map(color => `
          <button
            class="option-btn ${color === selectedColor ? "selected" : ""}"
            data-color="${color}">
            ${color}
          </button>
        `).join("")}
      </div>

      <span class="option-label">Quantity</span>

      <div class="quantity-control">
        <button id="quantityMinus">−</button>
        <span>${selectedQuantity}</span>
        <button id="quantityPlus">+</button>
      </div>

      <button class="button button-dark full" id="addToCart">
        Add to bag — ${formatPrice(product.price * selectedQuantity)}
      </button>

    </div>
  `;

  const content = document.getElementById("productModalContent");

  content.querySelectorAll("[data-size]").forEach(button => {
    button.addEventListener("click", () => {
      selectedSize = button.dataset.size;
      renderProductDetails();
    });
  });

  content.querySelectorAll("[data-color]").forEach(button => {
    button.addEventListener("click", () => {
      selectedColor = button.dataset.color;
      renderProductDetails();
    });
  });

  document.getElementById("quantityMinus")
    .addEventListener("click", () => {
      selectedQuantity = Math.max(1, selectedQuantity - 1);
      renderProductDetails();
    });

  document.getElementById("quantityPlus")
    .addEventListener("click", () => {
      selectedQuantity = Math.min(10, selectedQuantity + 1);
      renderProductDetails();
    });

  document.getElementById("addToCart")
    .addEventListener("click", addToCart);
}

document.getElementById("closeProduct")
  .addEventListener("click", closeProduct);

function closeProduct() {
  document.getElementById("productModal").classList.remove("open");

  if (!cartDrawer.classList.contains("open") &&
      !document.getElementById("checkoutModal").classList.contains("open")) {
    overlay.classList.remove("show");
  }
}

// Shopping cart

function saveCart() {
  localStorage.setItem("laveCart", JSON.stringify(cart));
  renderCart();
}

function addToCart() {
  const existing = cart.find(item =>
    item.id === currentProduct.id &&
    item.size === selectedSize &&
    item.color === selectedColor
  );

  if (existing) {
    existing.quantity += selectedQuantity;
  } else {
    cart.push({
      id: currentProduct.id,
      size: selectedSize,
      color: selectedColor,
      quantity: selectedQuantity
    });
  }

  saveCart();

  closeProduct();
  showToast("Lovely choice! Added to your bag ♡");

  openCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("cartCount").textContent = totalItems;
  document.getElementById("drawerCount").textContent = `(${totalItems})`;

  if (cart.length === 0) {
    cartItems.innerHTML = "";
    cartEmpty.style.display = "flex";
    cartSummary.style.display = "none";
    return;
  }

  cartEmpty.style.display = "none";
  cartSummary.style.display = "block";

  cartItems.innerHTML = cart.map((item, index) => {
    const product = products.find(p => p.id === item.id);

    return `
      <div class="cart-item">

        <img src="${product.image}" alt="${product.name}">

        <div>
          <h4>${product.name}</h4>

          <p>Size: ${item.size} · Color: ${item.color}</p>

          <strong>${formatPrice(product.price * item.quantity)}</strong>

          <div class="cart-controls">
            <button data-action="minus" data-index="${index}">−</button>

            <span>${item.quantity}</span>

            <button data-action="plus" data-index="${index}">+</button>

            <button class="remove"
              data-action="remove"
              data-index="${index}">
              Remove
            </button>
          </div>

        </div>
      </div>
    `;
  }).join("");

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  document.getElementById("cartSubtotal").textContent =
    formatPrice(subtotal);
}

cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const index = Number(button.dataset.index);
  const action = button.dataset.action;

  if (action === "plus") {
    cart[index].quantity = Math.min(10, cart[index].quantity + 1);
  }

  if (action === "minus") {
    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }

  if (action === "remove") {
    cart.splice(index, 1);
  }

  saveCart();
});

// Open and close cart

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
}

function closeCart() {
  cartDrawer.classList.remove("open");

  if (!document.getElementById("productModal").classList.contains("open") &&
      !document.getElementById("checkoutModal").classList.contains("open")) {
    overlay.classList.remove("show");
  }
}

document.getElementById("openCart")
  .addEventListener("click", openCart);

document.getElementById("closeCart")
  .addEventListener("click", closeCart);

document.getElementById("continueShopping")
  .addEventListener("click", () => {
    closeCart();
    document.getElementById("shop").scrollIntoView();
  });

// Checkout

document.getElementById("goCheckout")
  .addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Your bag is empty.");
      return;
    }

    const total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + product.price * item.quantity;
    }, 0);

    document.getElementById("checkoutTotal").textContent =
      formatPrice(total);

    closeCart();

    document.getElementById("checkoutModal").classList.add("open");
    overlay.classList.add("show");
  });

document.getElementById("closeCheckout")
  .addEventListener("click", () => {
    document.getElementById("checkoutModal").classList.remove("open");
    overlay.classList.remove("show");
  });

document.getElementById("checkoutForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
      showToast("Your bag is empty.");
      return;
    }

    if (STORE_WHATSAPP === "201000000000") {
      showToast("Please add your store WhatsApp number in app.js");
      return;
    }

    const formData = new FormData(event.target);

    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const payment = formData.get("payment");
    const notes = formData.get("notes");

    let message = `Hello LAVÉ Studio! I would like to place an order.\n\n`;

    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Address: ${address}\n`;
    message += `Payment: ${payment}\n\n`;

    message += `ORDER DETAILS:\n`;

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);

      message += `\n- ${product.name}`;
      message += ` | Size: ${item.size}`;
      message += ` | Color: ${item.color}`;
      message += ` | Quantity: ${item.quantity}`;
      message += ` | Price: ${formatPrice(product.price * item.quantity)}\n`;
    });

    const total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + product.price * item.quantity;
    }, 0);

    message += `\nTOTAL: ${formatPrice(total)}`;
    message += `\n\nNotes: ${notes || "None"}`;

    const whatsappURL =
      `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");

    document.getElementById("checkoutModal").classList.remove("open");
    overlay.classList.remove("show");

    showToast("Your WhatsApp order is ready!");

    // The cart is intentionally retained until the store confirms the order.
  });

// Newsletter demo

document.getElementById("newsletterForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("newsletterEmail").value;

    document.getElementById("newsletterMessage").textContent =
      "Thank you! Newsletter connection is a demo for now.";

    event.target.reset();
  });

// Mobile navigation

document.getElementById("menuToggle")
  .addEventListener("click", () => {
    document.getElementById("mainNav").classList.toggle("show");
  });

document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("mainNav").classList.remove("show");
  });
});

// Overlay

overlay.addEventListener("click", () => {
  closeCart();
  closeProduct();

  document.getElementById("checkoutModal").classList.remove("open");
  overlay.classList.remove("show");
});

// Start the store

renderProducts();
renderCart();
