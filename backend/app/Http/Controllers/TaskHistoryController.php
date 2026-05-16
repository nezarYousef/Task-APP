<?php

namespace App\Http\Controllers;

use App\Models\TaskHistory;

class TaskHistoryController extends Controller
{
    public function index($taskId)
    {
        return response()->json(
            TaskHistory::where('task_id', $taskId)->get()
        );
    }
}
