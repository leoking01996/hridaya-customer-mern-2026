import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";


const app = express();
const PORT = process.env.PORT || 5000;


// =========================
// Fix __dirname for ES Module
// =========================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// =========================
// CORS ALLOW ALL
// =========================

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);


// IMPORTANT FOR PREFLIGHT
app.options("*", cors());


// =========================
// Body Parser
// =========================

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true
  })
);


// =========================
// Logger
// =========================

app.use((req,res,next)=>{

  console.log(
    "REQUEST:",
    req.method,
    req.originalUrl
  );

  console.log(
    "ORIGIN:",
    req.headers.origin
  );

  next();

});


// =========================
// Upload Folder
// =========================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname,"uploads")
  )
);


// =========================
// Routes
// =========================

app.use(
  "/api/auth",
  authRoutes
);


// Health Check

app.get("/",(req,res)=>{

 res.json({
    success:true,
    message:"Hridaya Customer Backend Running 🚀"
 });

});


// =========================
// MongoDB
// =========================

mongoose
.connect(process.env.MONGO_URI)
.then(()=>{

 console.log("MongoDB Connected");

 app.listen(PORT,()=>{

   console.log(
     `Server running on ${PORT}`
   );

 });

})
.catch(err=>{

 console.log(
   "Mongo Error:",
   err.message
 );

});