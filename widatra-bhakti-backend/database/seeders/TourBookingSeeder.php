<?php

namespace Database\Seeders;

use App\Models\TourBooking;
use App\Models\TourStatusHistory;
use App\Services\IdGenerator;
use Illuminate\Database\Seeder;

class TourBookingSeeder extends Seeder
{
    /** Mirrors tour-store.ts seed bookings. */
    public function run(): void
    {
        $bookings = [
            ['visitor_name' => 'Dr. Hendra Wijaya', 'organization' => 'RS Siloam Surabaya', 'email' => 'hendra.wijaya@siloamhospitals.com', 'phone' => '+62 811 2233 4455', 'pax' => 6, 'purpose' => 'Hospital pharmacy team benchmarking visit for sterile production standards.', 'time_slot' => '09:00 - 11:00', 'status' => 'Approved', 'tour_days_ahead' => 10, 'submitted_days_ago' => 6],
            ['visitor_name' => 'Prof. Retno Wulandari', 'organization' => 'Universitas Airlangga — Faculty of Pharmacy', 'email' => 'retno.wulandari@unair.ac.id', 'phone' => '+62 812 3344 5566', 'pax' => 25, 'purpose' => 'Undergraduate industrial pharmacy field trip.', 'time_slot' => '13:00 - 15:00', 'status' => 'Pending', 'tour_days_ahead' => 18, 'submitted_days_ago' => 2],
            ['visitor_name' => 'Fajar Nugroho', 'organization' => 'PT Distribusi Farma Nusantara', 'email' => 'fajar.nugroho@dfn.co.id', 'phone' => '+62 813 5566 7788', 'pax' => 4, 'purpose' => 'Distributor partner facility audit and relationship visit.', 'time_slot' => '09:00 - 11:00', 'status' => 'Completed', 'tour_days_ahead' => -20, 'submitted_days_ago' => 28],
            ['visitor_name' => 'Maya Kusuma', 'organization' => 'SMK Farmasi Harapan Bangsa', 'email' => 'maya.kusuma@smkfarmasi.sch.id', 'phone' => '+62 814 6677 8899', 'pax' => 30, 'purpose' => 'Vocational school factory exposure program.', 'time_slot' => '13:00 - 15:00', 'status' => 'Rejected', 'tour_days_ahead' => 15, 'submitted_days_ago' => 3, 'reject_note' => 'Group size exceeds our safety capacity for the requested slot — please resubmit with a smaller group or split visit.'],
        ];

        foreach ($bookings as $b) {
            $submittedAt = now()->subDays($b['submitted_days_ago']);

            $booking = TourBooking::create([
                'id' => IdGenerator::make('FT'),
                'user_id' => null,
                'tour_date' => now()->addDays($b['tour_days_ahead'])->toDateString(),
                'time_slot' => $b['time_slot'],
                'visitor_name' => $b['visitor_name'],
                'organization' => $b['organization'],
                'email' => $b['email'],
                'phone' => $b['phone'],
                'pax' => $b['pax'],
                'purpose' => $b['purpose'],
                'status' => $b['status'],
                'submitted_at' => $submittedAt,
            ]);

            TourStatusHistory::create(['tour_booking_id' => $booking->id, 'status' => 'Pending', 'happened_at' => $submittedAt]);

            if ($b['status'] !== 'Pending') {
                TourStatusHistory::create([
                    'tour_booking_id' => $booking->id,
                    'status' => $b['status'],
                    'note' => $b['reject_note'] ?? null,
                    'happened_at' => $submittedAt->copy()->addDay(),
                ]);
            }
        }
    }
}
