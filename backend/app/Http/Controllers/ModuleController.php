<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Http\Resources\ModuleResource;
use App\Http\Requests\ModuleRequest;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * Lista todas as modules paginadas e ordenadas por nome.
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $query = Module::query();
        
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
        
        $modules = $query->paginate(50);
        
        return ModuleResource::collection($modules);
    }

    /**
     * Exibe uma module específica.
     *
     * @param Module $module
     * @return ModuleResource
     */
    public function show(Module $module)
    {
        return new ModuleResource($module);
    }

    /**
     * Cria ou atualiza uma module baseado na presença de um modelo Module.
     *
     * @param ModuleRequest $request
     * @param Module|null $module
     * @return ModuleResource
     */
    public function storeOrUpdate(ModuleRequest $request, ?Module $module = null)
    {
        $validated = $request->validated();

        if ($module) {
            $module->update($validated);
        } else {
            $module = Module::create($validated);
        }

        return new ModuleResource($module);
    }

    /**
     * Remove uma module.
     *
     * @param Module $module
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Module $module)
    {
        $module->delete();

        return response()->json(['message' => 'Module deleted']);
    }
}
