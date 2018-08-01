using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using INEEL.DataAccess.CH.Models;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_CursoInterno")]
    public class CursoInterno
    {
        [Key]
        public int CursoInternoId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }


        //public ICollection<AdjuntoCursosPersonal> AdjuntoCursosPersonal { get; set; }

        public string Titulo { get; set; }

        public string Descripcion { get; set; }

        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }

        public DateTime FechaCurso { get; set; }
        public DateTime? FechaTermino { get; set; }

        public int TipoCursoId { get; set; }
        public TipoCurso TipoCurso { get; set; }

        public Boolean PerteneceCP { get; set; }
        //1 privado y 0 publico
        public int PrivadoPublico { get; set; }

        public ICollection<SitioWebCurso> SitioWebCurso { get; set; }

        public string Lugar { get; set; }

    }
}
