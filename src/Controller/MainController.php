<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    public function __construct()
    {

    }

    #[Route('/{route}', name: 'demo_max')]
    public function number(): Response
    {
        return $this->render('base.html.twig', array());
    }

    #[Route('/', name: 'home')]
    public function home(): Response
    {
        return $this->render('base.html.twig', array());
    }
}
