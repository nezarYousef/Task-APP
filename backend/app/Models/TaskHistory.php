<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskHistory extends Model
{
    protected $table = 'task_history';//عشان laravel تغير الاسم تلقائي  فانا بدي احافظ على السم
    protected $fillable = [
        'task_id',
        'changed_by',
        'old_status',
        'new_status'
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
