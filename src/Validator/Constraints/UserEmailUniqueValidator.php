<?php

namespace App\Validator\Constraints;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

#[\Attribute]
class UserEmailUniqueValidator extends ConstraintValidator
{
    private $userRepository;

    public function __construct(
        UserRepository $userRepository
    )
    {
        $this->userRepository = $userRepository;
    }

    public function validate($value, Constraint $constraint): void
    {
        $user = $this->userRepository->findOneBy(['email' => $value]);

        if($user instanceof User){
            $this->context->buildViolation($constraint->message)
                ->setParameter('%email_address%', $value)
                ->addViolation();
        }
    }
}
