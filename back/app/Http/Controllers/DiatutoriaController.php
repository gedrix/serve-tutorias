<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\Diastutoria;
use App\Models\Horatutoria;
use App\Models\Reserva;
use App\Models\Materia;
use App\Models\MateriaDocente;
use App\Models\PeriodoAcademico;
use Illuminate\Http\Request;
use PhpOption\Some;

class DiatutoriaController extends Controller
{
    private $estado = 400;
    private $datos = [];


    //registrar periodo
    

    public function registrarPeriodo(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {

            $data  = $request->json()->all();
            $periodo_activo = periodoAcademico::where("estado",  1)->first();
            if ($periodo_activo) {
                self::estadoJson(300, true, 'Ya existe un periodo vigente');
                return response()->json($datos, $estado);
            }else{
                 $periodo =  new periodoAcademico();
                $periodo->nombre_periodo = $data["nombrePeriodo"];
                $periodo->fecha_inicio = $data["fechaInicio"];
                $periodo->fecha_fin = $data["fechaFin"];
                $periodo->estado = 1;
                $periodo->external_periodo = "Pe" . Utilidades\UUID::v4();
                $periodo->save();
                self::estadoJson(200, true, '');
                return response()->json($datos, $estado);
            }
           
        }
    }

    public function listarPeriodo()
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        $periodos = periodoAcademico::where("estado", "<",  2)->get();
        foreach ($periodos as $periodo) {
            $datos['data'][] = [
                "nombrePeriodo" => $periodo->nombre_periodo,
                "fechaInicio" => $periodo->fecha_inicio,
                "fechaFin" => $periodo->fecha_fin,
                "estado" => $periodo->estado,
                "externalPeriodo" => $periodo->external_periodo
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function eliminarPeriodo($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        $periodo = periodoAcademico::where("external_periodo", $external_id)->first();
        $periodoObj = periodoAcademico::find($periodo->id);

        $periodoObj->estado = 0;
        $periodoObj->save();
        self::estadoJson(200, true, 'Periodo Eliminado');
        return response()->json($datos, $estado);
    }

    public function editarPeriodo(Request $request, $external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();
        $periodo = periodoAcademico::where("external_periodo", $external_id)->first();
        $periodoObj = periodoAcademico::find($periodo->id);

        $periodoObj->nombre_periodo = $data['nombrePeriodo'] ? $data['nombrePeriodo']: $periodo ->nombre_periodo;
        $periodoObj->fecha_inicio = $data['fechaInicio'] ? $data['fechaInicio']: $periodo->fecha_inicio ;
        $periodoObj->fecha_fin = $data['fechaFin'] ? $data['fechaFin']: $periodo->fecha_fin ;
        $periodoObj->save();
        self::estadoJson(200, true, 'Actualizacion de periodo');
        return response()->json($datos, $estado);
    }

    public function actualizarHora(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            $horaObj = horatutoria::where("external_h", $data["externalHora"])->first();

            $hora = horatutoria::find($horaObj->id);

            $hora->hora_inicio = $data["horaInicio"];
            $hora->hora_fin = $data["horaFin"];
            $hora->tipo_tutoria = $data["tipoTutoria"];
            $hora->save();
            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        }
    }

    public function eliminarHora(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            $horaObj = horatutoria::where("external_h", $data["externalHora"])->first();

            $hora = horatutoria::find($horaObj->id);
            $hora->estado = 0;
            $hora->save();

            $cont = horatutoria::where('id_diastutoria', $horaObj->id_diastutoria)
                                ->where('estado',1)
                                ->get();
            if (count($cont) ==0) {
                $dia = diastutoria::find($horaObj->id_diastutoria);
                $dia->estado =0;
                $dia->save();
            }

            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        }
    }



    public function eliminarDiaHora(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        if ($request->json()) {
            $data = $request->json()->all();
            $diaObj = diastutoria::where("external_dh", $data["externalDia"])->first();

            $dia = diastutoria::find($diaObj->id);
            $dia->estado = 0;
            $dia->save();

            $horaObj = horatutoria::where("id_diastutoria", $diaObj->id)
                                    ->update(['estado' => 0]);

            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        }
    }


    // public function listarDiaHoraDocente($external_id)
    // {
    //     global $estado, $datos;
    //     self::iniciarObjetoJSon();
    //     $docente = docente::where("external_do", $external_id)->first();

