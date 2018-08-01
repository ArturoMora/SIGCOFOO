using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.Capitulos")]
    public class Capitulos
    {
        public int CapitulosId { get; set; }

        [MaxLength(300)]
        public string TituloLibro { get; set; }

        [MaxLength(300)]
        public string TituloCapitulo { get; set; }

        public string Editorial { get; set; }

        [MaxLength(150)]
        public string Pais { get; set; }

        public DateTime? Year { get; set; }

        public string Isbn { get; set; }

        public ICollection<EditoresCapitulo> EditoresCapitulo { get; set; }

        public ICollection<AutorExternoCapitulo> AutorExternoCapitulo { get; set; }

        public ICollection<AutorInternoCapitulo> AutorInternoCapitulo { get; set; }

        //public ICollection<AdjuntoCapitulo> AdjuntoCapitulos { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public int EstadoActivoId { get; set; }

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        public DateTime? FechaValidacion { get; set; }
        public string ClavePersona { get; set; }
        public string Abstract { get; set; }
        ////Estado capitulo no se necesita, se utiliza estadoFlujo
        //public int EstadoCapituloId { get; set; }
        //public EstadoCapitulo EstadoCapitulo { get; set; }
    }
}


