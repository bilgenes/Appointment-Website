<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Availability;
use App\Models\User;
use App\Models\Service;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class StaffController extends Controller
{
    /**
     * Sistemdeki tüm randevuları listeler.
     */
    public function getAllAppointments()
    {
        $appointments = Appointment::with('customer:id,name,surname', 'personal:id,name,surname', 'service:id,name')
            ->latest('start_time')
            ->get();
        return response()->json(['data' => $appointments]);
    }

    /**
     * Bir randevunun durumunu günceller (onaylama/iptal etme).
     */
    public function updateAppointmentStatus(Request $request, Appointment $appointment)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', Rule::in(['confirmed', 'completed', 'cancelled'])],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment->status = $request->status;
        $appointment->save();

        return response()->json(['message' => 'Appointment status updated.', 'data' => $appointment]);
    }

    /**
     * Bir personelin çalışma saatlerini günceller veya oluşturur.
     */
    public function updateAvailability(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'availabilities' => 'present|array',
            'availabilities.*.day_of_week' => 'required|integer|between:1,7',
            'availabilities.*.start_time' => 'required|date_format:H:i',
            'availabilities.*.end_time' => 'required|date_format:H:i|after:availabilities.*.start_time',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userId = $request->user_id;
        Availability::where('user_id', $userId)->delete();

        foreach ($request->availabilities as $availability) {
            Availability::create(array_merge(['user_id' => $userId], $availability));
        }

        $newAvailabilities = Availability::where('user_id', $userId)->get();
        return response()->json(['message' => 'Availability updated successfully.', 'data' => $newAvailabilities]);
    }

    /**
     * Belirli bir personel ve tarih için müsait zaman dilimlerini hesaplar.
     */
    public function getAvailableSlots(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date_format:Y-m-d',
            'service_id' => 'required|exists:services,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $date = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeekIso;
        $service = Service::find($request->service_id);
        $duration = $service->duration_minutes;

        $availability = Availability::where('user_id', $user->id)
            ->where('day_of_week', $dayOfWeek)
            ->first();

        if (!$availability) {
            return response()->json(['slots' => []]);
        }

        $appointments = Appointment::where('personal_id', $user->id)
            ->whereDate('start_time', $date->toDateString())
            ->where('status', '!=', 'cancelled')
            ->get();

        $potentialSlots = [];
        $startTime = Carbon::parse($date->toDateString() . ' ' . $availability->start_time);
        $endTime = Carbon::parse($date->toDateString() . ' ' . $availability->end_time);

        while ($startTime < $endTime) {
            $potentialSlots[] = $startTime->copy();
            $startTime->addMinutes(15);
        }

        $availableSlots = [];
        foreach ($potentialSlots as $slot) {
            $isAvailable = true;
            $slotEndTime = $slot->copy()->addMinutes($duration);

            if ($slotEndTime > $endTime) {
                continue;
            }

            foreach ($appointments as $appointment) {
                $appointmentStart = Carbon::parse($appointment->start_time);
                $appointmentEnd = Carbon::parse($appointment->end_time);

                if ($slot < $appointmentEnd && $slotEndTime > $appointmentStart) {
                    $isAvailable = false;
                    break;
                }
            }

            if ($isAvailable) {
                $availableSlots[] = $slot->format('H:i');
            }
        }

        return response()->json(['slots' => array_unique($availableSlots)]);
    }
}

