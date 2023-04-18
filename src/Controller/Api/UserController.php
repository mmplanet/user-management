<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/users', name: 'user_')]
class UserController extends AbstractController
{
    private $serializer;

    private UserRepository $userRepository;

    private EntityManagerInterface $entityManager;

    public function __construct(SerializerInterface    $serializer,
                                UserRepository         $userRepository,
                                EntityManagerInterface $entityManager
    )
    {
        $this->serializer = $serializer;
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/{id}', name: 'getUserById', methods: ['GET'])]
    public function getUserById(string $id): JsonResponse
    {
        $serializationGroups = ['basic'];
        if ($id === 'me') {
            $user = $this->getUser();
            $serializationGroups[] = 'self';
        } else {
            $user = $this->userRepository->find($id);
        }

        $json = $this->serializer->serialize(
            $user,
            'json',
            ['groups' => $serializationGroups]
        );

        return JsonResponse::fromJsonString($json);
    }

    #[Route('/{id}', name: 'updateUser', methods: ['PUT'])]
    public function updateUser(User $user, Request $request): JsonResponse
    {
        try {
            /** @var User $updatedUser */
            $updatedUser = $this->serializer->deserialize(
                $request->getContent(),
                User::class,
                'json',
                ['groups' => ['update']]
            );
        } catch (\Exception $exception) {
            throw new BadRequestHttpException('Please correct the supplied information.');
        }

        $user->setFirstName($updatedUser->getFirstName());
        $user->setLastName($updatedUser->getLastName());

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $json = $this->serializer->serialize(
            $user,
            'json',
            ['groups' => 'basic']
        );

        return JsonResponse::fromJsonString($json);
    }
}
