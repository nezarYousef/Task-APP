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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->enum('status', ['waiting', 'in_progress', 'completed', 'canceled'])
                ->default('waiting');

            $table->unsignedTinyInteger('progress')->default(0);

            $table->foreignId('category_id')->nullable()
            ->constrained('categories')->nullOnDelete();

            $table->string('title', 100);
            $table->text('description')->nullable();

            $table->enum('priority', ['low', 'medium', 'high'])
                ->default('medium');

            $table->timestamp('start_date')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
