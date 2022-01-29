<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Estudiante;
use App\Models\Docente;
use App\Models\Diastutoria;
use App\Models\Reserva;
use App\Models\Materia;
use App\Models\Menu;
use App\Models\Smt;
use App\Models\MateriaDocente;
use App\Models\PeriodoAcademico;
use App\Models\HorasAsignadas;
use Illuminate\Http\Request;

class HorasAsignadasController extends Controller
{
    private $estado = 400;
    private $datos = [];

    public function registroHorasAsignadasDocente(Request $request){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            $docente = docente::where("external_do", "=", $data["externalDocente"])->first();
            if ($docente) {
                

                $VerExiste = HorasAsignadas::where("id_docente", "=", $docente->id)
                                            ->where("estado", "=", 1)
                                            ->first();
                if(!$VerExiste){
                    $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
                    $horaAsignada = new HorasAsignadas();
                    $horaAsignada->horas_academicas = $data["horas_academicas"];
                    $horaAsignada->dias_academicas = $data["dias_academicas"];
                    $horaAsignada->horas_titulacion = $data["horas_titulacion"];
                    $horaAsignada->dias_titulacion = $data["dias_titulacion"];
                    $horaAsignada->estado = 1;
                    $horaAsignada->id_docente = $docente->id;
                    $horaAsignada->id_periodo_academico = $periodo->id;
                    $horaAsignada->external_ha ="Ha" . Utilidades\UUID::v4();
                    $horaAsignada->save();
                    $datos['data'] = [
                        "external_horas_asignadas" => $horaAsignada->external_ha
                    ];
                    self::estadoJson(200, true, 'Registro exitoso');
                }else{
                     self::estadoJson(400, false, 'Ya ha registrado las horas asignadas');
                }
                
            }
            
        }
        return response()->json($datos, $estado);
    }
    //editar
    public function editaroHorasAsignadasDocente(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();
        if ($data["horas_academicas"] >= 0 && $data["horas_titulacion"]>= 0) {

            $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
            $docenteObj = docente::where("external_do", $data["externalDocente"])->first();

            $editar = HorasAsignadas::where("id_docente", $docenteObj->id)
                                    ->where("id_periodo_academico", $periodo->id)
                                    ->first();

            $editarHorasAsignadasDocente = HorasAsignadas::find($editar->id);
            $editarHorasAsignadasDocente->horas_academicas = $data["horas_academicas"];
            $editarHorasAsignadasDocente->dias_academicas = $data["dias_academicas"];
            $editarHorasAsignadasDocente->horas_titulacion = $data["horas_titulacion"];
            $editarHorasAsignadasDocente->dias_titulacion = $data["dias_titulacion"];
            $editarHorasAsignadasDocente->save();
            self::estadoJson(200, true, 'Se han actualizado las horas asignadas');
        }else{
            self::estadoJson(400, true, 'Las horas asginadas no pueden ser menor a 0');
        }


        return response()->json($datos, $estado);
    }
    //listar horas asignadas docente
    //recibe external docente
    public function listarHoraAsignadaDocente($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $docente = docente::where("external_do", $external_id)->first();
        $listaHoraAsignada = HorasAsignadas::where("id_docente", $docente->id)
                            ->where("horas_asignadas.estado", 1)
                            ->get();

         foreach ($listaHoraAsignada as $value) {
            $datos['data'][] = [
                            "horas_academicas" => $value->horas_academicas,
                            "dias_academicas" => $value->dias_academicas,
                            "horas_titulacion" => $value->horas_titulacion,
                            "dias_titulacion" => $value->dias_titulacion,
                            "external_horas_asignadas" => $value->external_ha,
				"estado" => $value->estado,

                            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    //dar de baja
    public function eliminaroHorasAsignadasDocente($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $editar = HorasAsignadas::where("external_ha", $external_id)->first();

        $editarHorasAsignadasDocente = HorasAsignadas::find($editar->id);
        $editarHorasAsignadasDocente->estado = 0;
        $editarHorasAsignadasDocente->save();
        self::estadoJson(200, true, 'Horas asignadas eliminada');

        return response()->json($datos, $estado);
    }

     public function diasAsignadosAD4(Request $request, $external_id){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();

        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();

       $horas = HorasAsignadas::where("id_periodo_academico", $periodo->id)
                        ->where("estado", 1)
                        ->first();

        $datos['data'][] = [
            "dias_academicas" => $horas->dias_academicas,

        ];
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function diasAsignadosAD8(Request $request, $external_id){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();

        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();

       $horas = HorasAsignadas::where("id_periodo_academico", $periodo->id)
                        ->where("estado", 1)
                        ->first();

        $datos['data'][] = [
            "dias_titulacion" => $horas->dias_titulacion,
            "horas_titulacion" => $horas->horas_titulacion,
        ];
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    private static function estadoJson($estadoPeticion, $satisfactorio, $mensaje)
    {
        global $estado, $datos;
        $estado = $estadoPeticion;
        $datos['sucess'] = $satisfactorio;
        $datos['mensaje'] = $mensaje;
    }

    private static function iniciarObjetoJSon(){
        global $estado, $datos;
        $datos['data'] = null;
        $datos['sucess'] = 'false';
        $datos['mensaje'] = '';
    }
}
