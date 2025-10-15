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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->unique()->constrained()->onDelete('cascade');
            // Müşteri ID'si kaldırıldı, artık anonim
            $table->foreignId('personal_id')->constrained('users')->onDelete('cascade');

            $table->unsignedTinyInteger('rating'); // 1-5 arası yıldız puanı

            // Yorum alanı kaldırıldı
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
