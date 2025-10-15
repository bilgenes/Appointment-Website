<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;

class DataController extends Controller
{
    /**
     * Sistemdeki tüm personelleri, ortalama puanlarıyla birlikte listeler.
     */
    public function getPersonnel()
    {
        $personnel = User::where('role', 'personal')->orWhere('role', 'admin')
            // 'reviews' ilişkisi üzerinden 'rating' sütununun ortalamasını
            // 'reviews_avg_rating' adıyla hesaplayıp veriye ekler.
            ->withAvg('reviews', 'rating')
            ->get(['id', 'name', 'surname']);

        return response()->json(['data' => $personnel]);
    }

    /**
     * Sistemdeki tüm servisleri listeler.
     */
    public function getServices()
    {
        $services = Service::all();
        return response()->json(['data' => $services]);
    }
}
