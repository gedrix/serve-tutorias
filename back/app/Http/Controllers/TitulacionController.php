<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use App\Models\Materia;
use App\Models\Titulacion;
use App\Models\Docente;

use Illuminate\Http\Request;

class TitulacionController extends Controller {

    private $estado = 400;
    private $datos = [];


    public function RegistroTemaTitulacion(Request $request){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            $estudianteObj = estudiante::where("external_es", $data["externalEstdudiante"])->first();
            
            $verExisteEst = Titulacion::where("estudiante", $estudianteObj->id)
                                        ->where("estado",1)
                                        ->first();
                 
            $parejaObj = '';
            if ($data["externalPareja"] != '') {
                $parejaObj = estudiante::where("external_es", $data["externalPareja"])->first();
            }
            
            $verExistepareja = Titulacion::where("pareja", $estudianteObj->id)->where("estado",1)->first();

            $docenteObj = docente::where("external_do", $data["externalDocente"])->first();
            
            if ($verExisteEst || $verExistepareja) {
                self::estadoJson(400, false, 'Ya existe un registro');
            }else{
                $titulacion = new Titulacion();
                $titulacion->tema = $data["tema"];
                $titulacion->estudiante = $estudianteObj->id;
                $titulacion->pareja = $parejaObj !='' ? $parejaObj->id : 0;
                $titulacion->id_docente = $docenteObj->id;
                $titulacion->estado = 1;
                $titulacion->external_titulacion = "ti" . Utilidades\UUID::v4();
                $titulacion->save();

                self::estadoJson(200, true, '');
                $datos['data'] = [
                    "externalTitulacion" => $titulacion->external_titulacion
                ];
            }
        }
        return response()->json($datos, $estado);
    }

    public function ModificarTemaTitulacion(Request $request){
        global $estado, $datos;
        self::iniciarObjetoJSon();

        if ($request->json()) {
            $data = $request->json()->all();
             $estudianteObj = estudiante::where("external_es", $data["externalEstdudiante"])->first();

            $titulacion = Titulacion::where("estudiante", $estudianteObj->id)
                            ->where("estado",1)
                            ->first();

            if ($titulacion  =='' || $titulacion == null) {
                $titulacion = Titulacion::where("pareja", $estudianteObj->id)
                            ->where("estado",1)
                            ->first();

            }
            $titulacionObj = Titulacion::find($titulacion->id);
            $titulacionObj->tema = $data["tema"];
            $titulacionObj->save();
            self::estadoJson(200, true, 'Tema de titulación modificado');

            return response()->json($datos, $estado);
        }
    }

    public function EliminarTemaTitulacion( $external_id){
        global $estado, $datos;
        self::iniciarObjetoJSon();

           /* $estudianteObj = estudiante::where("external_es", $data["externalEstdudiante"])->first();
            $titulacion = Titulacion::where("estudiante", $estudianteObj->id)
                            ->where("estado",1)
                            ->first();

            if ($titulacion  =='' || $titulacion == null) {
                $titulacion = Titulacion::where("pareja", $estudianteObj->id)
                            ->where("estado",1)
                            ->first();
            }*/

            $titulacion = Titulacion::where("external_titulacion", $external_id)->first();
            $titulacionObj = Titulacion::find($titulacion->id);
            $titulacionObj->estado = 0;
            $titulacionObj->save();
            self::estadoJson(200, true, 'Tema de titulación eliminado');

            return response()->json($datos, $estado);

    }

    public function listarTemaTitulacion ($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $estudianteObj = estudiante::where("external_es", $external_id)->first();

        $titulacion = Titulacion::where("estudiante", $estudianteObj->id)
                        ->where("estado", 1)
                        ->first();

        if ($titulacion =='' || $titulacion == null) {
           $titulacion = Titulacion::where("pareja", $estudianteObj->id)
                        ->where("estado", 1)
                        ->first();
        }

        if ($titulacion =='' || $titulacion == null) {
           self::estadoJson(202, false, '');
        }else{
            $datos['data'][] = [
                "tema" => $titulacion->tema,
                "docente" =>self::getNombreDocenteTitulacion($titulacion->id_docente) ,
                "external_titulacion" => $titulacion->external_titulacion,
                "estado" =>  $titulacion->estado
            ];
             self::estadoJson(200, false, '');
        }
        
        return response()->json($datos, $estado);
    }

     private function getNombreDocenteTitulacion($external)
    {
        $docente = docente::where("id", $external)->first();
        $nombre =$docente->nombres . " " . $docente->apellidos;
        return  $nombre;
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
