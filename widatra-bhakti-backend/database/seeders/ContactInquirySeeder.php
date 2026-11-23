<?php

namespace Database\Seeders;

use App\Models\ContactInquiry;
use App\Models\ContactReply;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContactInquirySeeder extends Seeder
{
    /** Mirrors contact-data.ts seed inquiries. */
    public function run(): void
    {
        $inquiries = [
            ['name' => 'Dr. Amelia Tan', 'organization' => 'RS Mitra Keluarga', 'email' => 'amelia.tan@mitrakeluarga.com', 'phone' => '+62 815 1122 3344', 'subject' => 'Product availability inquiry — Ringer Lactate 500ml', 'message' => 'We would like to know current stock and MOQ for Ringer Lactate 500ml for our hospital pharmacy procurement.', 'days_ago' => 5, 'read' => true, 'archived' => false, 'reply' => 'Thank you for reaching out — our sales team will contact you within 1 business day with current stock and pricing.'],
            ['name' => 'Yusuf Kurniawan', 'organization' => 'PT Sumber Sehat Distribusi', 'email' => 'yusuf.k@sumbersehat.co.id', 'phone' => '+62 816 2233 4455', 'subject' => 'Distributor partnership proposal', 'message' => 'We are a distributor covering Kalimantan and would like to discuss a partnership for your IV fluid line.', 'days_ago' => 2, 'read' => true, 'archived' => false, 'reply' => null],
            ['name' => 'Nadia Permatasari', 'organization' => null, 'email' => 'nadia.permatasari@gmail.com', 'phone' => null, 'subject' => 'Career opportunities', 'message' => 'Hi, I could not find an open QC position matching my background. Do you accept general applications?', 'days_ago' => 1, 'read' => false, 'archived' => false, 'reply' => null],
            ['name' => 'Ibnu Setiawan', 'organization' => 'Dinas Kesehatan Kabupaten Pasuruan', 'email' => 'ibnu.setiawan@pasuruankab.go.id', 'phone' => '+62 817 5566 7788', 'subject' => 'CSR collaboration — community health program', 'message' => 'We would like to explore a joint community health screening program in villages near your Pandaan facility.', 'days_ago' => 12, 'read' => true, 'archived' => true, 'reply' => 'This sounds like a great fit for our CSR roadmap. Our CSR Coordinator will follow up to schedule a discussion.'],
        ];

        foreach ($inquiries as $i) {
            $receivedAt = now()->subDays($i['days_ago']);

            $inquiry = ContactInquiry::create([
                'id' => 'ci-'.Str::uuid(),
                'name' => $i['name'],
                'organization' => $i['organization'],
                'email' => $i['email'],
                'phone' => $i['phone'],
                'subject' => $i['subject'],
                'message' => $i['message'],
                'source' => 'Contact Page',
                'received_at' => $receivedAt,
                'read' => $i['read'],
                'archived' => $i['archived'],
            ]);

            if ($i['reply']) {
                ContactReply::create([
                    'contact_inquiry_id' => $inquiry->id,
                    'author_id' => null,
                    'message' => $i['reply'],
                    'sent_at' => $receivedAt->copy()->addHours(6),
                ]);
            }
        }
    }
}
