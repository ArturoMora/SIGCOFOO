using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.Catalogo")]
    [Serializable]
    public class Catalogo
    {

        public Catalogo() { }

        [Key] // Necesario indicar el Key con anotación para que funcione el Unique
        public int CatalogoId { get; set; }

        [StringLength(80)]
        [Required]
        [Index(IsUnique = true)]
        public String ClaveIdCatalogo { get; set; }   // Identifica al catálogo

        [DisplayName("Nombre descriptivo")]
        [Required(ErrorMessage = "El nombre descriptivo del catálogo es requerido.")]
        public String nombre { get; set; }         // Nombre completo del catálogo

        [DisplayName("Descripción general")]
        [DataType(DataType.MultilineText)]
        public String descripcion { get; set; }     // Descripción del catálogo

        [Required(ErrorMessage = "El estatus del catálogo es requerido.")]
        [DisplayName("Estatus")]
        public String estatus { get; set; }         // Estatus del catálogo; "En edición", "Activo", "Vinculado"

        public virtual ICollection<Opcion> opciones { get; set; }   // Opciones de valores para el catálogo


        //
        // Método estático que iniciliza valores de catalogos particularizados
        //
        public static void inicializador()
        {

            try
            {

                GEN_Context db = new GEN_Context();

                var catalogos = new List<Catalogo>
                {
                    new Catalogo
                    {
                        CatalogoId = 1,
                        ClaveIdCatalogo = "tipoMovimiento",
                        nombre = "Tipos de movimientos en el sistema",
                        descripcion = "Tipos de movimientos en el sistema",
                        estatus = "Activo"
                    }
                };

                catalogos.ForEach(catalogoInstance => db.Catalogo.Add(catalogoInstance));
                db.SaveChanges();

                //Inicialización de las opciones según el catálogo.
                var opciones = Opcion.inicializador();
                if (opciones != null)
                {
                    opciones.ForEach(opcionInstance => db.Opcion.Add(opcionInstance));
                    db.SaveChanges();
                }


            }
            catch (Exception)
            {
                Console.WriteLine("ERROR en el Catalogo.Inicializador()");
            }

        }

        //
        // Método estático para la inicialización de valores básicos de catalogos y opciones
        //
        public static void inicializador(string identificador, string nombre, string[] opciones)
        {
            try
            {
                GEN_Context db = new GEN_Context();
                

                // Verificar que sea nuevo, es decir que no exista en la BD
                int registrosCatalogo = (from catalogo in db.Catalogo where catalogo.ClaveIdCatalogo == identificador select catalogo).Count();
                if (registrosCatalogo == 0)
                {
                    var catalogoInstance = new Catalogo
                    {
                        ClaveIdCatalogo = identificador,
                        nombre = nombre,
                        descripcion = nombre,       // Se utiliza el mismo que en nombre.
                        estatus = "Activo"          // Por omisión es Activo
                    };

                    db.Catalogo.Add(catalogoInstance);
                    db.SaveChanges();
                    foreach (String opcion in opciones)
                    {
                        var opcionInstance = new Opcion();
                        opcionInstance.catalogoId = catalogoInstance.CatalogoId;
                        if (opcion.Contains("|"))
                        {
                            opcionInstance.etiqueta = opcion.Split('|')[0].ToString();
                            opcionInstance.valor = opcion.Split('|')[1].ToString();
                        }
                        else
                        {
                            opcionInstance.etiqueta = opcion;
                            opcionInstance.valor = opcion;

                        }
                        db.Opcion.Add(opcionInstance);
                    };
                    db.SaveChanges();
                }

            }
            catch (Exception e)
            {
                Console.WriteLine("ERROR en el Catalogo.inicializador(identificador, nombre, opciones)" + e.Message);
                throw;
            }

        }
    } // End of Catalogo 
}