<?php

// DEĞİŞİKLİK: 'Http-Controllers' -> 'Http\Controllers' olarak düzeltildi.
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Service;
use App\Models\Appointment;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Sistemdeki tüm kullanıcıları listeler.
     */
    public function usersIndex()
    {
        $users = User::where('id', '!=', auth()->id())->latest()->get();
        return response()->json(['data' => $users]);
    }

    /**
     * Bir kullanıcının rolünü değiştirir.
     */
    public function changeUserRole(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'role' => ['required', Rule::in(['admin', 'personal', 'customer'])],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'User role updated successfully.', 'data' => $user]);
    }

    /**
     * Tüm servisleri listeler.
     */
    public function servicesIndex()
    {
        $services = Service::latest()->get();
        return response()->json(['data' => $services]);
    }

    /**
     * Yeni bir servis oluşturur.
     */
    public function servicesStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $service = Service::create($validator->validated());
        return response()->json(['message' => 'Service created successfully.', 'data' => $service], 201);
    }

    /**
     * Bir servisi siler.
     */
    public function servicesDestroy(Service $service)
    {
        $service->delete();
        return response()->json(['message' => 'Service deleted successfully.'], 200);
    }

    /**
     * Dashboard için gerekli tüm istatistiksel verileri toplar ve döndürür.
     */
    public function getStatistics()
    {
        $totalCustomers = User::where('role', 'customer')->count();

        $dailyRevenue = Appointment::where('status', 'completed')
            ->whereDate('appointments.updated_at', Carbon::today())
            ->join('services', 'appointments.service_id', '=', 'services.id')
            ->sum('services.price');

        $weeklyRevenue = Appointment::where('status', 'completed')
            ->whereBetween('appointments.updated_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->join('services', 'appointments.service_id', '=', 'services.id')
            ->sum('services.price');

        $upcomingAppointments = Appointment::where('status', 'confirmed')
            ->where('start_time', '>=', Carbon::now())
            ->with('customer:id,name,surname', 'personal:id,name,surname', 'service:id,name')
            ->orderBy('start_time', 'asc')
            ->limit(5)
            ->get();

        $recentCustomers = User::where('role', 'customer')
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'surname', 'created_at']);

        return response()->json([
            'total_customers' => $totalCustomers,
            'daily_revenue' => (float)$dailyRevenue,
            'weekly_revenue' => (float)$weeklyRevenue,
            'upcoming_appointments' => $upcomingAppointments,
            'recent_customers' => $recentCustomers,
        ]);
    }
}

