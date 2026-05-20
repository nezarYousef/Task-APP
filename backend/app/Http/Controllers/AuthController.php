<?php

namespace App\Http\Controllers;


use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;

class AuthController extends Controller
{


    //Register

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'phone' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ]);
    }

    //Login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'token' => $token
        ]);
    }

    //Logout
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }


    //Get Auth User
    public function me()
    {
        return response()->json([
            'user' => auth()->user()
        ]);
    }
    // update my Profile
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|nullable|string|max:20|unique:users,phone,' . $user->id,
            'password' => 'sometimes|min:6',
        ]);

        if ($request->name) {
            $user->name = $request->name;
        }

        if ($request->email) {
            $user->email = $request->email;
        }

        if ($request->phone) {
            $user->phone = $request->phone;
        }

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    //delete me
    public function deleteAccount()
    {
        $user = auth()->user();

        $user->delete();

        auth()->logout();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }
}
