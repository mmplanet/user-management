<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class UserEmailUnique extends Constraint
{
    public $message = "The email '%email_address%' is already in use.";
    public function validatedBy()
    {
        return get_class($this).'Validator';
    }
}
