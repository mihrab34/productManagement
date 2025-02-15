# Product Management System

A React TypeScript application for managing product inventory with different product types and attributes.

## Features

- Add, edit, and delete products
- Support for different product types (DVD, Book, Furniture)
- Type-specific attribute management
- Image upload functionality
- Local storage persistence
- Pagination for product listing
- Mass delete functionality

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Context API for state management

## Project Structure

```
benchmarkProject/
├── src/
│   ├── components/
│   │   ├── ProductForm.tsx
│   │   └── ProductLists.tsx
│   ├── context/
│   │   └── productContext.tsx
│   ├── types/
│   │   └── Product.ts
│   ├── hooks/
│   │   └── useProduct.ts
│   └── App.tsx
├── public/
└── package.json
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
cd benchmarkProject
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

### Adding a Product

1. Click the "ADD" button
2. Fill in the required fields:
   - SKU (unique identifier)
   - Name
   - Price
   - Product Type (DVD, Book, or Furniture)
   - Type-specific attributes
3. Upload a product image
4. Click "Save" to add the product

### Editing a Product

1. Select a product using the checkbox
2. Click the "EDIT" button
3. Modify the desired fields
4. Click "Save" to update the product

### Deleting Products

1. Select one or more products using the checkboxes
2. Click "MASS DELETE" to remove selected products

## Type-Specific Attributes

- DVD: Size (MB)
- Book: Weight (kg)
- Furniture: Dimensions (Height x Width x Length in cm)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.