import { BaseEntity } from "./BaseEntity";
import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the User document
interface IUser extends Document {
	userName: string;
	email: string;
	mobileNumer: number;
	userPassword: string;
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema(
	{
		userName: { type: String, required: true },
		email: { type: String, required: true },
		mobileNumer: { type: Number, required: true },
		userPassword: { type: String, required: true },
	},
	{ collection: "UserData", timestamps: true }
);

// Create the UserData model
const UserData = mongoose.model<IUser>("UserData", UserSchema);

// Define the User class extending BaseEntity
class User extends BaseEntity {
	userName: string;
	userPassword: string;
	email: string;
	mobileNumer: number;

	constructor(data: Partial<IUser>, isNew: boolean, createdBy: string, createdByName: string) {
		super();
		this.userName = data.userName || "";
		this.userPassword = data.userPassword || "";
		this.email = data.email || "";
		this.mobileNumer = data.mobileNumer || 0;

		this.initialize(isNew, createdBy, createdByName);
	}
}

export { IUser, UserSchema, UserData, User };
