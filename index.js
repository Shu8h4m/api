const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const userRoute = require("./routes/user")

const cookieParser = require("cookie-parser");


const app = express();
dotenv.config();

const corsOptions = {
    origin: 'https://resplendent-kitsune-5efe7a.netlify.app',
    credentials: true, // This allows the browser to include credentials in the request
  };
  app.options('*', cors(corsOptions));
  app.use(cors(corsOptions));

// database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log('Database not connected', err));

app.use("/images", express.static(path.join(__dirname, "public/images")));
    
//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination : (req,file,cb) =>{
        cb(null, "public/images" );
    },
    filename : (req,file,cb) =>{
        cb(null, req.body.name);
    },
})

const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req,res) =>{
    try {
        return res.status(200).json("File Uploaded Succesfully.")
    } catch (error) {
        console.log(error)
    }
});



app.use("/api/user",userRoute)
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);


app.listen(process.env.PORT || 8800, ()=> console.log("Backend Server is Running"));