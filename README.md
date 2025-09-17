# CleanTrade Project Hub 🌿
Welcome to the official repository for CleanTrade! This project is all about creating a seamless B2B connection between dedicated farmers and corporations, ensuring fresh produce gets where it needs to go, efficiently and transparently.

## 🚀 Project Overview
CleanTrade is a web platform designed to bridge the gap in the global supply chain. The idea is simple: give businesses direct access to wholesale farm produce and give farmers a reliable platform to reach a larger market.

This repository contains the initial build of the website, which includes a landing page, a product marketplace, and a fully functional quote request system. It's built with the fundamentals: HTML, CSS, and plain old vanilla JavaScript.

## 🛠️ Current Architecture (The "Static" Approach)
Right now, the website operates as a "static" site. Think of it like a highly interactive digital brochure.

Frontend: The entire user experience is built with HTML, CSS, and JavaScript. All the pages are pre-built and sent to the user's browser as-is.

Data Source: Product and farm information is stored in a farms.json file that's bundled with the site. To update a product, we have to edit this file and redeploy.

"Backend" Logic: For handling quote requests, we're using EmailJS. It cleverly takes the form data and sends a formatted email directly to us, acting as a simple, serverless way to handle user submissions.

It’s a lean, fast, and incredibly simple setup to get us off the ground!

## 🔮 Future Architecture (The "Dynamic" Approach)
The plan is to evolve this project into a full-fledged, dynamic web application. This means building a proper backend to act as the "brain" of the operation.

Frontend: The frontend can remain as it is or be upgraded to a modern framework like React or Vue for even more complex user interfaces.

Backend Server: We'll build a server using Node.js and the Express.js framework. This server will handle all the heavy lifting: user logins, order processing, and managing data.

Database: A robust database, likely PostgreSQL, will replace the farms.json file. This is where we'll store all information about users, products, inventory, and orders in a structured way.

API: The frontend and backend will communicate through a REST API. The frontend will ask the API for product data, and the API will send it back. When a user places an order, the frontend will send the details to the API, which will securely process it and save it to the database.

## ✨ Future Scope
Building a backend will unlock a ton of powerful features. Here’s a glimpse of what’s next for CleanTrade:

Farmer & Buyer Portals: Secure login areas for farmers to manage their product listings and for buyers to view their order history.

Real-Time Inventory Management: Farmers can update their stock levels, and the site will show what’s available in real-time.

Order Management Dashboard: An internal dashboard for us to track all incoming orders, manage their status (e.g., pending, shipped, delivered), and view customer details.

Payment Gateway Integration: Direct integration with services like Stripe or PayPal to handle secure online payments.

Analytics & Reporting: A system to track sales, popular products, and other key business metrics.

## 🔑 Project Deliverables & Accounts
Here are the key accounts and services used for this project. They are all linked to a central Google account for easy management.

Google Mail: cleantradeplt@gmail.com

GitHub Repository: Managed via the associated Google account.

EmailJS Service: cleantradeplt@gmail.com.

Netlify Hosting: Managed via the associated Google account.
