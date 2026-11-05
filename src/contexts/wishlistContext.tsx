import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface WishlistItem {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  tags: string[];
  price: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "tripvisito_wishlist";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse wishlist from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist]);

  const isWishlisted = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const toggleWishlist = (item: WishlistItem) => {
    if (isWishlisted(item.id)) {
      setWishlist((prev) => prev.filter((t) => t.id !== item.id));
      toast("Removed from your Saved Trips", { icon: "💔" });
    } else {
      setWishlist((prev) => [item, ...prev]);
      toast.success("Saved to your Wishlist! ❤️");
    }
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((t) => t.id !== id));
    toast("Removed from your Saved Trips", { icon: "💔" });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, isWishlisted, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
