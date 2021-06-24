<?php

namespace App\Http\Controllers;

use App\Models\asistencia;
use App\Models\estudiante;
use App\Models\materia;
use App\Models\docente;
use App\Models\reserva;
use App\Models\periodoAcademico;

// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// use PHPMailer\PHPMailer\PHPMailer;
// require 'Utilidades/PHPMailer/vendor/autoload.php';
// use App\Http\Controllers\MailController;

use Illuminate\Http\Request;

class ReservaController extends Controller
{
    private $estado = 400;
    private $datos = [];

    /*
            Estado de tutoria:
                                0 cerrada o cumplida
                                1 cancelada por el estudiante
                                2 reservada
                                3 cancelada por el docente

        */



    public function RegistroTutoria(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        if ($request->json()) {
            $data = $request->json()->all();

            $estudianteObj = estudiante::where("external_es", $data["externalEstdudiante"])->first();
            $docenteObj = docente::where("external_do", $data["externalDocente"])->first();

            $externalMateria = materia::where("external_ma", $data["externalMateria"])->first();
            $periodo = periodoAcademico::where("estado", 1)->first();
            $reserva = new reserva();

            // modalidad individual 1, 2 grupal
            $reserva->modalidad = count($data["participantes"])>1? 2 : 1;
            $reserva->fecha = $data["fecha"];
            $reserva->tema_tutoria = $data["temaTutoria"] ;
            $reserva->dia_tutoria = $data["dia"];
            $reserva->hora_tutoria = $data["horaInicio"];
            $reserva->hora_fin = $data["horaFin"];
            $reserva->tipo_tutoria = $data["tipoTutoria"];  //0 academica 1 titulacion
            $reserva->id_estudiante = $estudianteObj->id;
            $reserva->id_materia = $externalMateria ? $externalMateria->id: NULL;
            $reserva->id_docente = $docenteObj->id;
            $reserva->id_periodo_academico = $periodo->id;
            $reserva->mensaje = '';
            $reserva->estado = 2;
            $reserva->estado_encuesta = 0;

            $reserva->external_rt = "Re" . Utilidades\UUID::v4();
            $reserva->save();

            $listaestudiantes = $data["participantes"];
            foreach ($listaestudiantes as  $value) {

                $asistencia = new asistencia();
                $asistencia->id_estudiante = $value;
                $asistencia->estado = 2;
                $asistencia->id_reserva = $reserva->id;
                $asistencia->save();
            }

             //$correo = "alfonso.rm1193@gmail.com";
             //$asunto="Nueva tutoria";
             //$mensaje= "se ha realizado una reserva";

             //$enviar = new MailController();
             //$enviar->enviarMail($correo,  $asunto,  $mensaje);
            self::estadoJson(200, true, '');

            return response()->json($datos, $estado);
        }
    }


    //listar reservas hechas por el estudiante estudiantes
    public function listaReservasEstudiantes($external_es)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        $estudianteObj = estudiante::where("external_es", $external_es)->first();

        $listas = reserva::where("id_estudiante", $estudianteObj->id)
            ->where("reservatutoria.estado", 2)
            ->join('docente', 'reservatutoria.id_docente', '=', 'docente.id')
            ->orderBy('fecha')
            ->get();


