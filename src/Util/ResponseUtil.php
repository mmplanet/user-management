<?php

namespace App\Util;

use Symfony\Component\HttpFoundation\JsonResponse;

class ResponseUtil
{
    static function getJsonResponseHttpException($text, $statusCode)
    {
        return new JsonResponse(
            [
                'message' => $text,
                'statusCode' => $statusCode
            ],
            $statusCode
        );
    }
}
