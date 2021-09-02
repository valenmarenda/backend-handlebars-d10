const express = require("express");
const app = express();
const handlebars = require("express-handlebars");

const productos = require("./routes/productos.route");
const puerto = 9000;

const server = app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${server.address().port}`);
});

app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
    defaultLayout: "index.hbs",
  })
);

app.set("view engine", "hbs");

app.use("/api/productos", productos);
app.use(express.static("public"));

