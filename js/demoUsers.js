export const demoUsers = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  firstName: "User",
  lastName: i + 1,
  email: `user${i+1}@demo.com`,
  phone: "000000",
  city: "Demo City",
  image: `https://i.pravatar.cc/300?img=${i+1}`
}));
