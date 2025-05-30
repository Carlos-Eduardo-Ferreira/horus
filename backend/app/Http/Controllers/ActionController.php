<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Http\Resources\ActionResource;
use App\Http\Requests\ActionRequest;
use Illuminate\Http\Request;

class ActionController extends Controller
{
    /**
     * Lista todas as actions paginadas e ordenadas por nome.
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $query = Action::query();
        
        // Aplicar filtros se existirem
        if ($request->has('name') && $request->name) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        
        if ($request->has('identifier') && $request->identifier) {
            $query->where('identifier', 'like', '%' . $request->identifier . '%');
        }
        
        // Aplicar ordenação se os parâmetros forem fornecidos
        if ($request->has('sort_by') && $request->has('sort_order')) {
            $sortBy = $request->sort_by;
            $sortOrder = $request->sort_order === 'desc' ? 'desc' : 'asc';
            
            // Apenas permite ordenar por colunas válidas na tabela
            if (in_array($sortBy, ['name', 'identifier', 'id'])) {
                $query->orderBy($sortBy, $sortOrder);
            } else {
                // Ordenação padrão
                $query->orderBy('name', 'asc');
            }
        } else {
            // Ordenação padrão quando não há parâmetros de ordenação
            $query->orderBy('name', 'asc');
        }
        
        $actions = $query->paginate(50);
        
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
