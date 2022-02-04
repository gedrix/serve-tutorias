<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Estudiante;
use App\Models\Materia;
use App\Models\Docente;
use App\Models\Reserva;
use App\Models\PeriodoAcademico;
use App\Models\MateriaDocente;
use Illuminate\Support\Facades\DB;
use App\Models\Titulacion;
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// use PHPMailer\PHPMailer\PHPMailer;
// require 'Utilidades/PHPMailer/vendor/autoload.php';
// use App\Http\Controllers\MailController;

use Illuminate\Http\Request;
use DateTime;
//use DB;
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
            
            $temaTitulacion = 0;
            if ($data["tipoTutoria"] == 1) {
                $Titulacion = Titulacion::where("estudiante", $estudianteObj->id)
                            ->where("estado",1)
                            ->first();

                if ($Titulacion  =='' || $Titulacion == null) {
                    $Titulacion = Titulacion::where("pareja", $estudianteObj->id)
                                ->where("estado",1)
                                ->first();

                }
                $temaTitulacion = $Titulacion->id;
            }
            $reserva = new reserva();

            // modalidad individual 1, 2 grupal
            $reserva->modalidad = count($data["participantes"])>1? 2 : 1;
            $reserva->fecha = $data["fecha"];
            $reserva->tema_tutoria = $data["temaTutoria"] ;
            $reserva->dia_tutoria = $data["dia"];
            $reserva->hora_tutoria = $data["horaInicio"];
            $reserva->hora_fin = $data["horaFin"];
            $reserva->tipo_tutoria = $data["tipoTutoria"];  //0 academica 1 titulacion

            $reserva->tiempo_duracion =$data["tiempo_duracion"];

            $reserva->id_estudiante = $estudianteObj->id;
            $reserva->id_materia = $externalMateria ? $externalMateria->id: NULL;
            $reserva->id_docente = $docenteObj->id;
            $reserva->id_periodo_academico = $periodo->id;
            $reserva->mensaje = '';
            $reserva->ciclo = $data['ciclo'];
            $reserva->paralelo =strtoupper($data['paralelo']);
            $reserva->estado = 2;
            $reserva->estado_encuesta = 0;
            $reserva->id_titulacion = $temaTitulacion; 
            $reserva->external_rt = "Re" . Utilidades\UUID::v4();
            $reserva->save();

            $listaestudiantes = $data["participantes"];
            foreach ($listaestudiantes as  $value) {

                $asistencia = new asistencia();
                $asistencia->id_estudiante = $value;
                $asistencia->estado = 2;
                $asistencia->id_reserva = $reserva->id;
                $asistencia->id_materia = $reserva->id_materia;
                $asistencia->id_periodo = $reserva->id_periodo_academico;
                $asistencia->id_docente = $reserva->id_docente;

                $asistencia->save();
            }
            $cabecera = "Docente";
             $correo = "alfonso.rm1193@gmail.com";
             $asunto="Nueva tutoria";

            $mensaje= "El estudiante ". $estudianteObj->nombres. " ". $estudianteObj->apellidos. " ha reservado una tutoría";
            $mensajeaux = "<p>Por favor, revise su perfil en el módulo de tutorías</p>";

             $enviar = new MailController();
             $enviar->enviarMail($correo,  $asunto,  $mensaje ,$mensajeaux,  $cabecera);
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
        self::estadoJson(200, true, 'lista de reservas');
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
                $cabecera = "Docente";
                $correo = "alfonso.rm1193@gmail.com";
                $asunto="Reserva cancelada";
                $mensaje= "Se ha cancelado una reserva de tutoría respecto a: ". $reserva->tema_tutoria  ."<br>"."Por el motivo de: "." " . $data["motivo"];
                $mensajeaux = "<p>Muchas gracias por la atención </p>";

                $enviar = new MailController();

                $enviar->enviarMail($correo,  $asunto,  $mensaje, $mensajeaux, $cabecera);

                self::estadoJson(200, true, 'Reserva cancelada');
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

                $cabecera = "Estudiante";
                $correo = "alfonso.rm1193@gmail.com";
                $asunto="Nueva tutoria";
                $mensaje= "Se ha cancelado una reserva de tutoría respecto a: ". $reserva->tema_tutoria ." "."<br>"."Por el motivo de: ". $data["motivo"] ;
                $mensajeaux = "<p>Muchas gracias por la atención </p>";

                $enviar = new MailController();
                $enviar->enviarMail($correo,  $asunto,  $mensaje,$mensajeaux , $cabecera);
                self::estadoJson(200, true, 'Reserva cancelada');
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

            //$materia = materia::where("external_ma", $data["externalMateria"])->first();
            // $reservas =  reserva::select('reservatutoria.modalidad','tema_tutoria','fecha','hora_tutoria','hora_fin','asistencia.id_estudiante','actividad','youtube','repositorio','registroactividad.modalidad')
            //     ->where("id_docente", $docenteObj->id)
            //     ->where("reservatutoria.tipo_tutoria", 0)
            //     ->where("id_periodo_academico", $periodo->id)
            //     ->where("reservatutoria.estado", 0)
            //     ->where("id_materia", $materia->id)
            //     ->join("asistencia", "reservatutoria.id", "asistencia.id_reserva")
            //     ->where("asistencia.estado",0)
            //     ->join("estudiante", "estudiante.external_es","asistencia.id_estudiante")
            //     ->where("estudiante.paralelo", $data["paraleloEstudiante"])
            //     ->join("registroactividad", "reservatutoria.id", "registroactividad.id_reserva")
            //     ->get();
            //     $cont =1;
            // foreach ($reservas as $reserva) {
            //     $datos['data'][] = [
            //     "cont"=> $cont ++,
            //         "fecha" => $reserva->fecha,
            //         "hora" =>$reserva->hora_tutoria . " - ".$reserva->hora_fin,
            //         "estudiante" => self::getNombreEstudiante($reserva->id_estudiante),
            //         "temaTutoria" => $reserva->tema_tutoria,
            //         "modalidadVP" => $reserva->modalidad,
            //         "actividad" => $reserva->actividad ." ".$reserva->youtube. " ".$reserva->repositorio,
            //         "youtube" => $reserva->youtube,
            //         "repositorio" => $reserva->repositorio,
            //        "materia" => $materia->materia,
            //         "modalidadGI" => $reserva->modalidad,
            //         "firma" => " ",
            //         // "horaInicio" => $reserva->hora_tutoria,
            //         // "horaFin" => $reserva->hora_fin,
            //        // "estudiante" => $reserva->id_estudiante,
            //         "ciclo" => self::getCicloEstudiante($reserva->id_estudiante),

            //     ];
            // }

            $reservas =  reserva::select('reservatutoria.modalidad','reservatutoria.tiempo_duracion','tema_tutoria','fecha','hora_tutoria','hora_fin','asistencia.id_estudiante','actividad','youtube','repositorio','registroactividad.modalidad','registroactividad.recurso_virtual', 'materia.materia')
            ->where("reservatutoria.id_docente", $docenteObj->id)
            ->where("reservatutoria.tipo_tutoria", 0)
            ->where("id_periodo_academico", $periodo->id)
            ->where("reservatutoria.estado", 0)
            ->join("asistencia", "reservatutoria.id", "asistencia.id_reserva")
            ->where("asistencia.estado",0)
            ->join("materia", "reservatutoria.id_materia", "materia.id")
            ->join("estudiante", "estudiante.external_es","asistencia.id_estudiante")
            ->join("registroactividad", "reservatutoria.id", "registroactividad.id_reserva")
            ->get();

             $cont =1;
             foreach ($reservas as $reserva) {
                    $datos['data'][] = [
                    //"cont"=> $cont ++,
                        "fecha" => $reserva->fecha,
                        "hora" =>$reserva->hora_tutoria,          // . " - ".$reserva->hora_fin,
                        "duracion" => $reserva->tiempo_duracion,
                        "estudiante" => self::getNombreEstudiante($reserva->id_estudiante),
                        "cedula" => self::getCedelaEstudiante($reserva->id_estudiante),
                        "materia" => $reserva->materia. " - ".self::getCicloEstudiante($reserva->id_estudiante),
                        "temaTutoria" => $reserva->tema_tutoria,
                        "modalidadVP" => $reserva->modalidad,
                        "firma" => $reserva->recurso_virtual,
                        "actividad" => $reserva->actividad ." ".$reserva->youtube. " ".$reserva->repositorio,
                        //"youtube" => $reserva->youtube,
                       // "repositorio" => $reserva->repositorio,
                        
                        //"modalidadGI" => $reserva->modalidad,
                        
                        //"horaInicio" => $reserva->hora_tutoria,
                        //"horaFin" => $reserva->hora_fin,
                        
                       // "estudiante" => $reserva->id_estudiante,
                        //"ciclo" => self::getCicloEstudiante($reserva->id_estudiante),

                    ];
                }
            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        }
    }

    // public function consolidadAD4(Request $request){
    //      global $estado, $datos;
    //     self::iniciarObjetoJSon();
    //      $data = $request->json()->all();
    //     $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
    //     $parametro = 16;
    //     //$submit = DB::select('call consolidado_ad4(16)');
    //     $submit = DB::select('call consolidado_ad4(:parametro)', array('parametro'=>$periodo->id));
    //     foreach($submit  as $row)
    //     {
    //         $datos['data'][] = [
    //             "ciclo" => $row->ciclo ." ".$row->paralelo,
    //             //"id_materia" => $row->id_materia,
    //             "horas_programadas" $row->h_academica,
    //             "materia" => $row->materia,
    //             "horas_brindadas"=> $row->tiempo,
    //             "n_estudiante"=> $row->estudiante,
    //         ];
    //     }
    //     self::estadoJson(200, true, '');
    //     return response()->json($datos, $estado);
    // }

    /*tutoriras dadas en titulacion */
    public function tutoriasDadasTitulacion(Request $request, $external_id)
    {
        global $estado, $datos;
        $auxdatos = [];
        self::iniciarObjetoJSon();
        $data = $request->json()->all();

        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
        $estudiante = estudiante::where("external_es", $data["externalEstudiante"])->first();
        $reservas =  reserva::select('reservatutoria.modalidad','tema_tutoria','fecha','hora_tutoria','hora_fin',
                                        'asistencia.id_estudiante','informacion_presentada',
                                        'actividad','youtube','repositorio','registroactividad.modalidad')
                    ->where("id_docente", $docenteObj->id)
                    ->where("reservatutoria.tipo_tutoria",1)
                    ->where("id_periodo_academico", $periodo->id)
                    ->where("reservatutoria.id_estudiante", $estudiante->id)
                    ->where("reservatutoria.estado", 0)
                    ->join("asistencia", "reservatutoria.id", "asistencia.id_reserva")
                    ->where("asistencia.estado",0)
                    ->join("registroactividad", "reservatutoria.id", "registroactividad.id_reserva")
                    ->distinct()
                    ->get();

                    //$cont =1;
                    foreach ($reservas as $reserva) {
                        //if ($reserva->id_estudiante) {
                                $auxdatos['data'][] = [
                                    "temaTrabajo" => $reserva->tema_tutoria,
                                    "fecha" => $reserva->fecha,
                                    "hora" => $reserva->hora_tutoria . ' - ' . $reserva->hora_fin,
                                    "informacionPresentada" => $reserva->informacion_presentada,
                                    "actividad" => $reserva->actividad .' '. $reserva->youtube  .' '. $reserva->repositorio,
                                    "firma" => " ",
                                    "proxima" => " "
                                ];
                        //}
                        }
                        foreach ($reservas as $reserva) {
                            $auxdatos['datos'][]= [
                                "aspirante" => self::getNombreEstudiante($reserva->id_estudiante),
                           ];
                        }

                         $auxdatos = self::limpiararray($auxdatos['data'],$auxdatos['datos'] );

                        // $aux = sizeof($auxdatos['data']);
                        $datos = $auxdatos ;
                    self::estadoJson(200, true, '');
            return response()->json($datos , $estado);
    }

    //se llena la lista de estudiantes que partipan en las tutorias de titulacion
    public function getParticipantesTitulacion($external_id, $external_periodo, $tipo)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $external_periodo)->first();

        $listaEstudiante = reserva::where("id_docente", $docenteObj->id)
                            ->where("id_periodo_academico", $periodo->id)
                            ->where("tipo_tutoria", $tipo)
                            ->where("estado", 0)
                            ->get();
                            //realizo una consulta para ver si existe al menos una tutoria de titutlacion
                            //si existe continuo sino no devuelve nada

        // dd($periodo["nombre_periodo"] );
            //dd($listaEstudiante->isEmpty());
        if (!$listaEstudiante->isEmpty()) {
             foreach ($listaEstudiante as $lista) {
                $data['data'][] = [
                   "estudiante" => self::getNombreEstudianteTitulacion($lista->id_estudiante),
                   "externalEstudiante" => self::getNombrExternalTitulacion($lista->id_estudiante),
                ];
            }
            $datos = array_unique($data);
        }

        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    //limpiar array de  tutoriasDadasTitulacion
     private function limpiararray($datos, $est)
    {
        $cont =1;
        $data=[];

         for ($i=0; $i < sizeof($datos); $i++){
              $existe = false;
            for ($j=0; $j < sizeof($data); $j++) {
                $objeto = $data['data'][$j] ;
                if ($datos[$i]['hora'] === $objeto['hora']  && 
                    $datos[$i]['fecha'] === $objeto['fecha'] ) {
                    $existe = true;
                    $j = sizeof($data);
                }
            }
            if (!$existe) {
                $data['data'][] = [
                    //"cont" =>  $cont++,
                    "temaTrabajo" => $datos[$i]['temaTrabajo'],
                     "fecha" => $datos[$i]['fecha'],
                     "hora" => $datos[$i]['hora'],
                     "informacionPresentada" =>$datos[$i]['informacionPresentada'],
                     "actividad" => $datos[$i]['actividad'],
                     "aspirante" => self::limpiarAspirante( $est),
                     "firma" => " ",
                     "proxima" => " "
                ];
                //$existe = true;
            }
             
         }

         // return $datos;¨ 
         $data['data']  =array_unique($data['data'], SORT_REGULAR);
        return $data;
    }

    private function limpiarAspirante($est){
        $estudiante ="";
        $auxEstudiante= [];
        // $estudiante = $est[0];
        for ($i=0; $i < sizeof($est); $i++) {
        //    for ($j=0; $j < sizeof($est); $j++) {
        //        if ($est[$i] != $est[$j]) {
        //            $estudiante= $estudiante .' '.$est[$i];
        //        }
        //    }
            if (!in_array($est[$i], $auxEstudiante)) {
                array_push($auxEstudiante, $est[$i]);
                $estudiante = $estudiante .', ' . $est[$i]['aspirante'];
            }
         }


         return $estudiante;
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
    private function getCedelaEstudiante($external)
    {
        $estudiante = estudiante::where("external_es", $external)->first();
        return $estudiante->cedula;
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
      //  $ciclo =  $estudiante->ciclo;
        $paralelo =  $estudiante->paralelo;
      //  return $ciclo." ". strtoupper($paralelo);
      return  strtoupper($paralelo);

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
                    // "horaInicio" => $reserva->hora_tutoria,
                    // "horaFin" => $reserva->hora_fin,
                    "tipoTutoria" => $reserva->tipo_tutoria,
                    "estudianteCancelado" => self::estudianteCancelado($reserva->id_estudiante),
                    "cicloEstudiante" => self::estudianteCanceladoCiclo($reserva->id_estudiante),
                ];
            }
            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        }
    }

    private function estudianteCanceladoCiclo($id){
        $estudiante = estudiante::where("id", $id)->first();
        $ciclo =  $estudiante->ciclo;
        $paralelo =  $estudiante->paralelo;
        return $ciclo." ". strtoupper($paralelo);
    }

    private function estudianteCancelado($id){
        $estudiante = estudiante::where("id", $id)->first();
        $nombres =  $estudiante->nombres;
        $apellidos =  $estudiante->apellidos;
        return $nombres." ". $apellidos;
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
                    // "horaInicio" => $reserva->hora_tutoria,
                    // "horaFin" => $reserva->hora_fin,
                    "tipoTutoria" => $reserva->tipo_tutoria,
                    "estudianteCancelado" => self::estudianteCancelado($reserva->id_estudiante),
                    "cicloEstudiante" => self::estudianteCanceladoCiclo($reserva->id_estudiante),

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
