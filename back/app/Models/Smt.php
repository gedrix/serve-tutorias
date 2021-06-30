<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
*
*/
class Smt extends Model
{
	//nombre de la tabla
	protected $table = 'smt';


	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = true;
    //lista blancas campos publicos
    protected $fillable = ['correo', 'clave', 'external_smt', 'created_at', 'updated_at', 'estado'];


}
 ?>
