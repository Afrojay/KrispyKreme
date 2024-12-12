# Krispy Kreme App

A simple web application to simulate a Krispy Kreme storefront. This project allows customers to browse products, add items to their cart, and place orders. It also includes a manager dashboard for managing orders.

## Features

- **Customer Dashboard**: Displays available products with images, prices, and an "Add to Cart" button.
- **Cart View**: Shows the items added to the cart with the ability to proceed to checkout.
- **Checkout**: Completes the order process by saving the order details to a MongoDB database.
- **Manager Dashboard**: Accessible for manager accounts to review orders.
- **Login and Register**: User authentication for both customers and managers.
- **Responsive Design**: Built with Material-UI (MUI) for modern and responsive UI components.

## Technology Stack

- **Frontend**: React.js with Next.js framework
- **Styling**: Material-UI (MUI)
- **Backend**: Next.js API routes
- **Database**: MongoDB Atlas (Cloud-hosted database)

## Deployment

The application is deployed using Vercel. Below are the deployment links:

- **Main Application**: [Krispy Kreme App on Vercel](https://krispy-kreme-smoky.vercel.app)
- **Customer Dashboard**: [Customer Dashboard](https://krispy-kreme-smoky.vercel.app/small-app)
- **Manager Dashboard**: Accessible after logging in with a manager account.

## Getting Started

### Prerequisites

- Node.js (v18 or above)
- npm (v10 or above)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Afrojay/KrispyKreme.git
   cd KrispyKreme

2. Install dependencies:
    npm install

3. Create a .env file in the root of the project and add the following:
    DB_ADDRESS=mongodb+srv://admin:pass@cluster0.wg2ou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


4. Run the development server:
    npm run dev

5. Open the application in your browser at http://localhost:3000.

 #### How to Use

1. Register: Create an account (customer or manager).
2. Login: Log in with your credentials.
3. Browse Products: Explore the available products on the dashboard.
4. Add to Cart: Add items to your cart.
5. Checkout: Proceed to checkout and place your order.
6. Manager Dashboard: Use a manager account to view all orders.

##### Known Issues and Troubleshooting
404 Error on Vercel: If the deployed app returns a 404 error for specific routes, ensure the paths in your Next.js application are correct and align with the deployed structure.
Database Connection: Ensure your .env file has the correct MongoDB Atlas connection string.