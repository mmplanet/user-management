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
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/admin/groups', name: 'admin_group_')]
class GroupController extends AbstractController
{
    private $serializer;

    private $validator;

    private GroupRepository $groupRepository;

    private UserRepository $userRepository;

    private $entityManager;

    public function __construct(SerializerInterface    $serializer,
                                ValidatorInterface     $validator,
                                GroupRepository        $groupRepository,
                                UserRepository         $userRepository,
                                EntityManagerInterface $entityManager)
    {
        $this->serializer = $serializer;
        $this->validator = $validator;
        $this->groupRepository = $groupRepository;
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
    }


    #[Route('', name: 'admin_addGroup', methods: 'POST')]
    public function addUser(Request $request): JsonResponse
    {
        try {
            $group = $this->serializer->deserialize($request->getContent(), Group::class, 'json');
        } catch (\Exception $exception) {
            throw new BadRequestHttpException('Please correct the supplied information.');
        }

        $errors = $this->validator->validate($group);
        if (count($errors) > 0) {
            $json = $this->serializer->serialize(
                $errors,
                'json',
            );

            return JsonResponse::fromJsonString($json, 400);
        }

        $this->entityManager->persist($group);
        $this->entityManager->flush();

        $json = $this->serializer->serialize(
            $group,
            'json',
            ['groups' => ['basic', 'admin']]
        );

        return JsonResponse::fromJsonString($json);
    }

    #[Route('', name: 'admin_getGroups', methods: 'GET')]
    public function getGroups(Request $request): JsonResponse
    {
        if ($request->query->has('userId')) {
            $user = $this->userRepository->find($request->query->get('userId'));
            if ($user instanceof User) {
                $groups = $user->getGroups();
            } else {
                $groups = [];
            }
        } else {
            $groups = $this->groupRepository->findAll();
        }

        foreach ($groups as $key => $group) {
            $groups[$key]->setMemberCount(count($group->getUsers()));
        }

        $json = $this->serializer->serialize(
            $groups,
            'json',
            ['groups' => ['basic', 'admin']]
        );

        return JsonResponse::fromJsonString($json);
    }

    #[Route('/{id}', name: 'deleteGroup', methods: ['DELETE'])]
    public function deleteGroup(Group $group, Request $request): JsonResponse
    {
        if (count($group->getUsers()) > 0) {
            throw new BadRequestHttpException("Group still has users.");
        }

        $this->entityManager->remove($group);
        $this->entityManager->flush();

        return JsonResponse::fromJsonString('');
    }
}
