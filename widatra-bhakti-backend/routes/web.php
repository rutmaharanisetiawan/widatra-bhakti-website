<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This backend is a pure JSON API consumed by the separately-deployed
| React/TanStack frontend (see routes/api.php for every endpoint). This
| file only exposes a minimal landing response so hitting the app root
| in a browser doesn't 404.
|
*/

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name'),
        'status' => 'ok',
        'api' => url('/api'),
    ]);
});
