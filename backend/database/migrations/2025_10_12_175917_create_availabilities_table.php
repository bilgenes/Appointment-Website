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
        Schema::create('availabilities', function (Blueprint $table) {
            $table->id();
            // Hangi personele ait olduğu
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            // Haftanın hangi günü (1=Pazartesi, 2=Salı, ..., 7=Pazar)
            $table->unsignedTinyInteger('day_of_week');
            // Çalışma başlangıç ve bitiş saatleri
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();

            // Bir personelin aynı gün için birden fazla çalışma saati olamaz
            $table->unique(['user_id', 'day_of_week']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('availabilities');
    }
};
