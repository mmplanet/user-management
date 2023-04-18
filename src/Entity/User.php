<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UuidGenerator;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Validator\Constraints as AppAssert;


#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: 'user')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    #[Groups(['basic', 'register', 'self'])]
    private $id;

    #[ORM\Column(type: 'string', name: 'email')]
    #[Groups(['register', 'basic', 'register-post', 'self'])]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[AppAssert\UserEmailUnique]
    private $email;

    #[ORM\Column(type: 'string', name: 'password', nullable: true)]
    #[Groups(['register-post', 'update'])]
    #[Assert\NotBlank]
    private $password;

    #[Groups(['register'])]
    private $jwtToken;

    #[ORM\Column(type: 'string', name: 'first_name', nullable: true)]
    #[Groups(['basic', 'self', 'update', 'register', 'register-post'])]
    #[Assert\NotBlank]
    private $firstName;

    #[ORM\Column(type: 'string', name: 'last_name', nullable: true)]
    #[Groups(['basic', 'self', 'update', 'register', 'register-post'])]
    #[Assert\NotBlank]
    private $lastName;

    #[ORM\Column(type: 'json', name: 'roles', nullable: true)]
    #[Groups(['admin', 'self'])]
    private $roles;

    #[ORM\JoinTable(name: 'user_groups')]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id')]
    #[ORM\InverseJoinColumn(name: 'group_id', referencedColumnName: 'id')]
    #[ORM\ManyToMany(targetEntity: Group::class, inversedBy: 'users')]
    #[Groups(['admin', 'self'])]
    private $groups;

    #[ORM\Column(type: 'datetime', name: 'registered_at', nullable: true)]
    #[Groups(['register', 'basic', 'self'])]
    private $registeredAt;

    #[ORM\Column(type: 'datetime', name: 'verified_at', nullable: true)]
    #[Groups(['basic', 'self'])]
    private $verifiedAt;

    public function __construct()
    {
        $this->groups = new ArrayCollection();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail($email): void
    {
        $this->email = $email;
    }

    /**
     * @return mixed
     */
    public function getPassword(): null|string
    {
        return $this->password;
    }

    /**
     * @param mixed $password
     */
    public function setPassword($password): void
    {
        $this->password = $password;
    }

    /**
     * @return mixed
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * @param mixed $firstName
     */
    public function setFirstName($firstName): void
    {
        $this->firstName = $firstName;
    }

    /**
     * @return mixed
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * @param mixed $lastName
     */
    public function setLastName($lastName): void
    {
        $this->lastName = $lastName;
    }

    /**
     * @return mixed
     */
    public function getRegisteredAt()
    {
        return $this->registeredAt;
    }

    /**
     * @param mixed $registeredAt
     */
    public function setRegisteredAt($registeredAt): void
    {
        $this->registeredAt = $registeredAt;
    }

    /**
     * @return mixed
     */
    public function getVerifiedAt()
    {
        return $this->verifiedAt;
    }

    /**
     * @param mixed $verifiedAt
     */
    public function setVerifiedAt($verifiedAt): void
    {
        $this->verifiedAt = $verifiedAt;
    }

    public function eraseCredentials()
    {
        // TODO: Implement eraseCredentials() method.
    }

    public function getUserIdentifier(): string
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getJwtToken()
    {
        return $this->jwtToken;
    }

    /**
     * @param mixed $jwtToken
     */
    public function setJwtToken($jwtToken): void
    {
        $this->jwtToken = $jwtToken;
    }

    /**
     * @return null
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param mixed $roles
     */
    public function setRoles($roles): void
    {
        $this->roles = $roles;
    }

    public function addRole($role): void
    {
        $this->roles[] = $role;
    }

    /**
     * @return ArrayCollection
     */
    public function getGroups()
    {
        return $this->groups;
    }

    public function addGroup(Group $group): void
    {
        if ($this->groups->contains($group)) {
            return;
        }
        $group->addUser($this);
        $this->groups[] = $group;
    }

    public function removeGroup(Group $group): void
    {
        if (!$this->groups->contains($group)) {
            return;
        }
        $this->groups->removeElement($group);
        $group->removeUser($this);
    }
}
