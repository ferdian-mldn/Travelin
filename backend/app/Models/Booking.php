<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tour_id',
        'travel_date',
        'quantity',
        'total_price',
        'status',
    ];

    public function tour()
{
    return $this->belongsTo(Tour::class);
}

public function user()
{
    return $this->belongsTo(User::class);
}
}