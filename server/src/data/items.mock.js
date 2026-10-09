// Mock data for Inventory Management System
let mockItems = [
  {
    id: "itm-001",
    code: "EQP-PROJ-01",
    name: "Epson LCD Projector",
    category: "Equipment",
    quantity: 5,
    unit: "pcs",
    status: "Available",
    location: "AVR Storage Room",
    allocatedTo: "Library", // example: shared data in other module
    lastUpdated: "2026-10-01T08:30:00Z"
  },
  {
    id: "itm-002",
    code: "SUP-PAPER-A4",
    name: "A4 Copy Paper Bondpaper (Ream)",
    category: "Supplies",
    quantity: 42,
    unit: "reams",
    status: "Available",
    location: "Supply Office Cabinet A",
    allocatedTo: "Faculty",
    lastUpdated: "2026-10-05T10:15:00Z"
  },
  {
    id: "itm-003",
    code: "AST-LAPTOP-08",
    name: "Dell Latitude 3420 Laptop",
    category: "Assets",
    quantity: 1,
    unit: "unit",
    status: "In Use",
    location: "IT Department",
    allocatedTo: "Finance",
    lastUpdated: "2026-09-28T14:00:00Z"
  }
];

module.exports = mockItems;