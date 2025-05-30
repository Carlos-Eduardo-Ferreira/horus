<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Http\Resources\ModuleResource;
use App\Http\Requests\ModuleRequest;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index(Request $request)
    {
        $query = Module::query();

        if ($request->name) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->identifier) {
            $query->where('identifier', 'like', '%' . $request->identifier . '%');
        }

        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');

        if (!in_array($sortBy, ['name', 'identifier', 'id'])) {
            $sortBy = 'name';
        }

        $query->orderBy($sortBy, $sortOrder === 'desc' ? 'desc' : 'asc');

        return ModuleResource::collection($query->paginate(50));
    }

    public function show(Module $module)
    {
        return new ModuleResource($module);
    }

    public function storeOrUpdate(ModuleRequest $request, ?Module $module = null)
    {
        $data = $request->validated();

        $module = $module
            ? tap($module)->update($data)
            : Module::create($data);

        return new ModuleResource($module);
    }

    public function destroy(Module $module)
    {
        $module->delete();

        return response()->json(['message' => 'Module deleted']);
    }
}
