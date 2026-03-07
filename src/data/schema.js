import { C } from "../constants";

export const SCHEMA = [
  {
    table: "users",
    color: "#60A5FA",
    fields: [
      { name: "id", type: "INT PK AI" },
      { name: "name", type: "VARCHAR(100)" },
      { name: "email", type: "VARCHAR(150) UNIQUE" },
      { name: "password", type: "VARCHAR(255)" },
      { name: "role", type: "VARCHAR(10) DEFAULT 'user'" },
      { name: "department", type: "TEXT NULL" },
      { name: "img_url", type: "TEXT NULL" },
      { name: "created_at", type: "TIMESTAMP DEFAULT NOW()" },
    ],
  },
  {
    table: "products",
    color: "#34D399",
    fields: [
      { name: "id", type: "INT PK AI" },
      { name: "title", type: "VARCHAR(150)" },
      { name: "description", type: "TEXT" },
      { name: "category", type: "VARCHAR(20)" },
      { name: "status", type: "VARCHAR(10) DEFAULT 'lost'" },
      { name: "location", type: "TEXT NULL" },
      { name: "date", type: "TIMESTAMP DEFAULT NOW()" },
      { name: "user_id", type: "INT FK (users)" },
      { name: "found_by", type: "INT FK (users) NULL" },
      { name: "img_url", type: "TEXT NULL" },
      { name: "color", type: "VARCHAR(50) NULL" },
    ],
  },
  {
    table: "posts",
    color: "#F87171",
    fields: [
      { name: "id", type: "INT PK AI" },
      { name: "user_id", type: "INT FK (users)" },
      { name: "product_id", type: "INT FK (products)" },
      { name: "title", type: "VARCHAR(150)" },
      { name: "description", type: "TEXT" },
      { name: "created_at", type: "TIMESTAMP DEFAULT NOW()" },
    ],
  },
  {
    table: "badges",
    color: "#A78BFA",
    fields: [
      { name: "id", type: "INT PK AI" },
      { name: "user_id", type: "INT FK (users)" },
      ...Array.from({ length: 29 }, (_, i) => ({
        name: `b${i + 1}`,
        type: "BOOL DEFAULT FALSE",
      })),
    ],
  }
];

export const CONSTRAINTS = [];
