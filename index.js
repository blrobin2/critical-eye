require("dotenv").config();
const App = require("./server/app");

const app = new App();
app.listen(8080);