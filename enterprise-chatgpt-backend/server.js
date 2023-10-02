const express = require("express");
const app = express();
const cors = require("cors");
require("./db").db();

const complaintRoutes = require("./routes/complaintRoutes")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/complaint",complaintRoutes)
app.use('/chat',require("./routes/chatRoutes"))

app.listen(process.env.PORT || 8002, () => console.log("server is running..."));
