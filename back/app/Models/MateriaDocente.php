<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class MateriaDocente extends Model
{
	protected $table = 'materia_docente';
    public $timestamps = true;

    protected $fillable = ['id_materia','id_docente','estado','id_periodo', 'external_md'];

}
