<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Http\Resources\ActionResource;
use App\Http\Requests\ActionRequest;
use Illuminate\Http\Request;

class ActionController extends Controller
{
    public function index(Request $request)
    {
        $query = Action::query();

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

        return ActionResource::collection($query->paginate(50));
    }

    public function show(Action $action)
    {
        return new ActionResource($action);
    }

    public function storeOrUpdate(ActionRequest $request, ?Action $action = null)
    {
        $data = $request->validated();

        $action = $action
            ? tap($action)->update($data)
            : Action::create($data);

        return new ActionResource($action);
    }

    public function destroy(Action $action)
    {
        $action->delete();

        return response()->json(['message' => 'Action deletada com sucesso.'], 204);
    }
}
