<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Bir personele ait ortalama puanı ve toplam yorum sayısını getirir.
     */
    public function index($personal_id)
    {
        $averageRating = Review::where('personal_id', $personal_id)->avg('rating');
        $reviewCount = Review::where('personal_id', $personal_id)->count();

        return response()->json([
            'average_rating' => number_format($averageRating, 1),
            'review_count' => $reviewCount,
        ]);
    }

    /**
     * Tamamlanmış bir randevu için yeni bir anonim değerlendirme oluşturur.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|exists:appointments,id',
            'rating' => 'required|integer|between:1,5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment = Appointment::find($request->appointment_id);
        $user = Auth::user();

        // Kontrol: Puanlamayı yapan kişi, randevunun sahibi mi?
        if ($appointment->customer_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Kontrol: Randevunun durumu "completed" (tamamlandı) mı?
        if ($appointment->status !== 'completed') {
            return response()->json(['error' => 'You can only review completed appointments.'], 403);
        }

        // Kontrol: Bu randevu için daha önce puan verilmiş mi?
        $existingReview = Review::where('appointment_id', $appointment->id)->exists();
        if ($existingReview) {
            return response()->json(['error' => 'A review for this appointment already exists.'], 409);
        }

        $review = Review::create([
            'appointment_id' => $appointment->id,
            'personal_id' => $appointment->personal_id,
            'rating' => $request->rating,
        ]);

        return response()->json(['message' => 'Review submitted successfully.', 'data' => $review], 201);
    }
}
