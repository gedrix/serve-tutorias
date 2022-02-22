<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Estudiante;
use App\Models\Docente;
use App\Models\Reserva;
use App\Models\Registroactividad;
use App\Models\Encuestatutoria;
use App\Models\PeriodoAcademico;

use Illuminate\Http\Request;

class ActividadController extends Controller
{
    private $estado = 400;
    private $datos = [];

    //registrar actividad
    public function registrarActividad(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            

            $actividad = new registroactividad();
            $actividad->actividad = $data["actividad"];
            $actividad->youtube = $data["youtube"];
            $actividad->repositorio = $data["repositorio"];
            $actividad->informacion_presentada = $reserva->tipo_tutoria == 1 ? $data["informacionTesista"] : null;
            $actividad->modalidad = $data["modalidad"];  //0 presencial 1 virtual
            $actividad->recurso_virtual = $data["recurso_virtual"] ? $data["recurso_virtual"] : '';
            

            $actividad->id_reserva =  $reserva->id;
            $actividad->external_ac = "Ac" . Utilidades\UUID::v4();
            $actividad->save();

            $reservaEditar = reserva::find($reserva->id);
            $reservaEditar->estado = 0;
            $reservaEditar->save();

            //asistencia

            foreach ($data['participantes'] as $participante) {
                $asistenciaObj = asistencia::where("id_estudiante", $participante["external"])
                    ->where("id_reserva", $reserva->id)->first();

                $asistencia = asistencia::find($asistenciaObj->id);
                $asistencia->estado = $participante["asistencia"];
                $asistencia->save();
            }



            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        }
    }

    public function anulartutoria($exnternal_reserva){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        
        $reserva = reserva::where("external_rt", $exnternal_reserva)->first();

            $reservaEditar = reserva::find($reserva->id);
            $reservaEditar->estado = 9;
            $reservaEditar->save();

            self::estadoJson(200, true, 'Turoria Anulada');
            return response()->json($datos, $estado);
    }


    // registrar encuestas
    public function registrarEncuesta(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        date_default_timezone_set("America/Guayaquil");
        setlocale(LC_TIME, "spanish");

        if ($request->json()) {
            $data = $request->json()->all();
            $reserva = reserva::where("external_rt", $data["externalReserva"])->first();
            $estudiante = estudiante::where("external_es", $data["externalEstudiante"])->first();


            if ($reserva) {
                $encuesta = new encuestatutoria();
                $encuesta->fecha_registro = date("d/m/y");
                $encuesta->satisfaccion = $data["satisfaccion"];
                $encuesta->aclaro_sus_dudas = $data["dudasAclaradas"];
                $encuesta->tiempo_necesario = $data["tiempoNecesario"];
                $encuesta->observacion = $data["observacion"];
                $encuesta->id_estudiante = $estudiante->id;
                $encuesta->id_reserva = $reserva->id;
                $encuesta->estado = 1;
                $encuesta->external_et = "Et" . Utilidades\UUID::v4();
                $encuesta->save();
            }


            $reservaEditar = reserva::find($reserva->id);
            $reservaEditar->estado_encuesta = 1;
            $reservaEditar->save();

            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        }
    }

    //listar encuestas

    public function listarEncuestas(Request $request, $external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();

        $docenteObj = docente::where("external_do", $external_id)->first();
        if ($docenteObj) {
            $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();

            $reservas =  reserva::where("id_docente", $docenteObj->id)
                ->where("id_periodo_academico", $periodo->id)
                ->where("reservatutoria.estado", 0)
                ->join("encuestatutoria", "reservatutoria.id", "encuestatutoria.id_reserva")
                ->get();
                $cont=1;
            foreach ($reservas as $reserva) {
                $datos['data'][] = [
                    // "temaTutoria" => $reserva->tema_tutoria,
                    // "modalidadGI" => $reserva->modalidad,
                    // "fecha" => $reserva->fecha,
                    // "horaInicio" => $reserva->hora_tutoria,
                    // "HoraFin" => $reserva->hora_fin,
                    "cont"=> $cont ++,
                    "satisfaccion" => $reserva->satisfaccion,
                    "dudasAclaradas" => $reserva->aclaro_sus_dudas,
                    "tiempoNecesario" => $reserva->tiempo_necesario,
                    "observacion" => $reserva->observacion,
                ];
            }

            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        }
    }


    //listar encuestas pendientes para el estudiante
    public function encuestaspendientes($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        $estudianteObj = estudiante::where("external_es", $external_id)->first();

        $reservas = reserva::where("id_estudiante", $estudianteObj->id)
                    ->where("estado_encuesta", 0)
                    ->where("reservatutoria.estado", 0)
                    ->join('docente', 'reservatutoria.id_docente', '=', 'docente.id')
                    ->get();

            foreach ($reservas as $reserva) {
                $datos['data'][] = [
                    "modalidad" => $reserva->modalidad,
                    "temaTutoria" => $reserva->tema_tutoria,
                    "fecha" => $reserva->fecha,
                    "hora" => $reserva->hora_tutoria,
                    "externalReserva" => $reserva->external_rt,
                    "nombresDocente" => $reserva->nombres .' '.$reserva->apellidos,
                ];
            }
            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);

    }



    //listar estudiantes de una tutoria
    public function listarEstudiantesReserva($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $reserva = reserva::where("external_rt", $external_id)->first();

        $asistencias = asistencia::where("id_reserva", $reserva->id)->get();
        foreach ($asistencias as $asistencia) {
            $datos['data'][] = [
                "estudiante" => self::getNombreEstudiante($asistencia->id_estudiante),
                "externalEstudiante" => $asistencia->id_estudiante
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    //traer estudiante
    private function getNombreEstudiante($external)
    {
        $estudiante = estudiante::where("external_es", $external)->first();
        return $estudiante->nombres . " " . $estudiante->apellidos;
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

    public function devolverHoraFecha (){
        global $estado, $datos;
        self::iniciarObjetoJSon();

        date_default_timezone_set("America/Guayaquil");
        setlocale(LC_TIME, "spanish");
        $datos['data'][] = [
            "hora" => date("H:i:s"),
            "dia" => date("d/m/y")
        ];

        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }
}
