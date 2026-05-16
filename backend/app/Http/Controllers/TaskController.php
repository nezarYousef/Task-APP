<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskHistory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    private function getTaskOrFail($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Task not found'
            ], 404);
        }

        if ($task->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not allowed to access this task'
            ], 403);
        }

        return $task;
    }


    public function index(Request $request)
    {
        $query = Task::where('user_id', auth()->id());

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        return response()->json(
            $query->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'status' => 'in:waiting,in_progress,completed,canceled',
        ]);

        $task = Task::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'waiting',
            'priority' => $request->priority ?? 'medium',
            'category_id' => $request->category_id,
            'progress' => $request->progress ?? 0,
            'start_date' => $request->start_date,
            'due_date' => $request->due_date,
        ]);

        return response()->json($task, 201);
    }
    public function show($id)
    {
        $task = $this->getTaskOrFail($id);

        if ($task instanceof JsonResponse) {
            return $task;
        }

        return response()->json($task);
    }

   public function update(Request $request, $id)
{
    $task = $this->getTaskOrFail($id);

    if ($task instanceof JsonResponse) {
        return $task;
    }

    $oldStatus = $task->status;

    // 1. نعمل update فقط للبيانات
    $task->update($request->all());

    // 2. نتأكد أن status فعلاً تغير
    if ($request->filled('status') && $request->status !== $oldStatus) {

        TaskHistory::create([
            'task_id' => $task->id,
            'changed_by' => auth()->id(),
            'old_status' => $oldStatus,
            'new_status' => $request->status,
        ]);
    }

    return response()->json($task);
}
   public function destroy($id)
    {
        $task = $this->getTaskOrFail($id);

        if ($task instanceof JsonResponse) {
            return $task;
        }

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }
    public function trashed()
    {
        $tasks = Task::onlyTrashed()
            ->where('user_id', auth()->id())
            ->get();

        return response()->json($tasks);
    }

    public function allTasks()
    {
        $tasks = Task::withTrashed()
            ->where('user_id', auth()->id())
            ->get();

        return response()->json($tasks);
    }


   public function forceUpdate(Request $request, $id)
    {
        $task = Task::withTrashed()->find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Task not found'
            ], 404);
        }

        if ($task->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not allowed to modify this task'
            ], 403);
        }

        $task->update($request->all());

        return response()->json([
            'message' => 'Task updated forcefully',
            'task' => $task
        ]);
    }
    public function forceDelete($id)
    {
        $task = Task::withTrashed()->find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Task not found'
            ], 404);
        }

        if ($task->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not allowed to delete this task'
            ], 403);
        }

        $task->forceDelete();

        return response()->json([
            'message' => 'Task permanently deleted'
        ]);
    }
}


