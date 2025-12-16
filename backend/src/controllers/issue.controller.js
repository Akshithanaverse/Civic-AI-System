import Issue from "../models/Issue.model.js";

export const createIssue = async (req, res, next) => {
  try {
    const issue = await Issue.create(req.body);
    res.status(201).json(issue);
  } catch (error) {
    next(error);
  }
};

export const getAllIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    next(error);
  }
};
