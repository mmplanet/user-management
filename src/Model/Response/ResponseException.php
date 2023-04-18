<?php

namespace App\Model\Response;

class ResponseException
{
    public $message;

    public $status;
    public function  __construct($message, $status){
        $this->message = $message;
        $this->status = $status;
    }
}
