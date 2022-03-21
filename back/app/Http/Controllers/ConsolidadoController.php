<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Estudiante;
use App\Models\Materia;
use App\Models\Docente;
use App\Models\Reserva;
use App\Models\PeriodoAcademico;
use App\Models\MateriaDocente;
use App\Models\Titulacion;
use Illuminate\Support\Facades\DB;

// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// use PHPMailer\PHPMailer\PHPMailer;
// require 'Utilidades/PHPMailer/vendor/autoload.php';
// use App\Http\Controllers\MailController;

use Illuminate\Http\Request;
use DateTime;
//use DB;
class ConsolidadoController extends Controller
{
    private $estado = 400;
    private $datos = [];

    public function listaDeTemasTitulacionPorDocente ($external_id, $external_periodo){
        global $estado, $datos;
        self::iniciarObjetoJSon();
       
        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $external_periodo)->first();
        
        $submit = DB::select('call listar_temas_titulacion(:parametro, :parametro2)', array('parametro'=>$periodo->id, 'parametro2'=>$docenteObj->id));
        if ($submit != null ) {
            foreach($submit  as $row)
            {
                $datos['data'][] = [
                   
                    "temaTitulacion" => $row->tema,
                     "external_titulacion" => $row->external_titulacion,

                ];
            }
            self::estadoJson(200, true, '');
        }else{
             self::estadoJson(300, true, 'No han Solicitado tutorias de titulación al docente');
        }
        
        return response()->json($datos, $estado);

    }
    public function actividadPorTemaTitulacion(Request $request, $external_id){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();
        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
        $titulacion = titulacion::where("external_titulacion", $data["external_titulacion"])->first();

        $submit = DB::select('call actividad_titulacion_por_tema(:parametro0, :parametro, :parametro2)', array('parametro0'=>$titulacion->id,'parametro'=>$periodo->id, 'parametro2'=>$docenteObj->id));

        $cont =0;
        foreach($submit  as $row)
        {
            $datos['data'][] = [
                "cont" =>$cont ++,
                "temaTrabajo" => $row->tema,
                "fecha" => $row->fecha,
                "hora" => $row->hora_tutoria.' '.$row->hora_fin ,
                "duracion" =>$row->tiempo_duracion,
                "informacionPresentada" =>$row->informacion_presentada,
                "actividad" => $row->actividad.' '.$row->youtube. ' '.$row->repositorio,
                "aspirante" =>$row->pareja == 0 ?  self::getNombreEstudiante($row->estudiante) : self::getNombreEstudiantePareja($row->estudiante, $row->pareja) ,
                "firma" => " ",
                "proxima" => " "
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

     private function getNombreEstudiante($id)
    {
        $estudiante = estudiante::where("id", $id)->first();
        return $estudiante->nombres . " " . $estudiante->apellidos;
    }
     private function getNombreEstudiantePareja($idEst, $idPareja)
    {
        $estudiante = estudiante::where("id", $idEst)->first();
        $pareja = estudiante::where("id", $idPareja)->first();
        return $estudiante->nombres . " " . $estudiante->apellidos ." ".$pareja->nombres . " " . $pareja->apellidos;
    }

    public function consolidadoAD8(Request $request, $external_id){
         global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();

        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
        //$parametro = 16;
        //$submit = DB::select('call consolidado_ad4(16)');
        $submit = DB::select('call consolidado_ad8(:parametro, :parametro2)', array('parametro'=>$periodo->id, 'parametro2'=>$docenteObj->id));
        $cont =1;
        foreach($submit  as $row)
        {
            $datos['data'][] = [
                "cont" =>$cont ++,
                "estudiante" => $row->pareja == 0 ?  self::getNombreEstudiante($row->estudiante) : self::getNombreEstudiantePareja($row->estudiante, $row->pareja) ,
                //"id_materia" => $row->id_materia,
                 "temaTT" => $row->tema,
                "duracionTT" => $row->horas,
                "n_estudiante"=> $row->pareja != 0 ? 2  : 1,
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function totalconsolidadoAD8(Request $request, $external_id){
         global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();

        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
        
        $submit = DB::select('call consolidado_ad8(:parametro, :parametro2)', array('parametro'=>$periodo->id, 'parametro2'=>$docenteObj->id));
        $horasBrindadas = 0;
        $totalEstudiante = 0;
        foreach($submit  as $row)
        {
           $horasBrindadas  = $horasBrindadas + $row->horas;

           if($row->pareja == 0) {
               $totalEstudiante = $totalEstudiante + 1;
           }else{
                $totalEstudiante = $totalEstudiante + 2;
           }
           
        }

        if ($horasBrindadas >0) {
           $mod= $horasBrindadas % 60;
           $hora =  intval($horasBrindadas /60);
        }else{
            $hora = 0;
            $mod =0;
        }

         $datos['data'][] = [
                
                "totalHoras" => $hora .' hora '. $mod . ' min',
                "total_n_estudiante"=> $totalEstudiante,
            ];
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

     public function consolidadoAD4(Request $request, $external_id){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();

        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
        //$parametro = 16;
        //$submit = DB::select('call consolidado_ad4(16)');
        $submit = DB::select('call consolidado_ad4(:parametro, :parametro2)', array('parametro'=>$periodo->id, 'parametro2'=>$docenteObj->id));
        $cont =1;
        foreach($submit  as $row)
        {
            $datos['data'][] = [
                "cont" =>$cont ++,
                "cicloConsolidadoAd4" => $row->ciclo ." ".$row->paralelo,
                //"id_materia" => $row->id_materia,
                 "materia" => $row->materia,
                "horas_programadas" => $row->h_academica,
                "horas_brindadas"=> $row->tiempo,
                "n_estudiante"=> $row->estudiante,
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function ToTalHorasconsolidadoAD4(Request $request, $external_id){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();

        $docenteObj = docente::where("external_do", $external_id)->first();
        $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();

        $submit = DB::select('call consolidado_ad4(:parametro, :parametro2)', array('parametro'=>$periodo->id, 'parametro2'=>$docenteObj->id));
        $totalH =0;
        $totalE =0;
        foreach($submit  as $row)
        {
            $totalH = $totalH + $row->tiempo;
            $totalE = $totalE + $row->estudiante;
        }
        if ($totalH > 0) {
            
            $mod= $totalH % 60;
            $hora =  intval($totalH /60);
        }else{
            $hora = 0;
            $mod =0;
        }
        
         $datos['data'][] = [
                "total_horas_brindadas"=>  $hora .' hora '. $mod . ' min',
                "total_n_estudiante"=>$totalE
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
