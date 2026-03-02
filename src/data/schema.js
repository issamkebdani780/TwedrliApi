import { C } from "../constants";

export const SCHEMA = [
  {
    table: "users",
    color: "#60A5FA", // Blue-ish
    fields: [
      { name: "id", type: "INT PK AI" },
      { name: "name", type: "VARCHAR(100)" },
      { name: "email", type: "VARCHAR(150) UNIQUE" },
      { name: "password", type: "VARCHAR(255)" },
      { name: "role", type: "VARCHAR(10) DEFAULT 'user'" },
      { name: "department", type: "VARCHAR(10)" },
      { name: "created_at", type: "TIMESTAMP DEFAULT NOW()" },
    ],
  },
  {
    table: "products",
    color: "#34D399", // Green-ish
    fields: [
      { name: "id", type: "INT PK AI" },
      { name: "title", type: "VARCHAR(150)" },
      { name: "description", type: "TEXT" },
      { name: "category", type: "VARCHAR(20)" },
      { name: "status", type: "VARCHAR(10) DEFAULT 'lost'" },
      { name: "location", type: "VARCHAR(10)" },
      { name: "date", type: "TIMESTAMP DEFAULT NOW()" },
      { name: "user_id", type: "INT FK (users)" },
      { name: "found_by", type: "INT FK (users) NULL" },
    ],
  },
  {
    table: "posts",
    color: "#F87171", // Red-ish
    fields: [
      { name: "id", type: "INT PK AI" },
      { name: "user_id", type: "INT FK (users)" },
      { name: "product_id", type: "INT FK (products)" },
      { name: "title", type: "VARCHAR(150)" },
      { name: "description", type: "TEXT" },
      { name: "created_at", type: "TIMESTAMP DEFAULT NOW()" },
    ],
  },
];

export const CONSTRAINTS = [
  { name: "users_chk_1",    clause: "role IN ('user', 'admin')" },
  { name: "users_chk_2",    clause: "department IN ('math', 'sm', 'info', 'st')" },
  { name: "products_chk_1", clause: "category IN ('Fashion', 'Electronics', 'Home & Living', 'Beauty', 'Sport', 'Books', 'Other')" },
  { name: "products_chk_2", clause: "status IN ('lost', 'found', 'claimed')" },
  { name: "products_chk_3", clause: "location IN ('info', 'sm', 'st', 'math')" },
];