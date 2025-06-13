<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\LocalUnit;

class SetLocalUnitFromRequest
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Tenta pelo header
        $identifier = $request->header('X-Local-Unit-Identifier');

        // 2. Se não veio pelo header, tenta extrair do host
        if (!$identifier) {
            $host = $request->getHost(); // Ex: central.localhost, localhost
            // Log::debug('Host recebido: ' . $host);

            $parts = explode('.', $host);

            // Se for localhost, ignora (não aceita sem subdomínio)
            if (count($parts) >= 2) {
                // Ex: central.localhost => ['central', 'localhost']
                $identifier = $parts[0];
            }
        }

        if (!$identifier) {
            return response()->json([
                'message' => 'Local unit identifier is required in the subdomain or header.'
            ], 400);
        }

        $localUnit = LocalUnit::where('identifier', $identifier)->first();

        if (!$localUnit) {
            return response()->json([
                'message' => 'Local unit not found for identifier: ' . $identifier
            ], 400);
        }

        app()->instance('currentLocalUnit', $localUnit);
        $request->attributes->set('currentLocalUnit', $localUnit);

        return $next($request);
    }
}
