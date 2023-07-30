const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


const pcComponentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["In Stock", "Out of stock"],
    default: "In Stock",
  },
  rating: { type: Number, min: 0, max: 5 },
  description: { type: String, required: true },
  keyFeatures: { type: [String], required: true },
  image: { type: String, required: true },
  individualRating: { type: Number, min: 0, max: 5 },
  averageRating: { type: Number, min: 0, max: 5 },
  reviews: [{ type: String }],
});

const PCComponent = mongoose.model("PCComponent", pcComponentSchema);


app.get("/", (req, res) => {
  res.send("This is the home route");
});



app.get("/api/pc-components", async (req, res) => {
  try {
    const components = await PCComponent.find();
    res.json(components);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/pc-components", async (req, res) => {
  try {
    const newComponent = await PCComponent.create(req.body);
    res.status(201).json(newComponent);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get("/api/pc-components/:id", async (req, res) => {
  const componentId = req.params.id;

  try {
    const component = await PCComponent.findById(componentId);
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.json(component);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


const pcBuilder = {
  cpu: null,
  motherboard: null,
  ram: null,
  psu: null,
  storage: null,
  monitor: null,
};

app.get("/api/pc-builder", (req, res) => {
  res.json(pcBuilder);
});

app.get("/api/pc-components/:id", async (req, res) => {
  const componentId = req.params.id;

  try {
    const component = await PCComponent.findById(componentId);
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.json(component);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.get("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});