        foreach ($listas as $lista) {
            $datos['data'][] = [
                "modalidad" => $lista->modalidad,
                "fecha" => $lista->fecha,
                "hora" => $lista->hora_tutoria,
                "temaTutoria" => $lista->tema_tutoria,
                "externalReserva"  => $lista->external_rt,
                "nombresDocente" => $lista->nombres .' '.$lista->apellidos,


            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }


    //listar tutorias reservadas para el docente
    public function reservasDocentes($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        $docente = docente::where("external_do", "=", $external_id)->first();

        if ($docente) {
            $listas = reserva::where("id_docente", $docente->id)
                ->where("reservatutoria.estado", 2)
                ->join('estudiante', 'reservatutoria.id_estudiante', '=', 'estudiante.id')
                ->orderBy('fecha')
                ->get();

            foreach ($listas as $lista) {
                $datos['data'][] = [
                    "modalidad" => $lista->modalidad,
                    "fecha" => $lista->fecha,
                    "hora" => $lista->hora_tutoria,
                    "tipoTutoria" => $lista->tipo_tutoria,
                    "temaTutoria" => $lista->tema_tutoria,
                    "externalReserva"  => $lista->external_rt,
                    "nombresSolicitante" => $lista->nombres. ' '. $lista->apellidos,
                    //"apellidosSolicitante" => $lista->apellidos,
                    "nombresParticipantes" => self::getParticipantes($lista->external_rt),


                ];
            }
            self::estadoJson(200, true, '');
        } else {
            self::estadoJson(400, false, 'Datos Incorrectos');
        }
        return response()->json($datos, $estado);
    }

    private function getParticipantes($external_id)
    {
        //global $estado, $datos;
        //self::iniciarObjetoJSon();
        $reserva = reserva::where("external_rt", $external_id)->first();

        $asistencias = asistencia::where("id_reserva", $reserva->id)->get();
        foreach ($asistencias as $asistencia) {
            $datos[] = [
                "estudiante" => self::getNombreEstudianteReserva($asistencia->id_estudiante),
                "externalEstudiante" => $asistencia->id_estudiante
            ];
        }
        //self::estadoJson(200, true, '');
        //return response()->json($datos, $estado);
        return $datos;
    }



    //cancelar reserva por parte del estudiante
    public function cancelarReserva(Request $request, $exnternal_reserva)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();

            $reserva = reserva::where("external_rt", $exnternal_reserva)->first();

            if ($reserva) {
                $reservaEditar = reserva::find($reserva->id);

                $reservaEditar->observacion = $data["motivo"];

                $reservaEditar->estado = 1;

                $reservaEditar->save();
                self::estadoJson(200, true, '');
                return response()->json($datos, $estado);
            }
        }
    }

    //cancelar reserva por parte del docente

    public function cancelarReservaDocente(Request $request, $exnternal_reserva)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();

            $reserva = reserva::where("external_rt", $exnternal_reserva)->first();

            if ($reserva) {
                $reservaEditar = reserva::find($reserva->id);

                $reservaEditar->observacion = $data["motivo"];

                $reservaEditar->estado = 3;

                $reservaEditar->save();
                self::estadoJson(200, true, '');
                return response()->json($datos, $estado);
            }
        }
    }




    //listar tutorias dadas dadas academicas
    public function listarTutoriasDadas(Request $request, $external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();

        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();

        if ($docenteObj) {

            $materia = materia::where("external_ma", $data["externalMateria"])->first();
            $reservas =  reserva::select('reservatutoria.modalidad','tema_tutoria','fecha','hora_tutoria','hora_fin','asistencia.id_estudiante','actividad','youtube','repositorio','registroactividad.modalidad')
                ->where("id_docente", $docenteObj->id)
                ->where("reservatutoria.tipo_tutoria", 0)
                ->where("id_periodo_academico", $periodo->id)
                ->where("reservatutoria.estado", 0)
                ->where("id_materia", $materia->id)
                ->join("asistencia", "reservatutoria.id", "asistencia.id_reserva")
                ->where("asistencia.estado",0)
                ->join("estudiante", "estudiante.external_es","asistencia.id_estudiante")
                ->where("estudiante.paralelo", $data["paraleloEstudiante"])
                ->join("registroactividad", "reservatutoria.id", "registroactividad.id_reserva")
                ->get();
                $cont =1;
            foreach ($reservas as $reserva) {
                $datos['data'][] = [
                "cont"=> $cont ++,
                    "fecha" => $reserva->fecha,
                    "hora" =>$reserva->hora_tutoria . " - ".$reserva->hora_fin,
                    "estudiante" => self::getNombreEstudiante($reserva->id_estudiante),
                    "temaTutoria" => $reserva->tema_tutoria,
                    "modalidadVP" => $reserva->modalidad,
                    "actividad" => $reserva->actividad ." ".$reserva->youtube. " ".$reserva->repositorio,
                    "youtube" => $reserva->youtube,
                    "repositorio" => $reserva->repositorio,
                   "materia" => $materia->materia,
                    "modalidadGI" => $reserva->modalidad,
                    "firma" => " ",
                    // "horaInicio" => $reserva->hora_tutoria,
                    // "horaFin" => $reserva->hora_fin,
                   // "estudiante" => $reserva->id_estudiante,
                    "ciclo" => self::getCicloEstudiante($reserva->id_estudiante),
                    
                ];
            }
            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        }
    }

    /*tutoriras dadas en titulacion */
    public function tutoriasDadasTitulacion(Request $request, $external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();

        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
        $estudiante = estudiante::where("external_es", $data["externalEstudiante"])->first();
        $reservas =  reserva::select('reservatutoria.modalidad','tema_tutoria','fecha','hora_tutoria','hora_fin','asistencia.id_estudiante','informacion_presentada','actividad','youtube','repositorio','registroactividad.modalidad')
                    ->where("id_docente", $docenteObj->id)
                    ->where("reservatutoria.tipo_tutoria",1)
                    ->where("id_periodo_academico", $periodo->id)
                    ->where("reservatutoria.id_estudiante", $estudiante->id)
                    ->where("reservatutoria.estado", 0)
                    ->join("asistencia", "reservatutoria.id", "asistencia.id_reserva")
                    ->where("asistencia.estado",0)
                    ->join("registroactividad", "reservatutoria.id", "registroactividad.id_reserva")
                    ->get();
                    $cont =1;
                    foreach ($reservas as $reserva) {
                        $datos['data'][] = [
                        "cont"=> $cont ++,
                            "temaTrabajo" => $reserva->tema_tutoria,
                            "aspirante" => self::getNombreEstudiante($reserva->id_estudiante),
                            //"modalidadGI" => $reserva->modalidad,
                            "fecha" => $reserva->fecha,
                            "hora" => $reserva->hora_tutoria . ' - ' . $reserva->hora_fin,
                            //"horaFin" => $reserva->hora_fin,
                            "informacionPresentada" => $reserva->informacion_presentada,
                            "actividad" => $reserva->actividad,
                           // "youtube" => $reserva->youtube,
                            //"repositorio" => $reserva->repositorio,
                            //"modalidadVP" => $reserva->modalidad,
                            "firma" => " ",
                            "proxima" => " "

                        ];
                    }
                    self::estadoJson(200, true, '');
            return response()->json($datos, $estado);

    }


    public function getParticipantesTitulacion($external_id, $external_periodo, $tipo)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $external_periodo)->first();

        $listaEstudiante = reserva::where("id_docente", $docenteObj->id)
                            ->where("id_periodo_academico", $periodo->id)
                            ->where("tipo_tutoria", $tipo)
                            ->get();

        foreach ($listaEstudiante as $lista) {
            $data['data'][] = [
               "estudiante" => self::getNombreEstudianteTitulacion($lista->id_estudiante),
               "externalEstudiante" => self::getNombrExternalTitulacion($lista->id_estudiante),
            ];
        }
        self::estadoJson(200, true, '');
        $datos = array_unique($data);
        return response()->json($datos, $estado);
    }


    //traer estudiante
    private function getNombreEstudianteReserva($external)
    {
        $estudiante = estudiante::where("external_es", $external)->first();
        return $estudiante->nombres . " " . $estudiante->apellidos;
    }
    
    private function getNombreEstudiante($external)
    {
        $estudiante = estudiante::where("external_es", $external)->first();
        return $estudiante->nombres . " " . $estudiante->apellidos;
    }

    //traer estudiante titulacion
    private function getNombreEstudianteTitulacion($external)
    {
        $estudiante = estudiante::where("id", $external)->first();
        $nombre =$estudiante->nombres . " " . $estudiante->apellidos;
        return  $nombre;
    }
     private function getNombrExternalTitulacion($external)
    {
        $estudiante = estudiante::where("id", $external)->first();
        $external_es =$estudiante->external_es ;

        return  $external_es;

    }
    //get ciclo estudiante
    private function getCicloEstudiante($external)
    {
        $estudiante = estudiante::where("external_es", $external)->first();
        $ciclo =  $estudiante->ciclo;
        $paralelo =  $estudiante->paralelo;
        return $ciclo." ". strtoupper($paralelo);

    }



    //listar reservas canceladas por el estudiante
    public function listartutoriasCanceladasEstudiantes(Request $request, $external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            $docenteObj = docente::where("external_do", $external_id)->first();
            $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
            $reservas = reserva::where("id_docente", $docenteObj->id)
                ->where("id_periodo_academico", $periodo->id)
                ->where("estado", 1)
                ->get();
                $cont=1;
            foreach ($reservas as $reserva) {
                $datos['data'][] = [
                    "cont"=> $cont ++,
                    "temaTutoria" => $reserva->tema_tutoria,
                    "modalidad" => $reserva->modalidad,
                    "fecha" => $reserva->fecha,
                    "horaInicio" => $reserva->hora_tutoria,
                    "horaFin" => $reserva->hora_fin,
                    "tipoTutoria" => $reserva->tipo_tutoria

                ];
            }
            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        }
    }

    //listar reservas canceladas por el docente
    public function listartutoriasCanceladasDocente(Request $request, $external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            $docenteObj = docente::where("external_do", $external_id)->first();
            $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
            $reservas = reserva::where("id_docente", $docenteObj->id)
                ->where("id_periodo_academico", $periodo->id)
                ->where("estado", 3)
                ->get();
                $cont=1;
            foreach ($reservas as $reserva) {
                $datos['data'][] = [
                    "cont"=> $cont ++,
                    "temaTutoria" => $reserva->tema_tutoria,
                    "modalidad" => $reserva->modalidad,
                    "fecha" => $reserva->fecha,
                    "horaInicio" => $reserva->hora_tutoria,
                    "horaFin" => $reserva->hora_fin,
                    "tipoTutoria" => $reserva->tipo_tutoria

                ];
            }
            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        }
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
