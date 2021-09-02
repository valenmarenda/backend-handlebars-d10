const express = require("express");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

let multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads");
  },
  filename: function (req, file, callback) {
    callback(null, `${file.fieldname}-${Date.now()}`);
  },
});

let upload = multer({ storage });
let container = {};
let productos = [];

class Producto {
  constructor(title, price, thumbnail) {
    this.id = productos.length + 1;
    this.title = title;
    this.price = price;
    this.thumbnail = thumbnail;
  }
}

productos.push(new Producto("Chocolate", 450, "/chocolate.jpg"));
productos.push(new Producto("Avena", 280, "/avena.jpg"));

let removerItem = (array, item) => {
  let i = array.indexOf(item);
  i !== -1 && array.splice(i, 1);
};

router.get("/vista", (req, res) => {
  container["productos"] = productos;
  res.render("main", container);
});

router.get("/", (_, res) => {
  try {
    if (productos.length == 0) {
      res.status(404).json({ Error: "No hay productos cargados" });
    } else {
      res.status(200).json(productos);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/:id", (req, res) => {
  try {
    if (req.params.id <= productos.length) {
      res.status(200).json(productos[req.params.id - 1]);
    } else {
      res.status(404).json({ Error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/guardar", (req, res) => {
  let title = req.body.title;
  let price = parseInt(req.body.price);
  let thumbnail = req.body.thumbnail;

  try {
    productos.push(new Producto(title, price, thumbnail));
    return res.status(200).json(productos[productos.length - 1]);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/actualizar/:id", (req, res) => {
  try {
    let id = parseInt(req.params.id);
    productos[id - 1] = {
      id,
      title: req.body.title,
      price: parseInt(req.body.price),
    };
    res.json(productos[id - 1]);
  } catch (error) {
    throw new Error(error);
  }
});

router.delete("/borrar/:id", (req, res) => {
  try {
    let id = parseInt(req.params.id);

    if (id < productos.length) {
      res.status(200).json(productos[id - 1]);
      removerItem(productos, productos[id - 1]);
    } else {
      res.status(200).json({ msg: "No hay productos" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

router.post("/guardarform", upload.single("thumbnail"), (req, res, next) => {
  let title = req.body.title;
  let price = parseInt(req.body.price);
  let thumbnail = req.file.path;

  try {
    if (!req.file) {
      const error = new Error("no hay archivos");
      error.httpStatusCode = 400;
      return next(error);
    }

    productos.push(new Producto(title, price, thumbnail));
    // res.send(productos[productos.length - 1]);
    res.redirect("/");
  } catch (error) {
    res.status(404).json(error);
  }
});
module.exports = router;
