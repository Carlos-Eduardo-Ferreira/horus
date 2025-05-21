<?php

namespace App\Enums;

enum ActionIdentifier: string
{
    case ACCESS = 'access';
    case CREATE = 'create';
    case EDIT = 'edit';
    case DELETE = 'delete';
}
