<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\IdGenerator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Demo applicant/employee accounts — mirrors auth-store.ts seedIfEmpty().
        User::create([
            'public_id' => 'USR-SEED-0001',
            'account_type' => 'external',
            'role' => 'External User',
            'status' => 'Active',
            'name' => 'Ayu Pratiwi',
            'email' => 'ayu.pratiwi@example.com',
            'phone' => '+62 812 3456 7890',
            'password' => Hash::make('Password123!'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'public_id' => 'USR-SEED-0002',
            'account_type' => 'internal',
            'role' => 'Internal Employee',
            'status' => 'Active',
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@widatra.co.id',
            'phone' => '+62 813 9988 7766',
            'employee_id' => 'WB-EMP-1042',
            'department' => 'Human Resources',
            'position' => 'HR Staff',
            'password' => Hash::make('Password123!'),
            'email_verified_at' => now(),
        ]);

        // Admin console accounts — one per role, so every module in the
        // Admin console (as gated by the Policies / Gates) has a demo login.
        $adminAccounts = [
            ['name' => 'Andi Wijaya', 'employee_id' => 'WBK-00001', 'role' => 'Administrator', 'department' => 'Corporate', 'position' => 'System Administrator'],
            ['name' => 'Sari Ningsih', 'employee_id' => 'WBK-00002', 'role' => 'HR Manager', 'department' => 'Human Resources', 'position' => 'HR Manager'],
            ['name' => 'Rangga Prasetyo', 'employee_id' => 'WBK-00003', 'role' => 'Content Editor', 'department' => 'Corporate Communications', 'position' => 'Content Editor'],
            ['name' => 'Dewi Anggraini', 'employee_id' => 'WBK-00004', 'role' => 'CSR Coordinator', 'department' => 'Corporate Communications', 'position' => 'CSR Coordinator'],
        ];

        foreach ($adminAccounts as $admin) {
            User::create([
                'public_id' => IdGenerator::publicUserId(),
                'account_type' => 'internal',
                'role' => $admin['role'],
                'status' => 'Active',
                'name' => $admin['name'],
                'email' => strtolower(str_replace(' ', '.', $admin['name'])).'@widatra.co.id',
                'phone' => '+62 811 000 0000',
                'employee_id' => $admin['employee_id'],
                'department' => $admin['department'],
                'position' => $admin['position'],
                'password' => Hash::make('AdminPass123!'),
                'email_verified_at' => now(),
            ]);
        }
    }
}
