<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class PersonalController extends Controller
{
    public function index() 
    {
        try 
        {
            $user_id = JWTAuth::parseToken()->getPayload()->get('sub');
            $data = User::findOrFail($user_id);
            
            return response()->json([
                'data'      => $data,
                'success'   => true,
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e)  
        {
            return response()->json([
                'data'      => [],
                'success'   => false,
                'message'   => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
        
    }

    public function updateProfile(Request $request)
    {
        try 
        {
            $user_id = JWTAuth::parseToken()->getPayload()->get('sub');
            $data = User::findOrFail($user_id);
            
            $data->update([
                'name'  => $request->input('name'),
                'email' => $request->input('email'),
            ]);

            return response()->json([
                'data'      => $data,
                'success'   => true,
                'message'   => 'Data updated successfully'
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e)  
        {
            return response()->json([
                'data'      => [],
                'success'   => false,
                'message'   => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
        
    }

    public function updatePassword(Request $request)
    {
        try 
        {
            $user_id = JWTAuth::parseToken()->getPayload()->get('sub');
            $user = User::findOrFail($user_id);

            $this->validate($request, [
                'current_password' => 'required',
                'password' => 'required|string|min:6|confirmed'
            ]);

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'data'      => [],
                    'success'   => false,
                    'message'   => 'Current password is incorrect'
                ], JsonResponse::HTTP_UNAUTHORIZED);
            }

            if ($request->password !== $request->password_confirmation) {
                return response()->json([
                    'data'      => [],
                    'success'   => false,
                    'message'   => "Password and confirmation password do not match"
                ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
            }

            $user->password = Hash::make($request->password);
            $user->save();

            return response()->json([
                'data'      => $user,
                'success'   => true,
                'message'   => 'Password updated successfully'
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) 
        {
            return response()->json([
                'data'      => [],
                'success'   => false,
                'message'   => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
