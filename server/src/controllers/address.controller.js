import { address } from "../models/address.model.js";
import { ApiError, asyncHandler } from "../util/aysncHandler.js";

const addingNewAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const findUser = await address.findOne({ user });
  if (!findUser) {
    await address.create({
      address: [{ ...req.body, isDefault: true }],
      user,
    });
  } else {
    await address.updateOne(
      { user },
      {
        $push: { address: req.body },
      }
    );
  }

  return res.status(200).json({ message: "done" });
});
const getAddress = asyncHandler(async (req, res) => {
  const limit = req.query?.limit || 2;
  const userRef = req.user;
  const mongoQuery = await address.findOne(
    { user: userRef },
    { address: { $slice: limit } }
  );
  return res.status(200).json({
    status: "sucess",
    list: mongoQuery,
  });
});
const updateAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const addressId = req.body._id;
  const addressObj = req.body;
  const addressRef = await address.findOne({
    user,
  });
  const dataToUpdate = addressRef.address.id(addressId);
  const prevObj = dataToUpdate.toObject();
  if (JSON.stringify(prevObj) === JSON.stringify(addressObj))
    throw new ApiError("Address is Same ", 304);
  if (addressObj.isDefault) {
    addressRef.address.forEach((address) => {
      address.isDefault = false;
    });
  }

  dataToUpdate.houseNo = addressObj.houseNo || dataToUpdate.houseNo;
  dataToUpdate.city = addressObj.city || dataToUpdate.city;
  dataToUpdate.state = addressObj.state || dataToUpdate.state;
  dataToUpdate.street = addressObj.street || dataToUpdate.street;
  dataToUpdate.zipcode = addressObj.zipcode || dataToUpdate.zipcode;
  dataToUpdate.isDefault = addressObj.isDefault || false;

  await addressRef.save();
  return res
    .status(200)
    .send({ status: "success", message: "address is updated" });
});
export { addingNewAddress, getAddress, updateAddress };
