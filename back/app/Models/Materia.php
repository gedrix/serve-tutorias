<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Materia extends Model
{
	protected $table = 'materia';
    public $timestamps = true;

    protected $fillable = ['materia','estado','external_ma','created_at','updated_at'];

}
