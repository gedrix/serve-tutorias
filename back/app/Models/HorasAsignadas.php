<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
*
*/
class HorasAsignadas extends Model
{
	//nombre de la tabla
	protected $table = 'horas_asignadas';


	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = true;
    //lista blancas campos publicos
    protected $fillable = ['horas_academicas','horas_titulacion','estado','id_docente','id_periodo_acdemico','external_ha','created_at','updated_at'];
    //lista negra campos que no quieren que se encuentren facilmente


}
 ?>
