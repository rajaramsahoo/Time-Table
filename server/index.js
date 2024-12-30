
const express = require("express")
const app = express();
require("dotenv").config();
require("./dbConnect/dbConnect.js")
const cors = require("cors");
const UserAPI = require("./routes/userRoutes.js");
const TimeTableAPI = require("./routes/timeTableRoutes.js");
// // app.use(cors());
app.use(express.json());
const corsOptions = {
  origin: ['http://localhost:5174', '*' ,'time-table-frontend-mu.vercel.app'],
  credentials: true, 
  methods: ['OPTIONS','GET', 'POST', 'PUT', 'PATCH', 'DELETE' ],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use("/api/v1", UserAPI);
app.use("/api/v2", TimeTableAPI);
app.get((req, res) => {
  try {
    res.status(200).send("hii")
  } catch (error) {

  }
})
const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});