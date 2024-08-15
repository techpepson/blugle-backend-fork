//appointment booking schema
import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  appointmentDate: Date,
  appointmentTime: String,
  reason: String,
  doctorSelected: String,
});

//model of the database for appointment booking
export const Appointment = mongoose.model("Appointment", appointmentSchema);
