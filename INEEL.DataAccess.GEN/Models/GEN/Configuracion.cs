using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.Configuracion")]
    public class Configuracion
    {
        public Configuracion() { }

        [Key]
        public int id { get; set; }

        [StringLength(80)]
        [Required]
        [Index(IsUnique = true)]
        public String variable { get; set; }

        [DisplayName("Nombre")]
        public String nombre { get; set; }

        [DisplayName("Valor")]
        [Required(ErrorMessage = "El valor es requerido.")]
        public String valor { get; set; }

        [DisplayName("Estatus")]
        [Required(ErrorMessage = "El estatus es requerido.")]
        public String estatus { get; set; }     // "En edición", "Vinculado"


        //
        // Método estático que iniciliza valores de variables de configuracion
        //
        public static void inicializador()
        {

            try
            {

                GEN_Context db = new GEN_Context();

                var variablesConfiguracion = new List<Configuracion>
                    {

                        new Configuracion
                        {
                            variable    = "nombreDominio",
                            nombre      = "Nombre del dominio del SAPEEv3",
                            valor       = "cfemex.com",
                            estatus     = "En edición"
                        },
                        new Configuracion
                        {
                            variable    = "remitenteDefault",
                            nombre      = "Correo electrónico remitente del sistema",
                            valor       = "noreply@dominio.com",
                            estatus     = "En edición"
                        },
                        new Configuracion
                        {
                            variable    = "recipienteDefault",
                            nombre      = "Correo electrónico recipiente del sistema",
                            valor       = "noreply@dominio.com",
                            estatus     = "En edición"
                        },

                        new Configuracion
                        {
                            variable    = "adminEmailNotification",
                            nombre      = "Correo electrónico del administrador que recibe notificaciones del sistema",
                            valor       = "adriancruz.k@gmail.com",
                            estatus     = "Activo"
                        },
                        new Configuracion
                        {
                            variable    = "maxInicialBitacoraMovs",
                            nombre      = "Cantidad maxima de registros a mostrar por default en la consulta de movimientos",
                            valor       = "500",
                            estatus     = "Activo"
                        }

                    };

                variablesConfiguracion.ForEach(configuracionInstance => db.Configuracion.Add(configuracionInstance));
                db.SaveChanges();

            }
            catch (Exception)
            {
                Console.WriteLine("ERROR en el Catalogo.Inicializador()");
            }

        } // End of inicializador()        
    }
}