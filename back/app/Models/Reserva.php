<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
*
*/
class Reserva extends Model
{
	//nombre de la tabla
	protected $table = 'reservatutoria';


	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = true;
    //lista blancas campos publicos
    protected $fillable = ['modalidad','fecha','tema_tutoria','observacion','id_docente','id_estudiante','dia_tutoria','hora_tutoria','hora_fin','tipo_tutoria','estado','estado_encuesta','external_rt','created_at','updated_at', 'mensaje', 'id_periodo_academico', 'id_materia'];
    //lista negra campos que no quieren que se encuentren facilmente

    public function estudiante(){

        return $this->belongsTo('App\Models\Estudiante', 'id_estudiante');
     }



}
 ?>
