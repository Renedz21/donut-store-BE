import mongoose from "mongoose";
import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import { uploadImage } from "../utils/uploadImage.js";

export const register = async (req, res, next) => {
    try {

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const urlPhoto = await uploadImage(req.body.photoUrl, "users");

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            photoUrl: urlPhoto,
        });

        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        const { password, ...others } = user._doc;

        res.cookie("acess_token", token, {
            httpOnly: true,
        }).status(200).json({
            others,
            token,
        })

    } catch (error) {
        console.log(error)
        next(createError("El usuario ya existe", 400));
    }
}

export const login = async (req, res, next) => {
    try {

        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError("User does not exist", 400));

        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

        if (!isPasswordValid) return next(createError("Invalid password", 400));

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        //const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        const { password, ...others } = user._doc;

        res.cookie("acess_token", token, {
            httpOnly: true,
        }).status(200).json({
            others,
            token,
        })

    } catch (error) {
        console.log(error)
        next(createError("Something went wrong", 500));
    }
}