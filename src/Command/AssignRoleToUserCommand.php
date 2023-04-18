<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'user:assign-role',
    description: 'Assigns role to user.',
    hidden: false,
    aliases: ['user:add-role']
)]
class AssignRoleToUserCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('email', null, InputOption::VALUE_REQUIRED, 'The email of the user.');
        $this->addOption('role', null, InputOption::VALUE_REQUIRED, 'The role to assign to the user.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $email = $input->getOption('email');
        $role = $input->getOption('role');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \Exception('user not found.');
        }

        $userRepository = $this->entityManager->getRepository(User::class);
        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user instanceof User) {
            throw new \Exception('user not found.');
        }

        $user->addRole($role);

        $this->entityManager->persist($user);
        $this->entityManager->flush($user);

        return 1;
    }
}
