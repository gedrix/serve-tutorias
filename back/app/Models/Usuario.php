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
    //created_at => se crea solito cuando se hace un registro
    //update_at => se modifica solita cuando se hace modificación
    public $timestamps = true;

    //lista blancas campos publicos
    protected $fillable = ['correo', 'clave','tipoUsuario','estado','external_us','created_at','updated_at'];
    //lista negra campos que no quieren que se encuentren facilmente


    public function docente(){

        return $this->hasOne('App\Models\Docente', 'id_usuario');
    }

    public function estudiante(){

        return $this->hasOne('App\Models\Estudiante', 'id_usuario');
    }

}
 ?>
