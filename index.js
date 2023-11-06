const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json({ type: "application/json" }));
const mongoose = require("mongoose");
const schema = mongoose.Schema;
mongoose
  .connect(
    "mongodb+srv://vignesh:vignesh123@cluster0.9cqtctj.mongodb.net/sample"
  )
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

//100-message
//200-sucess
//300-redirect
//400-client side error
//500-sever side error

const userSchema = new schema({
  
  FirstName: { type: String },
  LastName: { type: String },
  Email: { type: String },
  Gender: { type: String },
  Age: { type: Number }
});

const userModel = mongoose.model("user", userSchema);
const cors = require("cors");
app.use(cors());

let storedb = [];

// Sample data for demonstration
storedb.push(
  {
    FirstName:"John",
    LastName: "Doe",
    Email: "john.doe@example.com",
    Gender: "Male",
    Age: 30,

  },
  {
    FirstName: "sam ",
    LastName: "sam",
    Email: "sam.doe@example.com",
    Gender: "Male",
    Age: 20,
  }
);

//GET
app.get("/get", async (_, res) => {
  try {
    const data = await userModel.find();
    res.status(200).send({ message: "Get method run sucessfully", data: data });
  } catch (error) {
    res.status(500).send({ message: "server side error" });
  }
});

//post
app.post("/post", async (req, res) => {
  try {
    const {_id, FirstName, LastName, Email, Gender , Age } = req.body || {};
    // Validate that the received data has the required properties
    if (!FirstName || !LastName || !Email || !Gender || !Age)
      return res.status(400).json({ message: "Required field missing" });
    const userData = new userModel({ FirstName, LastName, Email, Gender, Age });
    
    await userData.save();
    return res.status(200).send({ message: "Data inserted successfully" });
  } catch (error) {
    return res.status(500).send({ message: "server side error" });
  }
});

// PUT
app.put("/put", async (req, res) => {
  try {
    const { updatedNames = [] } = req.body;
    if (!Array.isArray(updatedNames) || updatedNames.length === 0) {
      return res.status(400).send({ message: "An array of names is required" });
    }
    // Replace the contents of storedb with the new array
    storedb = [...updatedNames];
    return res.status(200).send({ message: "Array updated successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Server-side error" });
  }
});

// // Patch
// app.patch("/my", async (req, res) => {
//   try {
//     const { previousName, updateName } = req.body;
//     if (!previousName || !updateName) {
//       return res
//         .status(400)
//         .send({ message: "Both previousName and updateName are required" });
//     }
//     const index = storedb.indexOf(previousName);
//     if (index !== -1) {
//       // storedb.splice(index,1,updateName);
//       // storedb[index]=updateName
//       for (let i = 0; i < storedb.length; i++) {
//         if (storedb[i] === previousName) {
//           storedb[i] = updateName;
//         }
//       }
//       // console.log("Updated storedb:", storedb); // Log the updated array
//       return res.status(200).send({ message: "Array updated successfully" });
//     } else {
//       return res
//         .status(404)
//         .send({ message: "Previous name not found in the array" });
//     }
//   } catch (error) {
//     return res.status(500).send({ message: "Server-side error" });
//   }
// });

app.patch("/my/:Id", async (req, res) => {
  try {
  const {Id="" } = req.params ||{};
  if (!Id)
  return res.status(400).json({ message: "Required field missing" });
  const { FirstName, LastName, Email, Gender, Age } = req.body || {};
  if (!FirstName || !LastName || !Email || !Gender || !Age)
  return res.status(400).json({ message: "Required field missing" });

const  userData = await userModel.findById(Id);
if (!userData)
return res.status(400).json({ message: "invaild id" });

userData.FirstName=FirstName;
userData.LastName=LastName;
userData.Email=Email;
userData.Gender=Gender;
userData.Age=Age;
   
await userData.save();

return res
    .status(200)
    .send({ message: "data updated successfully" });
  }catch(error){
    return res.status(500).send({ message: "Server-side error" });

  }
});




app.delete("/delete/:Id", async (req, res) => {
  try {
  const {Id="" } = req.params ||{};
  if (!Id)
  return res.status(400).json({ message: "Required field missing" });

await userModel.findByIdAndDelete(Id)
    return res
    .status(200)
    .send({ message: "Row Deleted successfully" });
  }catch(error){
    return res.status(500).send({ message: "Server-side error" });

  }
});
app.listen(5000, () => {
  console.log("50000 server running");
});