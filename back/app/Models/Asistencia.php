<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
*
*/
class Asistencia extends Model
{
	//nombre de la tabla
	protected $table = 'asistencia';


	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = false;
    //lista blancas campos publicos
    protected $fillable = ['id_reserva','estado','id_estudiante'];
    //lista negra campos que no quieren que se encuentren facilmente



}
 ?>
