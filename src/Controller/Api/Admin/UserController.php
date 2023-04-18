<?php

namespace App\Controller\Api\Admin;

use App\Entity\Group;
use App\Entity\User;
use App\Repository\GroupRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/admin/users', name: 'admin_user_')]
class UserController extends AbstractController
{
    private $serializer;

    private $validator;

    private UserRepository $userRepository;

    private GroupRepository $groupRepository;

    private $entityManager;

    public function __construct(SerializerInterface    $serializer,
                                ValidatorInterface     $validator,
                                UserRepository         $userRepository,
                                GroupRepository        $groupRepository,
                                EntityManagerInterface $entityManager)
    {
        $this->serializer = $serializer;
        $this->validator = $validator;
        $this->userRepository = $userRepository;
        $this->groupRepository = $groupRepository;
        $this->entityManager = $entityManager;
    }

    /**
     * Proof of concept. The firewall already takes care of this.
     * @param $user
     * @return bool
     */
    private
    function userHasAdminRole($user): bool
    {
        if (!$user instanceof User) {
            return false;
        }

        foreach ($user->getRoles() as $role) {
            if ($role === 'ROLE_ADMIN') {
                return true;
            }
        }

        return false;
    }

    #[
        Route('', name: 'addUser', methods: 'POST')]
    public function addUser(Request $request): JsonResponse
    {
        if (!$this->userHasAdminRole($this->getUser())) {
            throw new AccessDeniedHttpException("Permission denied");
        }

        try {
            $user = $this->serializer->deserialize($request->getContent(), User::class, 'json');
        } catch (\Exception $exception) {
            throw new BadRequestHttpException('Please correct the supplied information.');
        }

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $json = $this->serializer->serialize(
                $errors,
                'json',
            );

            return JsonResponse::fromJsonString($json, 400);
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $json = $this->serializer->serialize(
            $user,
            'json',
            ['groups' => 'basic']
        );

        return JsonResponse::fromJsonString($json);
    }

    #[Route('', name: 'getUsers', methods: 'GET')]
    public function getUsers(Request $request): JsonResponse
    {
        $users = $this->userRepository->findAll();

        $json = $this->serializer->serialize(
            $users,
            'json',
            ['groups' => ['basic', 'admin']]
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
            ['groups' => ['basic', 'admin']]
        );

        return JsonResponse::fromJsonString($json);
    }

    #[Route('/{id}', name: 'deleteUser', methods: ['DELETE'])]
    public function deleteUser(User $user, Request $request): JsonResponse
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return JsonResponse::fromJsonString('');
    }

    #[Route('/{id}/add-to-group', name: 'addUserToGroup', methods: ['POST'])]
    public function addUserToGroup(User $user, Request $request): JsonResponse
    {
        if (!$request->query->has('groupId')) {
            throw new BadRequestHttpException('Group id missing.');
        }

        $group = $this->groupRepository->find($request->query->get('groupId'));
        if (!$group instanceof Group) {
            throw new BadRequestHttpException('Group not found.');
        }

        $user->addGroup($group);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse([]);
    }

    #[Route('/{id}/remove-from-group', name: 'removeUserFromGroup', methods: ['POST'])]
    public function removeUserFromGroup(User $user, Request $request): JsonResponse
    {
        if (!$request->query->has('groupId')) {
            throw new BadRequestHttpException('Group id missing.');
        }

        $group = $this->groupRepository->find($request->query->get('groupId'));
        if (!$group instanceof Group) {
            throw new BadRequestHttpException('Group not found.');
        }

        $user->removeGroup($group);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse([]);
    }
}
