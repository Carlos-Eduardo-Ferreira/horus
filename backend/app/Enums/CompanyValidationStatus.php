<?php

namespace App\Enums;

enum CompanyValidationStatus: string
{
    case NOT_SUBMITTED = 'not_submitted';
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}
