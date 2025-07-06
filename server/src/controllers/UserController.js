import db from '../database/prismaConfig.js';
import bcrypt from 'bcrypt';
import { GenerateAccessToken, GenerateRefreshToken } from '../utils/GenerateToken.js';

export const addUser = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).json({ message: "Incomplete credentials..." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Incomplete credentials..." });
    }
    const loggedInUser = await db.user.findUnique({
      where: { email }
    });

    if (!loggedInUser) {
      return res.status(400).json({ message: "Incorrect credentials..." });
    }

    const passwordMatched = await bcrypt.compare(password, loggedInUser.password);
    if (!passwordMatched) {
      return res.status(400).json({ message: "Incorrect credentials..." });
    }

    const accessToken = GenerateAccessToken(email);
    const refreshToken = GenerateRefreshToken(email);

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    await db.user.update({
      where: { email },
      data: { refreshtoken: refreshToken },
    });

    return res.status(200).json({ message: "User logged in successfully", accessToken });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
