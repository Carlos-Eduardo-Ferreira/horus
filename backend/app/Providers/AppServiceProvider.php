<?php

namespace App\Providers;

use App\Http\Middleware\SetLocalUnitFromRequest;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app['router']->pushMiddlewareToGroup('api', SetLocalUnitFromRequest::class);
    }
}
