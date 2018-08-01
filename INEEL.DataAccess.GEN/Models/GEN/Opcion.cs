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
    [Table("GEN.Opcion")]
    [Serializable]
    public class Opcion
    {
        public Opcion() { }

        public int id { get; set; }

        [Required]
        public int catalogoId { get; set; }

        //[Required(ErrorMessage = "Por favor, indica un catálogo.")]
        [ForeignKey("catalogoId")]
        public virtual Catalogo catalogo { get; set; } // Instancia de catálogo a la que pertenece la opcion


        [DisplayName("Etiqueta")]
        [Required(ErrorMessage = "La etiqueta es requerida.")]
        [CheckOpcionDuplicada(ErrorMessage = "Ya existe una opción con etiqueta '{0}'.")]
        public String etiqueta { get; set; }

        [DisplayName("Valor")]
        [Required(ErrorMessage = "El valor es requerido.")]
        [CheckOpcionDuplicada(ErrorMessage = "Ya existe una opción con valor '{0}'.")]
        public String valor { get; set; }

        [DisplayName("Orden")]
        [CheckOpcionDuplicada(ErrorMessage = "Ya existe una opción con valor '{0}'.")]
        public int? orden { get; set; }



        public static List<Opcion> inicializador()
        {

            try
            {

                // Variable variable = db.Variables.Find(id);

                return new List<Opcion>
                {

                    new Opcion {id=1,  catalogoId=1, etiqueta="Alta de información", valor="alta"},
                    new Opcion {id=1,  catalogoId=1, etiqueta="Edición", valor="edicion"},
                    new Opcion {id=1,  catalogoId=1, etiqueta="Eliminación", valor="eliminacion"},
                    new Opcion {id=1,  catalogoId=1, etiqueta="Importación de datos", valor="importacion"},
                    new Opcion {id=1,  catalogoId=1, etiqueta="Acceso fallido", valor="acceso_fallido"},
                    new Opcion {id=1,  catalogoId=1, etiqueta="Acceso al sistema", valor="inicio_sesion"},
                    new Opcion {id=1,  catalogoId=1, etiqueta="Cambio de contraseña", valor="cambio_password"},
                    new Opcion {id=1,  catalogoId=1, etiqueta="Activación o Habilitación", valor="activacion"},
                    new Opcion {id=1,  catalogoId=1, etiqueta="Desactivación o Deshabilitación", valor="desactivacion"},
                    new Opcion {id=1,  catalogoId=1, etiqueta="Consulta", valor="consulta"}
                };
            }
            catch (Exception)
            {
                Console.WriteLine("ERROR en el Opcion.Inicializador()");
                return null;
            }

        }

    }

    public class CheckOpcionDuplicada : ValidationAttribute
    {

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {

            try
            {
                int catalogoId = (int)validationContext.ObjectType.GetProperty("catalogoId").GetValue(validationContext.ObjectInstance);
                int opcionId = (int)validationContext.ObjectType.GetProperty("id").GetValue(validationContext.ObjectInstance);
                string valor = (string)value.ToString().Trim();

                GEN_Context db = new GEN_Context();
                //db = null;
                var opcionInstance = (from o in db.Opcion
                                      where (
                                        o.catalogoId == catalogoId
                                        && o.id != opcionId
                                        && (
                                            o.valor.ToUpper() == valor.ToUpper()
                                            || o.etiqueta.ToUpper() == valor.ToUpper()
                                            || o.orden.ToString() == valor
                                        )
                                      )
                                      select o.id);
                if (opcionInstance.Count() > 0)
                {
                    return new ValidationResult(this.FormatErrorMessage(valor));
                }
                return ValidationResult.Success;
            }
            catch (Exception)
            {
                // return base.IsValid(value, validationContext);
                return ValidationResult.Success;
                throw;
            }
        }
    }
}