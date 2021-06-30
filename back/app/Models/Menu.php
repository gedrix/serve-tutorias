<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
*
*/
class Menu extends Model
{
	//nombre de la tabla
	protected $table = 'menu';


	//para saber si en la tabla usamos created_at y updated_at
    public $timestamps = false;
    //lista blancas campos publicos
    protected $fillable = ['nombre_menu','tipo_usuario', 'label', 'icono'];
    //lista negra campos que no quieren que se encuentren facilmente



}
 ?>
