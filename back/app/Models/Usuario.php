<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
*
*/
class Usuario extends Model
{
	//nombre de la tabla
	protected $table = 'usuario';


	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = true;
    //lista blancas campos publicos
    protected $fillable = ['correo', 'clave','tipoUsuario','estado','external_us','created_at','updated_at'];
    //lista negra campos que no quieren que se encuentren facilmente


    public function docente(){

        return $this->hasOne('App\Models\docente', 'id_usuario');
    }

    public function estudiante(){

        return $this->hasOne('App\Models\estudiante', 'id_usuario');
    }

}
 ?>
