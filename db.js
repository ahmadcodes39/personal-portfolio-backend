import mongoose from "mongoose";

const mongooseUri = process.env.MONGOOSE_URI;
const connectToMongo = async () => {
  try {
    const response = await mongoose.connect(mongooseUri);
    if (response) {
      console.log("connected to mongoo successfully");
    }
  } catch (error) {
    console.log(error);
  }
};
export default connectToMongo
