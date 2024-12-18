import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, req: true },
    surname: {type: String, req:true},
    phoneNo: {type: String, req:true},
    identityNo: {type: String, req:true},
    gender: {type: String, req:true},
    email: { type: String, req: true, unique: true },
    cartData: { type: Object, default: {} },
    // address: {
    //   street: { type: String, req: true },
    //   city: { type: String, req: true },
    //   postalCode: { type: String, req: true },
    //   country: { type: String, req: true },
    // },
    password: { type: String, req: true },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model('user',userSchema)

export default userModel;