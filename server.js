require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes"); // Import routes

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json()); // Parse JSON body
app.use(cors()); // Enable CORS for cross-origin requests

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {

  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// API Routes
app.use("/api", userRoutes); // Mount user routes at /api

// Default Route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// app.get("/", (req, res) => {
//   res.send(`
//     <html>
//       <body style="text-align:center;">
//         <h1>API is running...</h1>
//         <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXdkcnE0b25vc2p5NWlyeGVnYzY2OWhyNHY4bjB0ZWgydnJ0ZWtrZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yASFCj2K0MGeASqSom/giphy.gif" />
//       </body>
//     </html>
//   `);
// });

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
          }
          img {
            width: 200px; /* Adjust size */
            height: auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>API is running...</h1>
          <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXdkcnE0b25vc2p5NWlyeGVnYzY2OWhyNHY4bjB0ZWgydnJ0ZWtrZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yASFCj2K0MGeASqSom/giphy.gif" />
        </div>
      </body>
    </html>
  `);
});



// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
