import swal from '../global/sweet-alert';

const products = {
    lineItems: [
        {
            quantity: 1,
            productId: 111,
            option_selections: [
                {
                    option_id: 117,
                    option_value: 108,
                },
            ],
        },
        {
            quantity: 1,
            productId: 107,
        },
        {
            quantity: 1,
            productId: 104,
        },
    ],
};

export default function () {
    const addProductsBtn = $('#add-products-btn');
    const originalMessage = addProductsBtn.text();
    const waitMessage = addProductsBtn.data('waitMessage');

    addProductsBtn.on('click', async (event) => {
        event.preventDefault();

        addProductsBtn.text(waitMessage).prop('disabled', true);

        // check if a cart already exist
        const cartId = await isCartExist();
        if (cartId) {
            // if yes add the products to the current cart
            const isProductsAdded = await addProductsToCart(cartId, products);

            if (!isProductsAdded) {
                failureMessage();
            } else {
                successMessage();
                updateCartQuantity();
            }
        } else {
            //if false create new cart && add the products to it
            const isCartCreated = await createCart(
                `/api/storefront/carts`,
                products
            );
            if (!isCartCreated) {
                failureMessage();
            } else {
                successMessage();
                updateCartQuantity();
            }
        }

        addProductsBtn.text(originalMessage).prop('disabled', false);
    });
}

/**
 * Display a success message
 */
function successMessage() {
    swal.fire({
        text: `${products.lineItems.length} items were added to your cart`,
        icon: 'success',
    });
}

/**
 * Display an error message
 */
function failureMessage() {
    swal.fire({
        text: `Failed to add new products, please try again later!`,
        icon: 'error',
    });
}

/**
 * Update Cart quantity
 */
function updateCartQuantity() {
    // Update cart counter
    const body = $('body');
    const existQty = parseInt($('.cart-quantity').text());
    const newQty = existQty + products.lineItems.length;

    body.trigger('cart-quantity-update', newQty);
}

/**
 * Add products to Cart
 * @param  {String} cartId
 * @param  {Object} products
 */
function addProductsToCart(cartId, products) {
    return addCartItem(`/api/storefront/carts/`, cartId, products)
        .then((data) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}

/**
 * Return Cart ID if a cart already exist
 * Return false if there's no existing Cart
 */
function isCartExist() {
    return getCart('/api/storefront/carts')
        .then((data) => {
            return data.length <= 0 ? false : data[0].id;
        })
        .catch((error) => {
            return false;
        });
}

/**
 * Create a cart
 * @param {String} url
 * @param {Object} cartItems
 */
function createCart(url, cartItems) {
    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems),
    })
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}

/**
 * Get a cart
 * @param {String} url
 */
function getCart(url) {
    return fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
    })
        .then((response) => response.json())
        .catch((error) => {
            error;
        });
}

/**
 * Add a cart
 * @param {String} url
 * @param {String} cartId
 * @param {Object} cartItems
 */
function addCartItem(url, cartId, cartItems) {
    return fetch(url + cartId + '/items', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems),
    })
        .then((response) => response.json())
        .catch((error) => {
            error;
        });
}
