<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
*
*/
class Encuestatutoria extends Model
{
	//nombre de la tabla
	protected $table = 'encuestatutoria';


	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = true;
    //lista blancas campos publicos
    protected $fillable = ['fecha_registro','satisfaccion'.'aclaro_sus_dudas','tiempo_necesario','observacion','estado','external_et','id_estudiante','id_reserva','created_at','updated_at'];
    //lista negra campos que no quieren que se encuentren facilmente



}
 ?>
