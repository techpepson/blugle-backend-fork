//appointment booking schema
const appointmentSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  appointmentDate: Date,
  appointmentTime: String,
  reason: String,
  notes: String,
});

//model of the database for appointment booking
export const Appointment = mongoose.model("Appointment", appointmentSchema);
