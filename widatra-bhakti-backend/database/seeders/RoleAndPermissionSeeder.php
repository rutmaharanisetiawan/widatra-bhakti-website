<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $guards = ['sanctum', 'web'];

        // 1. Create Permissions
        $permissions = [
            'manage:all',
            'manage:products',
            'manage:articles',
            'manage:csr',
            'manage:cms',
            'manage:media',
            'manage:jobs',
            'manage:applications',
            'manage:tour-bookings',
            'moderate:community-events',
            'manage:users',
            'view:audit-logs',
            'submit:community-events',
            'apply:jobs',
            'book:factory-tour',
        ];

        foreach ($guards as $guard) {
            foreach ($permissions as $perm) {
                Permission::findOrCreate($perm, $guard);
            }

            // 2. Create the 8 Official Roles
            $roleSuperAdmin = Role::findOrCreate('Super Admin', $guard);
            $roleContentAdmin = Role::findOrCreate('Content Admin', $guard);
            $roleHrManager = Role::findOrCreate('HR Manager', $guard);
            $roleEventModerator = Role::findOrCreate('Event Moderator', $guard);
            $roleFactoryTourAdmin = Role::findOrCreate('Factory Tour Admin', $guard);
            $roleInternalEmployee = Role::findOrCreate('Internal Employee', $guard);
            $roleExternalUser = Role::findOrCreate('External User', $guard);
            $roleGuestVisitor = Role::findOrCreate('Guest / Visitor', $guard);

            // Legacy aliases
            $roleAdmin = Role::findOrCreate('Administrator', $guard);
            $roleContentEditor = Role::findOrCreate('Content Editor', $guard);
            $roleCsrCoordinator = Role::findOrCreate('CSR Coordinator', $guard);

            // 3. Assign Permissions to Roles
            $roleSuperAdmin->syncPermissions(Permission::where('guard_name', $guard)->get());
            $roleAdmin->syncPermissions(Permission::where('guard_name', $guard)->get());

            $roleContentAdmin->syncPermissions(['manage:products', 'manage:articles', 'manage:csr', 'manage:cms', 'manage:media']);
            $roleContentEditor->syncPermissions(['manage:products', 'manage:articles', 'manage:csr', 'manage:cms', 'manage:media']);
            $roleCsrCoordinator->syncPermissions(['manage:csr', 'manage:articles']);
            $roleHrManager->syncPermissions(['manage:jobs', 'manage:applications']);
            $roleEventModerator->syncPermissions(['moderate:community-events']);
            $roleFactoryTourAdmin->syncPermissions(['manage:tour-bookings']);
            $roleInternalEmployee->syncPermissions(['submit:community-events']);
            $roleExternalUser->syncPermissions(['apply:jobs', 'book:factory-tour']);
        }

        // 4. Assign Spatie roles to existing Users
        $users = User::all();
        foreach ($users as $user) {
            $r = $user->role;
            if ($r === 'Administrator') {
                $user->assignRole(['Super Admin', 'Administrator']);
            } elseif ($r === 'Content Editor') {
                $user->assignRole(['Content Admin', 'Content Editor']);
            } elseif ($r === 'CSR Coordinator') {
                $user->assignRole(['Content Admin', 'CSR Coordinator']);
            } elseif ($r === 'HR Manager') {
                $user->assignRole('HR Manager');
            } elseif ($r === 'Internal Employee' || $user->account_type === 'internal') {
                $user->assignRole('Internal Employee');
            } else {
                $user->assignRole('External User');
            }
        }
    }
}
