<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
*
*/
class periodoAcademico extends Model
{
	//nombre de la tabla
	protected $table = 'periodo_academico';


	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = true;
    //lista blancas campos publicos
    protected $fillable = ['nombre_periodo','fecha_inicio','fecha_fin', 'external_periodo', 'estado', 'created_at', 'updated_at'];
    //lista negra campos que no quieren que se encuentren facilmente



}
 ?>
