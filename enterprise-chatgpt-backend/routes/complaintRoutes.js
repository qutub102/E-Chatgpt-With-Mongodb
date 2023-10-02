const router = require("express").Router();
const complaint = require("../models/complaintModel");
const Complaint = require("../models/complaintModel");

router.get("/getAllComplaints", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    const count = await Complaint.count();
    if (complaints?.length === 0) {
      return res.status(404).json({
        message: "No Complaint found",
      });
    }

    // res.json({ count, complaints });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong....",
    });
  }
});
router.post("/createComplaint", async (req, res) => {
  try {
    const complaint = await Complaint(req.body);
    await complaint.save();

    res.json({
      message: "Your complaint is successfully registered.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong....",
    });
  }
});
router.patch("/updateComplaint/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    console.log(complaint)

    if (!complaint) {
      return res.status(404).json({
        message: "No Complaint Found with provided id",
      });
    }

    res.json({
      message: "Complaint updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong....",
    });
  }
});
router.delete("/deleteComplaint/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "No Complaint Found with provided id",
      });
    }

    res.json({
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong....",
    });
  }
});
router.get("/getComplaintById/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "No Complaint Found with provided id",
      });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong....",
    });
  }
});

module.exports = router;
