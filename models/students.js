import mongoose,{Schema} from "mongoose";
const StudentsSchema = new Schema(
    {
    name: {
      type: String,
      required: true,
    },
    fathername: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    bennettemail: {
      type: String,
      required: true,
      unique: true, // Make sure email is unique
    },
    password: {
      type: String,
      required: true,
    },
    },
    {
      timestamps: true,
    }
  );
const Students = mongoose.models.Students || mongoose.model("Students", StudentsSchema);
Students.createIndexes();
export default Students;
