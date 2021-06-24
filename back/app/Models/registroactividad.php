<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
* 
*/
class registroactividad extends Model
{
	//nombre de la tabla
	protected $table = 'registroactividad';
    
	
	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = true;
    //lista blancas campos publicos
    protected $fillable = ['actividad','youtube','repositorio','informacion_presentada','estado','modalidad','id_reserva','external_ac','created_at','updated_at'];
    //lista negra campos que no quieren que se encuentren facilmente
    
    

     

}
 ?>