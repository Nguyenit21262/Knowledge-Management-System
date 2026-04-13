import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = async (value) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(value, salt);
};

export const comparePassword = (plainTextValue, hashedValue) =>
  bcrypt.compare(plainTextValue, hashedValue);
