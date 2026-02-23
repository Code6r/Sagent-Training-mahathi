import { Product, Order, OrderStatus, CartItem } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  // FRUITS
  {
    id: 1,
    name: "Fresh Organic Apples",
    description: "Crisp, sweet organic apples sourced from local farms. Perfect for snacking or baking.",
    price: 299,
    originalPrice: 399,
    imageUrl: "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fruits",
    inStock: true,
    rating: 4.8
  },
  {
    id: 2,
    name: "Premium Bananas",
    description: "Ripe, yellow bananas packed with potassium. Imported from Ecuador.",
    price: 89,
    originalPrice: 120,
    imageUrl: "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fruits",
    inStock: true,
    rating: 4.6
  },
  {
    id: 9,
    name: "Fresh Strawberries",
    description: "Sweet, juicy red strawberries. Perfect for desserts, smoothies, or fresh snacking.",
    price: 349,
    originalPrice: 449,
    imageUrl: "https://images.pexels.com/photos/1300973/pexels-photo-1300973.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fruits",
    inStock: true,
    rating: 4.8
  },
  {
    id: 13,
    name: "Sweet Oranges",
    description: "Juicy, vitamin C-rich oranges. Freshly picked and bursting with flavor.",
    price: 199,
    imageUrl: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fruits",
    inStock: true,
    rating: 4.7
  },
  {
    id: 14,
    name: "Red Grapes",
    description: "Sweet, seedless red grapes. Perfect for snacking or wine-making.",
    price: 299,
    originalPrice: 379,
    imageUrl: "https://images.pexels.com/photos/1300970/pexels-photo-1300970.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fruits",
    inStock: true,
    rating: 4.6
  },
  {
    id: 15,
    name: "Fresh Mangoes",
    description: "Sweet, tropical mangoes. Imported from India. The king of fruits!",
    price: 249,
    imageUrl: "https://images.pexels.com/photos/1300971/pexels-photo-1300971.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fruits",
    inStock: true,
    rating: 4.9
  },
  {
    id: 16,
    name: "Blueberries",
    description: "Antioxidant-rich blueberries. Perfect for breakfast bowls and smoothies.",
    price: 399,
    imageUrl: "https://images.pexels.com/photos/1300977/pexels-photo-1300977.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fruits",
    inStock: true,
    rating: 4.8
  },
  {
    id: 17,
    name: "Fresh Pineapple",
    description: "Sweet, tropical pineapple. Pre-cut and ready to eat.",
    price: 179,
    imageUrl: "https://images.pexels.com/photos/1300978/pexels-photo-1300978.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fruits",
    inStock: true,
    rating: 4.7
  },
  {
    id: 18,
    name: "Kiwi Fruits",
    description: "Tangy, vitamin-packed kiwi fruits. Green and golden varieties available.",
    price: 249,
    imageUrl: "https://images.pexels.com/photos/1300979/pexels-photo-1300979.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fruits",
    inStock: true,
    rating: 4.6
  },
  {
    id: 19,
    name: "Watermelon",
    description: "Juicy, refreshing watermelon. Perfect for summer. Pre-cut slices available.",
    price: 149,
    imageUrl: "https://images.pexels.com/photos/1300980/pexels-photo-1300980.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fruits",
    inStock: true,
    rating: 4.7
  },
  
  // VEGETABLES
  {
    id: 3,
    name: "Fresh Carrots",
    description: "Crunchy orange carrots, rich in beta-carotene. Farm-fresh and organic.",
    price: 149,
    imageUrl: "https://images.pexels.com/photos/1300975/pexels-photo-1300975.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Vegetables",
    inStock: true,
    rating: 4.7
  },
  {
    id: 4,
    name: "Organic Spinach",
    description: "Fresh leafy spinach, perfect for salads and smoothies. Packed with iron.",
    price: 199,
    imageUrl: "https://images.pexels.com/photos/1300976/pexels-photo-1300976.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Vegetables",
    inStock: true,
    rating: 4.5
  },
  {
    id: 10,
    name: "Fresh Broccoli",
    description: "Fresh green broccoli, rich in vitamins and fiber.",
    price: 179,
    imageUrl: "https://images.pexels.com/photos/1300974/pexels-photo-1300974.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Vegetables",
    inStock: true,
    rating: 4.6
  },
  {
    id: 20,
    name: "Tomatoes",
    description: "Ripe, red tomatoes. Perfect for salads, sauces, and cooking.",
    price: 129,
    imageUrl: "https://images.pexels.com/photos/1300981/pexels-photo-1300981.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Vegetables",
    inStock: true,
    rating: 4.7
  },
  {
    id: 21,
    name: "Bell Peppers",
    description: "Colorful bell peppers - red, yellow, and green. Great for stir-fries.",
    price: 199,
    imageUrl: "https://images.pexels.com/photos/1300982/pexels-photo-1300982.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Vegetables",
    inStock: true,
    rating: 4.6
  },
  {
    id: 22,
    name: "Cucumber",
    description: "Crisp, refreshing cucumbers. Perfect for salads and snacking.",
    price: 89,
    imageUrl: "https://images.pexels.com/photos/1300983/pexels-photo-1300983.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Vegetables",
    inStock: true,
    rating: 4.5
  },
  {
    id: 23,
    name: "Potatoes",
    description: "Fresh potatoes. Versatile and perfect for any meal.",
    price: 99,
    imageUrl: "https://images.pexels.com/photos/1300984/pexels-photo-1300984.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Vegetables",
    inStock: true,
    rating: 4.6
  },
  {
    id: 24,
    name: "Onions",
    description: "Fresh onions. Essential for cooking and flavoring dishes.",
    price: 119,
    imageUrl: "https://images.pexels.com/photos/1300985/pexels-photo-1300985.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Vegetables",
    inStock: true,
    rating: 4.5
  },
  {
    id: 25,
    name: "Lettuce",
    description: "Crisp, fresh lettuce. Perfect for salads and sandwiches.",
    price: 149,
    imageUrl: "https://images.pexels.com/photos/1300986/pexels-photo-1300986.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Vegetables",
    inStock: true,
    rating: 4.6
  },
  {
    id: 26,
    name: "Cauliflower",
    description: "Fresh white cauliflower. Great for roasting and curries.",
    price: 169,
    imageUrl: "https://images.pexels.com/photos/1300987/pexels-photo-1300987.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Vegetables",
    inStock: true,
    rating: 4.7
  },
  
  // DAIRY
  {
    id: 5,
    name: "Fresh Milk",
    description: "Pure, pasteurized whole milk. Delivered cold-chain protected.",
    price: 89,
    originalPrice: 110,
    imageUrl: "https://images.pexels.com/photos/416471/pexels-photo-416471.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Dairy",
    inStock: true,
    rating: 4.9
  },
  {
    id: 6,
    name: "Farm Fresh Eggs",
    description: "Free-range eggs from happy hens. Pack of 12.",
    price: 179,
    imageUrl: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Dairy",
    inStock: true,
    rating: 4.8
  },
  {
    id: 11,
    name: "Greek Yogurt",
    description: "Creamy Greek yogurt, high in protein. 500g tub.",
    price: 199,
    imageUrl: "https://images.pexels.com/photos/5945568/pexels-photo-5945568.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Dairy",
    inStock: true,
    rating: 4.7
  },
  {
    id: 27,
    name: "Butter",
    description: "Rich, creamy butter. Made from fresh cream. 250g pack.",
    price: 149,
    imageUrl: "https://images.pexels.com/photos/5947025/pexels-photo-5947025.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Dairy",
    inStock: true,
    rating: 4.8
  },
  {
    id: 28,
    name: "Cheese Block",
    description: "Premium cheddar cheese. Perfect for sandwiches and cooking.",
    price: 299,
    imageUrl: "https://images.pexels.com/photos/5947026/pexels-photo-5947026.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Dairy",
    inStock: true,
    rating: 4.7
  },
  {
    id: 29,
    name: "Cream",
    description: "Fresh heavy cream. Perfect for desserts and coffee.",
    price: 179,
    imageUrl: "https://images.pexels.com/photos/5947027/pexels-photo-5947027.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Dairy",
    inStock: true,
    rating: 4.6
  },
  {
    id: 30,
    name: "Cottage Cheese",
    description: "Fresh cottage cheese. High protein, low fat. 200g pack.",
    price: 129,
    imageUrl: "https://images.pexels.com/photos/5947028/pexels-photo-5947028.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Dairy",
    inStock: true,
    rating: 4.5
  },
  {
    id: 31,
    name: "Sour Cream",
    description: "Creamy sour cream. Perfect for dips and baked potatoes.",
    price: 159,
    imageUrl: "https://images.pexels.com/photos/5947029/pexels-photo-5947029.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Dairy",
    inStock: true,
    rating: 4.6
  },
  
  // BAKERY
  {
    id: 7,
    name: "Artisan Sourdough Bread",
    description: "Freshly baked sourdough with a crispy crust. Made daily.",
    price: 249,
    imageUrl: "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Bakery",
    inStock: true,
    rating: 4.9
  },
  {
    id: 8,
    name: "Croissants",
    description: "Buttery, flaky French croissants. Perfect for breakfast.",
    price: 199,
    originalPrice: 249,
    imageUrl: "https://images.pexels.com/photos/209201/pexels-photo-209201.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Bakery",
    inStock: true,
    rating: 4.7
  },
  {
    id: 12,
    name: "Whole Wheat Bread",
    description: "Healthy whole wheat bread, fiber-rich and nutritious.",
    price: 149,
    imageUrl: "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Bakery",
    inStock: true,
    rating: 4.5
  },
  {
    id: 32,
    name: "Chocolate Chip Cookies",
    description: "Freshly baked chocolate chip cookies. Soft and chewy.",
    price: 179,
    imageUrl: "https://images.pexels.com/photos/209201/pexels-photo-209201.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Bakery",
    inStock: true,
    rating: 4.8
  },
  {
    id: 33,
    name: "Bagels",
    description: "Fresh bagels - plain, sesame, or everything. Perfect for breakfast.",
    price: 199,
    imageUrl: "https://images.pexels.com/photos/2631687/pexels-photo-2631687.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Bakery",
    inStock: true,
    rating: 4.6
  },
  {
    id: 34,
    name: "Donuts",
    description: "Fresh glazed donuts. Available in various flavors.",
    price: 149,
    originalPrice: 199,
    imageUrl: "https://images.pexels.com/photos/2631687/pexels-photo-2631687.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Bakery",
    inStock: true,
    rating: 4.7
  },
  {
    id: 35,
    name: "Muffins",
    description: "Freshly baked muffins - blueberry, chocolate, or plain.",
    price: 169,
    imageUrl: "https://images.pexels.com/photos/2631687/pexels-photo-2631687.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Bakery",
    inStock: true,
    rating: 4.6
  },
  {
    id: 36,
    name: "Cinnamon Rolls",
    description: "Warm, gooey cinnamon rolls with cream cheese frosting.",
    price: 219,
    imageUrl: "https://images.pexels.com/photos/2631687/pexels-photo-2631687.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Bakery",
    inStock: true,
    rating: 4.9
  },
  {
    id: 37,
    name: "French Baguette",
    description: "Crispy French baguette. Perfect for sandwiches and dipping.",
    price: 129,
    imageUrl: "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Bakery",
    inStock: true,
    rating: 4.7
  },
  {
    id: 38,
    name: "Pita Bread",
    description: "Soft, fluffy pita bread. Great for wraps and dipping.",
    price: 119,
    imageUrl: "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Bakery",
    inStock: true,
    rating: 4.5
  },
  {
    id: 39,
    name: "Pizza Base",
    description: "Ready-to-use pizza base. Make your own pizza at home!",
    price: 99,
    imageUrl: "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Bakery",
    inStock: true,
    rating: 4.6
  }
];

let mockOrders: Order[] = [];
let orderIdCounter = 1000;

export const createMockOrder = (
  items: CartItem[],
  address: any,
  paymentMethod: string
): Order => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );
  
  // Apply ₹25 discount if order is above ₹200
  const discount = subtotal > 200 ? 25 : 0;
  const total = subtotal - discount;
  
  const order: Order = {
    id: orderIdCounter++,
    items,
    total,
    status: "PLACED",
    createdAt: new Date().toISOString(),
    address,
    paymentMethod: paymentMethod as any
  };
  
  mockOrders.push(order);
  return order;
};

export const getMockOrders = (): Order[] => {
  return [...mockOrders];
};

export const updateOrderStatus = (orderId: number, status: OrderStatus): Order | null => {
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    return order;
  }
  return null;
};
