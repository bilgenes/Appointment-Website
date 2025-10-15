<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne; // <-- BU SATIRI EKLEYİN

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'personal_id',
        'service_id',
        'start_time',
        'end_time',
        'status',
        'notes',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function personal(): BelongsTo
    {
        return $this->belongsTo(User::class, 'personal_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    // --- YENİ İLİŞKİ ---
    // Bir randevunun sadece bir değerlendirmesi olabilir.
    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }
}
