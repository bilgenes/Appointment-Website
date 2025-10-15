<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Sadece giriş yapmış kullanıcının kendi randevularını listeler.
     */
    public function index()
    {
        $user = Auth::user();

        // 'review' ilişkisini de veriye dahil ediyoruz.
        $appointments = Appointment::where('customer_id', $user->id)
            ->with('personal:id,name,surname', 'service:id,name,price', 'review')
            ->latest('start_time')
            ->get();

        return response()->json(['data' => $appointments]);
    }

    /**
     * Yeni bir randevu oluşturur.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'personal_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'start_time' => 'required|date_format:Y-m-d H:i:s',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $service = Service::find($request->service_id);
        $startTime = Carbon::parse($request->start_time);
        $endTime = $startTime->copy()->addMinutes($service->duration_minutes);

        $existingAppointment = Appointment::where('personal_id', $request->personal_id)
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->where('status', '!=', 'cancelled')
            ->exists();

        if ($existingAppointment) {
            return response()->json(['error' => 'This time slot is no longer available.'], 409);
        }

        $appointment = Appointment::create([
            'customer_id' => $user->id,
            'personal_id' => $request->personal_id,
            'service_id' => $request->service_id,
            'start_time' => $request->start_time,
            'end_time' => $endTime,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Appointment created successfully.', 'data' => $appointment], 201);
    }

    /**
     * Belirtilen bir randevuyu veritabanından tamamen siler.
     */
    public function destroy(Appointment $appointment)
    {
        $user = Auth::user();

        if ($appointment->customer_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted successfully.']);
    }
}
