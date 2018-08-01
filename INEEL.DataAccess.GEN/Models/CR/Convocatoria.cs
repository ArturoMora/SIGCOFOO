using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using INEEL.DataAccess.GEN.Models.CR;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_Convocatoria")]
    public class Convocatoria
    {
        public Convocatoria() { }

        [Key]
        public int ConvocatoriaId { get; set; }

        [Required]
        public int Clave { get; set; }

        [StringLength(250)]
        [Required]
        public string NombreConvocatoria { get; set; }

        //[StringLength(300)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [Required]
        public DateTime FechaInicio { get; set; }

        [Required]
        public DateTime FechaTermino { get; set; }

        public ICollection<ContactoPorConvocatoria> ContactoPorConvocatoria { get; set; }
        public ICollection<SitioWebPorConvocatoria> SitioWebPorConvocatoria { get; set; }
        public ICollection<PropuestaPorConvocatoria> PropuestaPorConvocatoria { get; set; }
        public ICollection<ProyectoPorConvocatoria> ProyectoPorConvocatoria { get; set; }
        public ICollection<AdjuntoPorConvocatoria> AdjuntoPorConvocatoria { get; set; }

        [Required]
        [ForeignKey("FondoPrograma")]
        public int FondoProgramaId { get; set; }
        public FondoPrograma FondoPrograma { get; set; }

        public string LeccionesAprendidas { get; set; }

        //[StringLength(500)]
        public string Observaciones { get; set; }

        public int? TipoFuenteFinanciamientoId { get; set; }
        public virtual TipoFuenteFinanciamiento TipoFuenteFinanciamiento { get; set; }

        public virtual List<PaisesPorConvocatoria> Paises { get; set; }

        [NotMapped]
        public string[] sitiosWeb { get; set; }

        [NotMapped]
        public int[] contactos { get; set; }

        [NotMapped]
        public string[] sitiosWebNuevos { get; set; }

        [NotMapped]
        public int[] contactosNuevos { get; set; }

        [NotMapped]
        public int[] sitiosWebAntDel { get; set; }

        [NotMapped]
        public int[] contactosAntDel { get; set; }

        [NotMapped]
        public int[] adjuntosIdAntDel { get; set; }

        [NotMapped]
        public int[] adjuntosAntDel { get; set; }

        [NotMapped]
        public string[] adjuntosNuevosRuta { get; set; }

        [NotMapped]
        public string[] adjuntosNuevosNombre { get; set; }

        [NotMapped]
        public string[] proyectosE { get; set; }

        [NotMapped]
        public string[] propuestasE { get; set; }

        [NotMapped]
        public int[] propuestasAntDel { get; set; }

        [NotMapped]
        public string[] propuestasNuevos { get; set; }

        //Proyectos
        [NotMapped]
        public int[] proyectosAntDel { get; set; }

        [NotMapped]
        public string[] proyectosNuevos { get; set; }

        ////Atributos para validador
        [NotMapped]
        public string proyectoId { get; set; }

        [NotMapped]
        public string propuestaId { get; set; }

        [NotMapped]
        public DateTime fechaInicioComparacion { get; set; }
        [NotMapped]
        public DateTime fechaFinalComparacion { get; set; }
        [NotMapped]
        public string busquedaFecha { get; set; }

    }
}
