<?php

namespace App\Http\Controllers;

use App\Models\State;
use App\Http\Resources\StateResource;

class StateController extends Controller
{
    public function index()
    {
        return StateResource::collection(State::orderBy('name')->get());
    }
}
