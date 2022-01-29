<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Titulacion extends Model
{
	protected $table = 'titulacion';
    public $timestamps = true;

    protected $fillable = ['tema','estudiante','pareja','id_docente','estado','external_titulacion','created_at','updated_at'];

}
