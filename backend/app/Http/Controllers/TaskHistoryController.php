<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskHistory;

class TaskHistoryController extends Controller
{
    public function index($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        if ($task->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $history = TaskHistory::where('task_id', $id)->get();

        return response()->json($history);
    }
}
