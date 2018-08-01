using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_EstudiosEspecializados")]
    public class EstudiosEspecializados
    {
        public EstudiosEspecializados() { }

        [Key]
        public int EstudiosId { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaRegistro { get; set; }
        public string PersonaAutoriza { get; set; } //platicar con JLT la procedencia de este valor
        public string PalabrasClave { get; set; }

        [ForeignKey("Adjunto")]
        public long? adjuntoId { get; set; }
        public virtual Adjunto Adjunto { get; set; }

        public Boolean TipoAcceso { get; set; }
        public string Estado { get; set; }

        [ForeignKey("Comunidad")]
        public int idCP { get; set; }
        public virtual Comunidad Comunidad { get; set; }

        [NotMapped]
        public ICollection<Autores> autores { get; set; }
        [NotMapped]
        public ICollection<Personas> personas { get; set; }
        [NotMapped]
        public string[] claveAutores { get; set; }
        [NotMapped]
        public string nombrePersona { get; set; }
        [NotMapped]
        public string nombreComunidad { get; set; }
        [NotMapped]
        public DateTime fechaInicioComparacion { get; set; }
        [NotMapped]
        public DateTime fechaFinalComparacion { get; set; }
        [NotMapped]
        public string busquedaFecha { get; set; }
    }
}
