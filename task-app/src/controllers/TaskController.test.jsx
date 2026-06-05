import {
  addTaskController,
  editTaskController,
  updateProgressController,
  updateStatusController,
} from "./TaskController";
import { updateTask } from "../models/TaskModel";

jest.mock("../models/TaskModel", () => ({
  createDefaultTask: () => ({
    checklist: [{ id: "c1", text: "Default item", done: false }],
  }),
  createTask: jest.fn((userId, task) => Promise.resolve({ id: "task-1", userId, ...task })),
  fetchTasks: jest.fn(),
  fetchTask: jest.fn(),
  updateTask: jest.fn((userId, taskId, updates) => Promise.resolve({ id: taskId, ...updates })),
  deleteTask: jest.fn(),
  archiveTask: jest.fn(),
}));

describe("TaskController edge cases", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("rejects empty task title", async () => {
    await expect(addTaskController("user-1", {
      title: " ",
      startDate: "2026-05-31T10:00",
      endDate: "2026-05-31T11:00",
    })).rejects.toThrow("Task name is required.");
  });

  test("rejects invalid status changes", async () => {
    await expect(updateStatusController("user-1", "task-1", "admin-only"))
      .rejects.toThrow("Invalid status.");
  });

  test("rejects text progress instead of saving NaN", async () => {
    await expect(updateProgressController("user-1", "task-1", "almost done"))
      .rejects.toThrow("Progress must be a number");
  });

  test("saves sanitized checklist updates", async () => {
    await editTaskController("user-1", "task-1", {
      checklist: [
        { id: "c1", text: " Review API response ", done: true },
        { id: "c2", text: " ", done: true },
      ],
    });

    expect(updateTask).toHaveBeenCalledWith("user-1", "task-1", {
      checklist: [{ id: "c1", text: "Review API response", done: true }],
    });
  });
});
