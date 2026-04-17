<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title inertia>{{ config('app.name', 'DustyPages') }}</title>
    @viteReactRefresh
    @vite(['resources/css/app.css'])
    @inertiaHead
    </head>
    <body>
        @inertia

        {{-- Load the JS after the Inertia root so the client can read the initial page payload --}}
        @vite(['resources/js/app.jsx'])
    </body>
</html>
