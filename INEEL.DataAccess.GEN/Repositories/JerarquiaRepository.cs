using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    /// <summary>
    /// Jerarquía en la Estructura Organizacional</summary>
    /// /// <remarks>
    /// Jerarquia es un Modelo, no mapeado con BD</remarks>
    public class JerarquiaRepository : IDisposable
    {


        //private GEN_Context _db;
        PersonasRepository dbP;
        public JerarquiaRepository()
        {
            //  _db = new GEN_Context
            dbP = new PersonasRepository();
        }
        /// <summary>
        /// Se requiere ProyectoId, JefeHiperonimo </summary>
        public async Task<Boolean> isJefeHiperonimoDeProyecto(Jerarquia model)
        {
            if(model==null || String.IsNullOrEmpty(model.ProyectoId) || String.IsNullOrEmpty(model.JefeHiperonimo))
            {
                return false;
            }
            var proyecto= await new ProyectoRepository().GetById(model.ProyectoId);
            if (proyecto == null)
            {
                return false;
            }
            var unidadId=proyecto.UnidadOrganizacionalId;
            var unidad= await new UORepository().GetById(unidadId);
            //excepcion si no hay unidad
            String claveResponsable = unidad.ClaveResponsable;

            return  await this.isJefeHiperonimo(new Jerarquia(claveResponsable, model.JefeHiperonimo, null));
            
        }

        public async Task<Boolean> isJefeHiperonimoByUnidadOrganizacionalId(Jerarquia model)
        {
            if (model == null || String.IsNullOrEmpty(model.UnidadOrganizacionalId) )
            {
                return false;
            }           
            var unidad = await new UORepository().GetById(model.UnidadOrganizacionalId);
            //excepcion si no hay unidad
            String claveResponsable = unidad.ClaveResponsable;

            return await this.isJefeHiperonimo(new Jerarquia(claveResponsable, model.JefeHiperonimo, null));

        }

        /// <summary>
        /// Se requiere EmpleadoId, JefeHiperonimo </summary>
        public async Task<Boolean> isJefeHiperonimo(Jerarquia model)
        {
            try
            {
                if(model==null || String.IsNullOrEmpty(model.EmpleadoId) || String.IsNullOrEmpty(model.JefeHiperonimo))
                {
                    return false;
                }
                if (model.EmpleadoId.Equals(model.JefeHiperonimo))
                {
                    return true;
                }
                
                Personas empleado =await dbP.GetByClave(model.EmpleadoId);
                if (empleado == null)
                {
                    return false;
                }
                var idUnidad=empleado.ClaveUnidad;
                var unidad = await dbP.GetUnidadOrgByClaveWithoutStatus(idUnidad);
                if (unidad == null)
                    return false;                
                var responsable= await dbP.GetResponsableByClaveUnidadWithoutStatus(unidad);
                if (responsable == null)
                {
                    return false;
                }

                if (responsable.ClavePersona == model.JefeHiperonimo)
                {
                    return true;
                }
                if (String.IsNullOrEmpty(unidad.padre))
                    return false;

//unidad padre: --------------------------------------
                var unidadPadre = await dbP.GetUnidadOrgByClaveWithoutStatus(unidad.padre);
                if (unidadPadre == null)
                    return false;
                var responsablePadre = await dbP.GetResponsableByClaveUnidadWithoutStatus(unidadPadre);
                if (responsablePadre == null)
                {
                    return false;
                }

                if (responsablePadre.ClavePersona == model.JefeHiperonimo)
                {
                    return true;
                }
                if (String.IsNullOrEmpty(unidadPadre.padre))
                    return false;                

                return await isJefeHiperonimo(new Jerarquia(responsablePadre.ClavePersona, model.JefeHiperonimo, null));

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public void Dispose()
        {
            
            //dbP.Dispose();
                //ayudar al recolector de basura
            
        }
    }
}
