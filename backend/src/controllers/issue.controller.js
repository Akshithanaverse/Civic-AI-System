import Issue from "../models/Issue.model.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.model.js";
import axios from "axios";

/**
 * Citizen creates an issue (with optional image)
 */
export const createIssue = async (req, res, next) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  console.log("USER:", req.user);
  try {
    const { title, description, category, lat, lng } = req.body;

    if (!title || !description || !category || !lat || !lng) {
      return res.status(400).json({ message: "All fields including location are required" });
    }

    // AI analysis (only if image is provided)
    let aiCategory = null, aiConfidence = null, aiGeneratedDescription = null, aiSeverityScore = null, is_miscategorized = null;

    if (req.file) {
      try {
        const aiResponse = await axios.post("http://localhost:8000/analyze", {
          image: req.file.buffer.toString("base64")
        });
        ({ predicted_category: aiCategory, confidence_percent: aiConfidence, generated_description: aiGeneratedDescription, severity_score: aiSeverityScore, is_miscategorized } = aiResponse.data);
      }  catch (aiError) {
  console.error("AI service error:", aiError.message);  // change this line
  console.error("AI service full error:", aiError.response?.data || aiError.message);
}
    }

    // Upload image to Cloudinary (only if image is provided)
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      );
      imageUrl = result.secure_url;
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      images: imageUrl ? [imageUrl] : [],
      reportedBy: req.user._id,
      aiCategory,
      aiConfidence,
      aiGeneratedDescription,
      aiSeverityScore,
      is_miscategorized,
    });

    res.status(201).json({
      message: "Issue reported successfully",
      issue
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin views all issues
 */
export const getAllIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find()
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json(issues);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin assigns issue to crew
 */
export const assignIssue = async (req, res, next) => {
  try {
    const { crewId } = req.body;

    const crewUser = await User.findById(crewId);

    if (!crewUser || crewUser.role !== "crew") {
      return res.status(400).json({
        message: "Invalid crew member"
      });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: crewId,
        status: "assigned"
      },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({
      message: "Issue assigned successfully",
      issue
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crew updates issue status
 */
export const updateIssueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (!issue.assignedTo || issue.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not assigned to this issue"
      });
    }

    issue.status = status;
    await issue.save();

    res.status(200).json({
      message: "Issue status updated",
      issue
    });
  } catch (error) {
    next(error);
  }
};

export const getMyIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    next(error);
  }
};

export const getAssignedIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({ assignedTo: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    next(error);
  }
};