<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Http\Resources\ActionResource;
use App\Http\Requests\ActionRequest;

class ActionController extends Controller
{
    /**
     * Lista todas as actions paginadas e ordenadas por nome.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $actions = Action::orderBy('name', 'asc')->paginate(100);
        return ActionResource::collection($actions);
    }

    /**
     * Exibe uma action específica.
     *
     * @param Action $action
     * @return ActionResource
     */
    public function show(Action $action)
    {
        return new ActionResource($action);
    }

    /**
     * Cria ou atualiza uma action baseado na presença de um modelo Action.
     *
     * @param ActionRequest $request
     * @param Action|null $action
     * @return ActionResource
     */
    public function storeOrUpdate(ActionRequest $request, ?Action $action = null)
    {
        $validated = $request->validated();

        if ($action) {
            $action->update($validated);
        } else {
            $action = Action::create($validated);
        }

        return new ActionResource($action);
    }

    /**
     * Remove uma action.
     *
     * @param Action $action
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Action $action)
    {
        $action->delete();

        return response()->json(['message' => 'Action deleted']);
    }
}
