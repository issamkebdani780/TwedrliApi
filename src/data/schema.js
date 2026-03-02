import { C } from "../constants";

export const SCHEMA = [ /* ...your existing SCHEMA array... */ ];

export const CONSTRAINTS = [
  { name: "users_chk_1",    clause: "role IN ('user', 'admin')" },
  { name: "users_chk_2",    clause: "department IN ('math', 'sm', 'info', 'st')" },
  { name: "products_chk_1", clause: "category IN ('Fashion', 'Electronics', 'Home & Living', 'Beauty', 'Sport', 'Books', 'Other')" },
  { name: "products_chk_2", clause: "status IN ('lost', 'found', 'claimed')" },
  { name: "products_chk_3", clause: "location IN ('info', 'sm', 'st', 'math')" },
];