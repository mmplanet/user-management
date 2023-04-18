<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Util\ResponseUtil;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ApiLoginController extends AbstractController
{
    private $passwordHasher;
    private $entityManager;

    private $serializer;
    private $jwtManager;

    private $userRepository;

    private $validator;

    public function __construct(
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface      $entityManager,
        SerializerInterface         $serializer,
        JWTTokenManagerInterface $jwtManager,
        UserRepository $userRepository,
        ValidatorInterface $validator
    )
    {
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
        $this->jwtManager = $jwtManager;
        $this->userRepository = $userRepository;
        $this->validator = $validator;
    }

    #[Route('/register', name: 'api_register', methods: 'POST')]
    public function register(Request $request)
    {
        /** @var User $user */
        $user = $this->serializer->deserialize($request->getContent(), User::class, 'json', ['groups' => ['register-post']]);

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $json = $this->serializer->serialize(
                $errors,
                'json',
            );

            return JsonResponse::fromJsonString($json, 400);
        }

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $user->getPassword()
        );
        $user->setPassword($hashedPassword);
        $user->setRegisteredAt(new \DateTime());

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $user->setJwtToken($this->jwtManager->create($user));

        return new Response($this->serializer->serialize($user, 'json', ['groups' => ['register']]));
    }

    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(#[CurrentUser] ?User $user): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/ApiLoginController.php',
        ]);
    }
}
