<?php

namespace App\Http\Controllers;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use App\Models\Asistencia;
use App\Models\Estudiante;
use App\Models\Docente;
use App\Models\Materia;
use App\Models\PeriodoAcademico;
use App\Models\Reserva;

// use PHPMailer\PHPMailer;
// require 'PHPMailer/vendor/autoload.php';


use Illuminate\Http\Request;

class ReagendarController extends Controller
{
    private $estado = 400;
    private $datos = [];

    //reagender cita

    public function reagendar(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();

        $reserva = reserva::where("external_rt", $data["externalReserva"])->first();

        if ($reserva) {
            $reservaEditar = reserva::find($reserva->id);
            $reservaEditar->fecha = $data["fecha"];
            $reservaEditar->dia_tutoria = $data["dia"];
            $reservaEditar->hora_tutoria = $data["horaInicio"];
            $reservaEditar->hora_fin = $data["horaFin"];
            $reservaEditar->estado = 4;
            //$reserva->estado_encuesta =0;
            //$reservaEditar = $data["mensaje"];
            $reservaEditar->save();
            //$cuerpoMensaje = $data["mensaje"];
            $cabecera = "Estudiante";
            $correo = "alfonso.rm1193@gmail.com";
            $asunto="Tutoria reagendada";
            $mensaje= "Se ha realizado una reagendación de tutoría respecto a: ". $reserva->tema_tutoria.",". " por los motivos de:  ". $data["mensaje"];
            $mensajeaux = "<p>Por favor, revise su perfil en el módulo de tutorías</p>";

            $enviar = new MailController();
            $enviar->enviarMail($correo,  $asunto,  $mensaje,$mensajeaux ,$cabecera);

            self::estadoJson(200, true, 'cita reangendada');
            return response()->json($datos, $estado);
        }
    }


    //lista para el estudiante estudiante de tutorias reagendadas
    public function citasreagendada($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $estudiante = estudiante::where("external_es", $external_id)->first();
        $reservas = reserva::where("id_estudiante", $estudiante->id)
            ->where("reservatutoria.estado", 4)
            ->join('docente', 'reservatutoria.id_docente', '=', 'docente.id')
            ->get();
        foreach ($reservas as $reserva) {
            $datos['data'][] = [
                "fecha" => $reserva->fecha,
                "horaInicio" => $reserva->hora_tutoria,
                "HoraFin" => $reserva->hora_fin,
                "temaTutoria" =>  $reserva->tema_tutoria,
                "nombresDocente" => $reserva->nombres .' '.$reserva->apellidos,
                "externalReserva"  => $reserva->external_rt,


            ];
        }

        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    //aceptar o rechar
    public function accitas(Request $request, $external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            $reserva = reserva::where("external_rt", $external_id)->first();

            if ($reserva) {
                $reservaEditar = reserva::find($reserva->id);

                if($data["estado"] == 1){
                    $reservaEditar->observacion = "reagendación rechazada por  -". ' '. $data["motivo"] ;
                    $reservaEditar->estado = $data["estado"];  //1 rechaza

                }else{
                    $reservaEditar->estado = $data["estado"];  //2 acepta
                }

                $reservaEditar->save();
                self::estadoJson(200, true, '');
                return response()->json($datos, $estado);
            }
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

