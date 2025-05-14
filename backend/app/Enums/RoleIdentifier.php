<?php

namespace App\Enums;

enum RoleIdentifier: string
{
    case MASTER = 'master';
    case ADMIN = 'admin';
    case USER = 'user';
    case CONSUMER = 'consumer';
    case COMPANY = 'company';
}
