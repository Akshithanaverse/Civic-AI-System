import Issue from "../models/Issue.model.js";

/**
 * Citizen creates an issue
 */
export const createIssue = async (req, res, next) => {
  try {
    const { title, description, category, location } = req.body;

    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      reportedBy: req.user._id
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
