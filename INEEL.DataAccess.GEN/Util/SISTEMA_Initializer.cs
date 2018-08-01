using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Util
{
    public class SISTEMA_Initializer : DropCreateDatabaseIfModelChanges<GEN_Context>
    {
        private Boolean seed = false;
        public SISTEMA_Initializer(GEN_Context context)
        {
            if (!seed)
            {
                localSeed(context);                
            }
        }
        private  void localSeed(GEN_Context context)
        {
            if (!seed)
            {
                seed = true;
            }

            Console.WriteLine("Inicializando SISTEMAv3Initializer");
            //Catalogo
            Catalogo.inicializador("tipoMovimiento", "Tipos de movimientos en el sistema", new string[] { "Alta de información|alta", "Edición|edicion", "Eliminación|eliminacion", "Importación de datos|importacion", "Acceso fallido|acceso_fallido", "Acceso al sistema|inicio_sesion", "Cambio de contraseña|cambio_password", "Activación o Habilitación|activacion", "Desactivación o Deshabilitación|desactivacion", "Detección y corección|deteccion_correccion" });
            Catalogo.inicializador("estatusCatalogo", "Estatus de un catálogo", new string[] { "En edición", "Activo", "Vinculado" }); // Catalogo y opciones de: estatusCatalogo.
            Catalogo.inicializador("estatusConfiguracion", "Estatus de una variable de configuración", new string[] { "En edición", "Vinculado" }); // Catalogo y opciones de:  estatusConfiguracion            
            //Catalogo de opciones
            Opcion.inicializador();
            //// Inicializa valores de Privilegio
            //Privilegio.inicializador();
            ////Inicializa valores de Rol
            //Privilegio.inizializadorRol();
            ////Inicializa valores de usuario
            //Privilegio.inicializaUsuario();

            Configuracion.inicializador();

        }
        protected override void Seed(GEN_Context context)
        {
            if (!seed)
            {
                localSeed(context);
            }
        }
    }
}