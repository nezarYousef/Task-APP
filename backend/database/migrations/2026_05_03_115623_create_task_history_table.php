<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('task_history', function (Blueprint $table) {
            $table->id();

            $table->foreignId('task_id')
                ->constrained('tasks')
                ->onDelete('cascade');

            $table->foreignId('changed_by')
                ->constrained('users')
                ->onDelete('cascade');

            $table->enum('old_status', ['waiting', 'in_progress', 'completed', 'canceled'])
                ->default('waiting');

            $table->enum('new_status', ['waiting', 'in_progress', 'completed', 'canceled'])
                ->default('waiting');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_history');
    }
};
