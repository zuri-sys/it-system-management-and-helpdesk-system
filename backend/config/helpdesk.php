<?php

return [
    'admin_username' => env('ADMIN_USERNAME', 'itadmin'),
    'admin_email' => env('ADMIN_EMAIL', 'itadmin@example.com'),
    'admin_password' => env('ADMIN_PASSWORD', env('APP_ENV') === 'local' ? 'helpdesk123' : null),
];
