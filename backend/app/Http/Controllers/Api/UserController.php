<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return response()->json(
            $query->latest()->paginate($request->get('per_page', 15))
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:super_admin,admin,reviewer,author',
            'institution' => 'nullable|string',
            'phone' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'institution' => $request->institution,
            'phone' => $request->phone,
            'bio' => $request->bio,
            'is_active' => true,
        ]);

        ActivityLog::log('user_created', "User '{$user->name}' created with role: {$user->role}", $user);

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load(['papers', 'reviews']));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|in:super_admin,admin,reviewer,author',
            'is_active' => 'sometimes|boolean',
            'institution' => 'nullable|string',
            'phone' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        $data = $request->only(['name', 'email', 'role', 'is_active', 'institution', 'phone', 'bio']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        ActivityLog::log('user_updated', "User '{$user->name}' updated", $user);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete your own account.'], 422);
        }

        ActivityLog::log('user_deleted', "User '{$user->name}' deleted", null);
        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus.']);
    }

    public function toggleActive(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';
        ActivityLog::log('user_toggled', "User '{$user->name}' {$status}", $user);

        return response()->json($user);
    }

    public function reviewers()
    {
        return response()->json(
            User::where('role', 'reviewer')->where('is_active', true)->get(['id', 'name', 'email', 'institution'])
        );
    }
}
