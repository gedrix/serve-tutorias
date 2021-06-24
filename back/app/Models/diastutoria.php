<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class diastutoria extends Model
{
	//nombre de la tabla
	protected $table = 'diastutoria';
    
	
	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = true;

    //lista blancas campos publicos
    protected $fillable = ['dia_semana','id_docente','estado','external_dh','created_at','updated_at'];
    //lista negra campos que no quieren que se encuentren facilmente
    

    public function docente(){

        return $this->belongsTo('App\Models\docente', 'id_docente');
     }

     public function horas(){

        return $this->hasMany('App\Models\horatutoria', 'id_diastutoria');
     }


}
 ?>