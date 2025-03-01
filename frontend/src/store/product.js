import { create } from "zustand";

export const useProductStore = create((set) => ({
	products: [],
	setProducts: (products) => set({ products }),

	createProduct: async (newProduct) => {
		if (!newProduct.name || !newProduct.image || !newProduct.price) {
			return { success: false, message: "Please fill in all fields." };
		}
		try {
			const res = await fetch("/api/products", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newProduct),
			});

			if (!res.ok) {
				const errorData = await res.json();
				return { success: false, message: errorData.message || "Failed to add product" };
			}

			const data = await res.json();
			set((state) => ({ products: [...state.products, data.data] }));
			return { success: true, message: "Product created successfully" };
		} catch (error) {
			console.error("Create Product Error:", error);
			return { success: false, message: "Network error" };
		}
	},

	fetchProducts: async () => {
		try {
			const res = await fetch("/api/products");
			if (!res.ok) {
				throw new Error("Failed to fetch products");
			}
			const data = await res.json();
			set({ products: data.data });
		} catch (error) {
			console.error("Fetch Products Error:", error);
		}
	},

	deleteProduct: async (pid) => {
		try {
			const res = await fetch(`/api/products/${pid}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!data.success) return { success: false, message: data.message };

			// update the UI immediately, without needing a refresh
			set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
			return { success: true, message: data.message };
		} catch (error) {
			console.error("Delete Product Error:", error);
			return { success: false, message: "Network error" };
		}
	},

	updateProduct: async (pid, updatedProduct) => {
		try {
			const res = await fetch(`/api/products/${pid}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedProduct),
			});
			const data = await res.json();
			if (!data.success) return { success: false, message: data.message };

			// update the UI immediately, without needing a refresh
			set((state) => ({
				products: state.products.map((product) => (product._id === pid ? data.data : product)),
			}));

			return { success: true, message: data.message };
		} catch (error) {
			console.error("Update Product Error:", error);
			return { success: false, message: "Network error" };
		}
	},
}));
