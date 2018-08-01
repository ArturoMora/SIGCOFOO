using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_FondoPrograma")]
    public class FondoPrograma
    {
        public FondoPrograma() { }

        [Key]
        public int FondoProgramaId { get; set; }

        [Required]
        public int Clave { get; set; }

        [StringLength(250)]
        [Required]
        public string NombreFP { get; set; }

        [StringLength(300)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [ForeignKey("Empresa")]
        public int? EmpresaId { get; set; }
        public Empresa Empresa { get; set; }

        

        [NotMapped]
        public int[] seleccion { get; set; }

        [NotMapped]
        public int[] areasNuevos { get; set; }

        [NotMapped]
        public int[] areasAntDel { get; set; }

        [NotMapped]
        public string[] sitiosWeb { get; set; }

        [NotMapped]
        public string[] sitiosWebNuevos { get; set; }

        [NotMapped]
        public int[] sitiosWebAntDel { get; set; }

        [NotMapped]
        public string[] propuestasAnteriores { get; set; }
        [NotMapped]
        public string[] proyectosAnteriores { get; set; }

        //[ForeignKey("SitioWebFondoPrograma")]
        //public int? SitioWebFondoProgramaId { get; set; }
        //public SitioWebFondoPrograma SitioWebFondoPrograma { get; set; }

        public ICollection<SitioWebFondoPrograma> SitioWebFondoPrograma { get; set; }

        public ICollection<TematicaPorFondoPrograma> TematicaPorFondoPrograma { get; set; }
        public ICollection<Convocatoria> Convocatoria { get; set; }

        [ForeignKey("FuenteFinanciamiento")]
        public int? FuenteFinanciamientoId { get; set; }
        public FuenteFinanciamiento FuenteFinanciamiento { get; set; }


        public ICollection<PropuestaPorFondo> PropuestaPorFondo { get; set; }
        public ICollection<ProyectoPorFondo> ProyectoPorFondo { get; set; }

        [NotMapped]
        public DateTime fechaInicioComparacion { get; set; }
        [NotMapped]
        public DateTime fechaFinalComparacion { get; set; }
        [NotMapped]
        public virtual ICollection<Tematica> listaTematicas { get; set; }
        [NotMapped]
        public string busquedaFecha { get; set; }
    }
}
