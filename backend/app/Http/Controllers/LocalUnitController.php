<?php

namespace App\Http\Controllers;

use App\Models\LocalUnit;
use App\Http\Resources\LocalUnitResource;
use App\Http\Requests\LocalUnitRequest;
use Illuminate\Http\Request;

class LocalUnitController extends Controller
{
    public function index(Request $request)
    {
        $query = LocalUnit::with('state');
        
        if ($request->name) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        
        if ($request->identifier) {
            $query->where('identifier', 'like', '%' . $request->identifier . '%');
        }
        
        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }
        
        if ($request->state_id) {
            $query->where('state_id', $request->state_id);
        }
        
        if ($request->neighborhood) {
            $query->where('neighborhood', 'like', '%' . $request->neighborhood . '%');
        }
        
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        
        if (!in_array($sortBy, ['name', 'identifier', 'city', 'neighborhood', 'id'])) {
            $sortBy = 'name';
        }
        
        $query->orderBy($sortBy, $sortOrder === 'desc' ? 'desc' : 'asc');
        
        return LocalUnitResource::collection($query->paginate(50));
    }

    public function show(LocalUnit $localUnit)
    {
        $localUnit->load('state');
        return new LocalUnitResource($localUnit);
    }

    public function storeOrUpdate(LocalUnitRequest $request, ?LocalUnit $localUnit = null)
    {
        $data = $request->validated();

        $localUnit = $localUnit
            ? tap($localUnit)->update($data)
            : LocalUnit::create($data);

        $localUnit->load('state');
        return new LocalUnitResource($localUnit);
    }

    public function destroy(LocalUnit $localUnit)
    {
        $localUnit->delete();

        return response()->json(['message' => 'LocalUnit deleted']);
    }
}