    //     if ($docente) {

    //         $diasTutoria = diastutoria::select('dia_semana', 'hora_inicio', 'hora_fin', 'tipo_tutoria')
    //             ->where("id_docente", $docente->id)
    //             ->where("diastutoria.estado", 1)
    //             ->join('horastutoria', 'diastutoria.id', '=', 'horastutoria.id_diastutoria')
    //             ->get() //dias
    //             ->groupBy("dia_semana");

    //         $arrayObjet = array();

    //         foreach ($diasTutoria as $key => $value) {
    //             $objetoArray[] = [
    //                 'dia' => $key,
    //                 'horario' => $diasTutoria[$key],
    //             ];
    //             $arrayObjet = $objetoArray;
    //         }

    //         $datos['data'] = [
    //             'horarios' => $arrayObjet,

    //         ];

    //         self::estadoJson(200, true, '');

    //         return response()->json($datos, $estado);
    //     } else {
    //         self::estadoJson(400, false, 'Datos Incorrectos');
    //         return response()->json($datos, $estado);
    //     }
    // }

    public function listarDiaHoraDocente($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
         $docente = docente::where("external_do", $external_id)->first();
        $diasTutoria = diastutoria::where('id_docente', $docente->id)
                                    ->where("diastutoria.estado", 1)
                                    //->join('horastutoria', 'diastutoria.id', 'horastutoria.id_diastutoria')
                                    //->where('horastutoria.estado', 1)
                                    ->get();

        $datos = array();
        foreach ($diasTutoria as $dias) {
            $datos['data'][]=[
                "dia" => $dias->dia_semana,
                "externalDia" => $dias->external_dh,
                "horaDia" => self::getHora($dias->id)
            ];
        }

      // $datos['data'] =$diasTutoria;
        self::estadoJson(200, true, '');

        return response()->json($datos, $estado);


    }

    private function getHora($idDia)
    {
        $obtenerHora = horatutoria::where('id_diastutoria', $idDia)
                                    ->where('estado',1)
                                    ->get();

        foreach ($obtenerHora as $hora) {
            $data[]=[
                "horaInicio" => $hora->hora_inicio,
                "horaFin" => $hora->hora_fin,
                "tipoTutoria" => $hora->tipo_tutoria,
                "externalHora" => $hora->external_h,


            ];
        }
        return $data;
    }

    //registro de horas de tutorias
    // public function registroDiaHoraTutoria(Request $request, $external_id)
    // {
    //     global $estado, $datos;
    //     self::iniciarObjetoJSon();
    //     if ($request->json()) {
    //         $data = $request->json()->all();
    //         $docente = docente::where("external_do", $external_id)->first();
    //         if ($docente) {
    //             $dias = new diastutoria();
    //             $dias->dia_semana = $data["diaSemana"];
    //             $dias->id_docente = $docente->id;
    //             $dias->estado = 1;
    //             $dias->external_dh = "Di" . Utilidades\UUID::v4();
    //             $dias->save();

    //             $listaHoras = $data["horaTutoria"];

    //             foreach ($listaHoras as $value) {
    //                 $hora = new horatutoria();

    //                 $hora->hora_inicio = $value["horaInicio"];
    //                 $hora->hora_fin = $value["horaFin"];
    //                 $hora->tipo_tutoria = $value["tipoTutoria"];
    //                 $hora->id_diastutoria = $dias->id;
    //                 $hora->estado = 1;
    //                 $hora->external_h = "Di" . Utilidades\UUID::v4();
    //                 $hora->save();
    //             }
    //             self::estadoJson(200, true, '');

    //             return response()->json($datos, $estado);
    //         }
    //     }
    // }

