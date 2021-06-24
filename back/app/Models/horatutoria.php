<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class horatutoria extends Model
{
	//nombre de la tabla
	protected $table = 'horastutoria';
    
	
	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = true;

    //lista blancas campos publicos
    protected $fillable = ['hora_inicio','hora_fin','tipo_tutoria','id_diastutoria','estado','external_h','created_at','updated_at'];
    //lista negra campos que no quieren que se encuentren facilmente
    

    public function horas(){

        return $this->belongsTo('App\Models\diastutoria', 'id_diastutoria');
     }


}
 ?>