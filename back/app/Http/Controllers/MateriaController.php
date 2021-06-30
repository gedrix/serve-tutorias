<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\Diastutoria;
use App\Models\Horatutoria;
use App\Models\Materia;
use App\Models\MateriaDocente;
use App\Models\PeriodoAcademico;
use App\Models\Reserva;
use Illuminate\Http\Request;


class MateriaController extends Controller
{
    private $estado = 400;
    private $datos = [];

    public function registrarMateria(Request $request)
    {
        if ($request->json()) {
            $data = $request->json()->all();
            $materia = new materia();
            $materia->materia = $data["materia"];
            $materia->estado = 1;
            $materia->external_ma = "Ma" . Utilidades\UUID::v4();
            $materia->save();
            return response()->json(["mensaje" => "Operacion existosa", "siglas" => "OE"], 200);
        }
    }
    public function listarMaterias()
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $materia = materia::where("estado", 1)->get();

        foreach ($materia as $value) {
            $datos['data'][] = [
                "materia" => $value->materia,
                "externalMateria" => $value->external_ma
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }
    public function registroMateriaDocente(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            $docente = docente::where("external_do", "=", $data["externalDocente"])->first();

            if ($docente) {
                $materia = materia::where("external_ma", $data["externalMateria"])->first();
                $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();

                $verificarRepetido = materiaDocente::where("id_materia", $materia->id)
                                                    ->where("id_docente", $docente->id)
                                                    ->where("estado", 1)
                                                    ->first();
                if (!$verificarRepetido) {
                    $materiaDocente = new materiaDocente();
                    $materiaDocente->id_materia = $materia->id;
                    $materiaDocente->id_docente = $docente->id;
                    $materiaDocente->id_periodo = $periodo->id;
                    $materiaDocente->estado = 1;
                    $materiaDocente->external_md = "Md" . Utilidades\UUID::v4();
                    $materiaDocente->save();

                    self::estadoJson(200, true, '');

                    $datos['data'] = [
                        "externalMateriaDocente" => $materiaDocente->external_md
                    ];
                }else{
                    self::estadoJson(400, false, 'Datos Incorrectos');
                }



                return response()->json($datos, $estado);
            }
        }
    }

    //external materiadocente

    public function eliminarMateriaDocente($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $editar = materiaDocente::where("external_md", $external_id)->first();

        $materiaDocente = materiaDocente::find($editar->id);
        $materiaDocente->estado = 0;
        $materiaDocente->save();
        self::estadoJson(200, true, '');

        return response()->json($datos, $estado);
    }

    public function ModificarMateriaDocente(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        if ($request->json()) {
            $data = $request->json()->all();
            $materia = materia::where("external_ma", $data["externalMateria"])->first();
            $editar = materiaDocente::where("external_md", "=",$data["externalMateriaDocente"])->first();
            $materiaDocente = materiaDocente::find($editar->id);

            $materiaDocente->id_materia = $materia->id;
            $materiaDocente->save();
            self::estadoJson(200, true, '');

            return response()->json($datos, $estado);
        }
    }
    public function listarMateriaDocente($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        $docente = docente::where("external_do", $external_id)->first();
        $listaMateria = materiaDocente::where("id_docente", $docente->id)
            ->where("materia_docente.estado", 1)
            ->join("materia", "materia_docente.id_materia", "materia.id")
            ->get();

        foreach ($listaMateria as $value) {
            $datos['data'][] = [
                "materia" => $value->materia,
                "externalMateria" => $value->external_ma,
                "externalMateriaDocente" => $value->external_md,

            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function listaMateriaPeriodo(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        if ($request->json()) {
            $data= $request->json()->all();
            $docente = docente::where("external_do", $data["externalDocente"])->first();
            $periodo = periodoAcademico::where("external_periodo", $data["externalPeriodo"])->first();
            $materiaDocente = materiaDocente::where("id_docente", $docente->id)
                                            ->where("id_periodo", $periodo->id )
                                            ->join("materia", "materia_docente.id_materia", "materia.id")
                                            ->get();

            foreach ($materiaDocente as $value) {
                $datos['data'][]=[
                    //"matera" => $docente->id
                    "materia"=>$value->materia,
                    "externalMateria" => $value->external_ma
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
