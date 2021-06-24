<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
* 
*/
class estudiante extends Model
{
	//nombre de la tabla
	protected $table = 'estudiante';
    
	
	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = true;
    //lista blancas campos publicos
    protected $fillable = ['nombres', 'apellidos','ciclo','paralelo','id_usuario','estado','external_es','created_at','updated_at'];
    //lista negra campos que no quieren que se encuentren facilmente
    
    public function usuario(){

        return $this->belongsTo('App\Models\usuario', 'id_usuario');
     }

     public function reserva(){
        return $this->hasMany('App\Models\reserva', 'id_estudiante');

     }
}
 ?>