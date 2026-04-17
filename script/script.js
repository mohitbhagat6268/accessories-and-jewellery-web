function addToWishlist(name, price, image) {
    // Get existing wishlist
    let wishlist = JSON.parse(localStorage.getItem('userWishlist')) || [];
    
    // Add new item object
    wishlist.push({ name, price, image });
    
    // Save back to Local Storage
    localStorage.setItem('userWishlist', JSON.stringify(wishlist));
    
    alert("Added to wishlist!");
}