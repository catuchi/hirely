const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    res
      .status(StatusCodes.OK)
      .json({ user: { name: user.name }, token: user.createJWT() });
  } else {
    throw new UnauthenticatedError("Invalid Credentials");
  }
};

module.exports = {
  register,
  login,
};
