# Fix Cart Remove Button 404

## Steps:
- [x] 1. Edit resources/js/Pages/Store/Cart.jsx: Change product.id to product.slug in updateQuantity and removeItem router calls
- [ ] 2. (Optional) Update CartController.php store method to use Product model binding
- [x] 3. Rebuild frontend: npm run dev  
- [x] 4. Test: ProductDetails → Add to Cart → Cart → Remove item (no 404)

**Additional Feedback:** UI improvements to cart buttons/alignment
- [x] 6. Update Cart.jsx: Move "Continue Shopping" button under "Proceed to Checkout", fix alignment (added margin-top: 12px)
- [x] 7. Update CSS if needed (not required - inline style used)
- [x] 8. Rebuild & complete

