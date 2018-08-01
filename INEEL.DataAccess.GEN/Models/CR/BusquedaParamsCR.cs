using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    //Esta clase se utiliza para realizar la proyeccion de consultas en LINQ
    //En lugar de devolver un objeto anonimo (no siempre se puede en las consultas) se devuelve un objeto de este tipo
    public class BusquedaParamsCR
    {
        //Se pueden reutilizar las propiedades para las distintas consultas
        public int FondoProgramaId { get; set; }
        public int ConvocatoriaId { get; set; }
        public int ExpertoId { get; set; }
        public int ContactoId { get; set; }
        public int ConvenioId { get; set; }
        public int PaisOrigenId { get; set; }
        public int EmpresaId { get; set; }
        public int numConvocatorias { get; set; }
        public int EstudiosMercadoId { get; set; }
        public int CompetidorId { get; set; }

        public float Costo { get; set; }

        public string TipoAcceso { get; set; }
        public string TipoConvenio { get; set; }
        public string NoConvenio { get; set; }
        public string NombreFP { get; set; }
        public string ObjetoConvenio { get; set; }
        public string Tema { get; set; }
        public string Proposito { get; set; }
        public string ProyectoId { get; set; }
        public string NombreProyecto { get; set; }
        public string ClaveUnidad { get; set; }
        public string NombreUnidad { get; set; }
        public string NombreEmpresa { get; set; }
        public string NombreExperto { get; set; }
        public string NombrePais { get; set; }
        public string NombreComunidad { get; set; }
        public string Especialidad { get; set; }
        public string NombreConvocatoria { get; set; }
        public string LineaInvestigacion { get; set; }
        public string TipoFuenteFinanciamiento { get; set; }
        public string TipoCompetidor { get; set; }
        public string SegmentoMercado { get; set; }


        public Boolean Estado { get; set; }
        public DateTime Fecha { get; set; }
        public DateTime FechaRegistro { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaTermino { get; set; }
        public DateTime fechaFinalComparacion { get; set; }
        public DateTime fechaInicioComparacion { get; set; }
        
        public ICollection<Tematica> listaTematicas { get; set; }
        public List<string> listaNombretematicas { get; set; }
        public List<string> listaNombreContactos { get; set; }
        public List<string> listaProductos { get; set; }
        public List<string> listaServicios { get; set; }
        public List<Contacto> listaDeInfo { get; set; }
        public ICollection<Convocatoria> Convocatoria { get; set; }
        public ICollection<TematicaPorFondoPrograma> TematicaPorFondoPrograma { get; set; }
    }
}