    public function registroDiaHoraTutoria(Request $request, $external_id)
    {


        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            $docente = docente::where("external_do", $external_id)->first();

            $diasTutoria = diastutoria::where('id_docente', $docente->id)
                                    ->where("diastutoria.estado", 1)
                                    ->where("dia_semana", strtoupper($data["diaSemana"]))
                                    ->first();

            if ($diasTutoria) {
                $listaHoras = $data["horaTutoria"];
                foreach ($listaHoras as $value) {
                    $hora = new horatutoria();
                    $hora->hora_inicio = $value["horaInicio"];
                    $hora->hora_fin = $value["horaFin"];
                    $hora->tipo_tutoria = $value["tipoTutoria"];
                    $hora->id_diastutoria = $diasTutoria->id;
                    $hora->estado = 1;
                    $hora->external_h = "Di" . Utilidades\UUID::v4();
                    $hora->save();
                }
                self::estadoJson(200, true, '');
            }else{
                $dias = new diastutoria();
                $dias->dia_semana = strtolower($data["diaSemana"]);
                $dias->id_docente = $docente->id;
                $dias->estado = 1;
                $dias->external_dh = "Di" . Utilidades\UUID::v4();
                $dias->save();

                $listaHoras = $data["horaTutoria"];

                foreach ($listaHoras as $value) {
                    $hora = new horatutoria();

                    $hora->hora_inicio = $value["horaInicio"];
                    $hora->hora_fin = $value["horaFin"];
                    $hora->tipo_tutoria = $value["tipoTutoria"];
                    $hora->id_diastutoria = $dias->id;
                    $hora->estado = 1;
                    $hora->external_h = "Di" . Utilidades\UUID::v4();
                    $hora->save();
                }
                self::estadoJson(200, true, '');
            }
            return response()->json($datos, $estado);

        }
    }


    //este metodo listara las horas ocupadas de un docente y los días-horas que tiene tutoria
    public function listarTutoriasDocentes($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $docente = docente::where("external_do", $external_id)->first();

        if ($docente) {

            $diasTutoria = diastutoria::select('dia_semana', 'hora_inicio', 'hora_fin', 'tipo_tutoria')
                ->where("id_docente", $docente->id)
                ->where("diastutoria.estado", 1)
                ->join('horastutoria', 'diastutoria.id', '=', 'horastutoria.id_diastutoria')
                ->get() //dias
                ->groupBy("dia_semana");

            //select('fecha', 'id_docente','dia_tutoria')
            $verReserva = reserva::select('fecha', 'modalidad', 'hora_tutoria', 'dia_tutoria')
                ->where("id_docente", $docente->id)
                ->where("estado", 2)
                ->get()
                ->groupBy("dia_tutoria");
            $materias = materiaDocente::where('id_docente', $docente->id)
                ->join('materia', 'materia_docente.id_materia', 'materia.id')
                ->where('materia_docente.estado', '1')
                ->get();

            $arrayObjet = array();
            //var_dump(json_encode($verReserva));
            foreach ($diasTutoria as $key => $value) {
                $objetoArray[] = [
                    'dia' => $key,
                    'horario' => $diasTutoria[$key],
                    'fechaReserva' => self::obtenerReservas($verReserva, $key)
                ];
                $arrayObjet = $objetoArray;
            }

            //$datos['data'] = $arrayObjet;
            $materiaobj = array();
            foreach ($materias as $materia) {
                $materiArray[] = [
                    "materia" => $materia->materia,
                    "externalMateria" => $materia->external_ma
                ];
                $materiaobj = $materiArray;
            }

            $datos['data'] = [
                'horarios' => $arrayObjet,
                'materiasDocente' => $materiaobj
            ];

            self::estadoJson(200, true, '');

            return response()->json($datos, $estado);
        } else {
            self::estadoJson(400, false, 'Datos Incorrectos');
            return response()->json($datos, $estado);
        }
    }

    public static function obtenerReservas($listaRerva, $dia)
    {
        $aux = null;
        //var_dump(json_encode($dia));
        foreach ($listaRerva as $key => $value) {
            if ($key === $dia) {
                $aux = $listaRerva[$dia];
            }
        }
        return $aux;
    }


    public function getPeriodo()
        {
            global $estado, $datos;
            self::iniciarObjetoJSon();

            date_default_timezone_set("America/Guayaquil");
            setlocale(LC_TIME, "spanish");
            $fecha = date("Y-m-d");

            $aux = periodoAcademico::where("estado", 1)->first();

            $datos['data'] = [
                "nombrePeriodo" =>$aux->nombre_periodo,
                "externalPeriodo" =>$aux->external_periodo

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

    private static function iniciarObjetoJSon()
    {
        global $estado, $datos;
        $datos['data'] = null;
        $datos['sucess'] = 'false';
        $datos['mensaje'] = '';
    }
}
