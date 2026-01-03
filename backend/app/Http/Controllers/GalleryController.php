<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try 
        {
            $perPage = $request->get('showing', 10);
            $search = $request->get('search', '');

            $data = Gallery::where(function($query) use ($search) {
                        $query->where('name_gallery', 'LIKE', "%{$search}%");
                        $query->orWhere('description_gallery', 'LIKE', "%{$search}%");
                    })->latest()->paginate($perPage);

            return response()->json([
                'data'      => $data,
                'success'   => true,
            ], JsonResponse::HTTP_OK);
        } 
        catch (Exception $e) 
        {
            return response()->json([
                'data'      => [],
                'success'   => false,
                'message'   => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'name_gallery'          => 'required',
            'description_gallery'   => '',
            'image'                 => 'image|mimes:jpg,jpeg,png|max:3072'
        ]);

        try 
        {
            if ($validatedData->fails()){
                return response()->json(['success' => false, 'message' => $validatedData->errors()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
            }

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '_' . $image->getClientOriginalName();
                $image->storeAs('public/images', $filename);
            }

            $data   = Gallery::create([
                'name_gallery'          => $request->input('name_gallery'),
                'description_gallery'   => $request->input('description_gallery'),
                'image'                 => $filename
            ]); 

            return response()->json([
                'data'      => $data,
                'success'   => true,
                'message'   => 'Data created successfully'
            ], JsonResponse::HTTP_CREATED);
        } 
        catch (Exception $e) 
        {
            return response()->json([
                'data'      => [],
                'success'   => false,
                'message'   => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);    
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try 
        {
            $data   = Gallery::findOrFail($id);

            return response()->json([
                'data'      => $data,
                'success'   => true,
            ], JsonResponse::HTTP_OK);
        } 
        catch (Exception $e) 
        {
            return response()->json([
                'data'      => [],
                'success'   => false,
                'message'   => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);    
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try 
        {
            $data   = Gallery::findOrFail($id);

            return response()->json([
                'data'      => $data,
                'success'   => true,
            ], JsonResponse::HTTP_OK);
        } 
        catch (Exception $e) 
        {
            return response()->json([
                'data'      => [],
                'success'   => false,
                'message'   => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);    
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try 
        {
            $data   = Gallery::findOrFail($id);
            $filename = $data->image;

            if ($request->hasFile('image')) {
                $validatedData = Validator::make($request->all(), [
                    'name_gallery'  => 'required',
                    'image'         => 'image|mimes:jpg,jpeg,png|max:3072'
                ]);
                
                if ($validatedData->fails()){
                    return response()->json(['success' => false, 'message' => $validatedData->errors()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
                }

                Storage::delete('public/images/' . $filename);
        
                $image = $request->file('image');
                $filename = time() . '_' . $image->getClientOriginalName();
                $image->storeAs('public/images', $filename);
            }

            $data->update([
                'name_gallery'          => $request->input('name_gallery'),
                'description_gallery'   => $request->input('description_gallery'),
                'image'                 => $filename
            ]);
        
            return response()->json([
                'data'      => $data,
                'success'   => true,
                'message'   => 'Data updated successfully'
            ], JsonResponse::HTTP_OK);
        } 
        catch (Exception $e) 
        {
            return response()->json([
                'data'      => [],
                'success'   => false,
                'message'   => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);    
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try 
        {
            $data   = Gallery::findOrFail($id);

            if ($data->image) {
                Storage::delete('public/images/' . $data->image);
            }

            $data->delete();

            return response()->json([
                'data'      => $data,
                'success'   => true,
                'message'   => 'Data deleted successfully'
            ], JsonResponse::HTTP_OK);
        } 
        catch (Exception $e) 
        {
            return response()->json([
                'data'      => [],
                'success'   => false,
                'message'   => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);    
        }
    }
}
